import { RobotContext } from '../../context/RobotContext';
import React, { useEffect, useRef, useState, useContext } from 'react';
import YAML from 'js-yaml';
import ROSLIB from 'roslib';

// -------------------- Utility helpers (No changes needed here) --------------------
function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function decryptAesGcm(rawBytes, keyBytes, iv) {
  try {
    const keyBuf = keyBytes instanceof Uint8Array ? keyBytes : new Uint8Array(keyBytes);
    const cryptoKey = await window.crypto.subtle.importKey('raw', keyBuf, 'AES-GCM', false, ['decrypt']);
    const plain = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, rawBytes);
    return new Uint8Array(plain);
  } catch (err) {
    console.error('decrypt failed', err);
    throw err;
  }
}

function parsePgm(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let i = 0;
  const readToken = () => {
    while (i < bytes.length) {
      const ch = bytes[i];
      if (ch === 35) {
        while (i < bytes.length && bytes[i] !== 10) i++;
      } else if (ch === 9 || ch === 10 || ch === 13 || ch === 32) {
        i++;
      } else break;
    }
    let start = i;
    while (i < bytes.length && bytes[i] !== 9 && bytes[i] !== 10 && bytes[i] !== 13 && bytes[i] !== 32) i++;
    return new TextDecoder().decode(bytes.slice(start, i));
  };
  const magic = readToken();
  if (!magic || (magic !== 'P5' && magic !== 'P2')) throw new Error('Unsupported PGM format');
  const width = parseInt(readToken(), 10);
  const height = parseInt(readToken(), 10);
  const maxval = parseInt(readToken(), 10);
  while (i < bytes.length && (bytes[i] === 9 || bytes[i] === 10 || bytes[i] === 13 || bytes[i] === 32)) i++;
  let pixels;
  if (magic === 'P5') {
    const expected = width * height * (maxval < 256 ? 1 : 2);
    pixels = bytes.slice(i, i + expected);
    if (maxval >= 256) {
      const out = new Uint8Array(width * height);
      for (let p = 0; p < width * height; p++) {
        const hi = pixels[p * 2];
        const lo = pixels[p * 2 + 1];
        const val = (hi << 8) + lo;
        out[p] = Math.round((val / maxval) * 255);
      }
      pixels = out;
    }
  } else {
    const out = new Uint8Array(width * height);
    for (let p = 0; p < width * height; p++) {
      out[p] = Math.round((parseInt(readToken(), 10) / maxval) * 255);
    }
    pixels = out;
  }
  return { magic, width, height, maxval, pixels };
}

async function pgmToImage(pgm, negate = false) {
  const canvas = document.createElement('canvas');
  canvas.width = pgm.width;
  canvas.height = pgm.height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(pgm.width, pgm.height);
  for (let i = 0; i < pgm.pixels.length; i++) {
    let v = pgm.pixels[i];
    if (negate) v = 255 - v;
    imgData.data[i * 4] = v;
    imgData.data[i * 4 + 1] = v;
    imgData.data[i * 4 + 2] = v;
    imgData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const img = new window.Image();
  img.src = canvas.toDataURL();
  await new Promise((resolve) => (img.onload = resolve));
  return img;
}

function pixelToWorld(px, py, mapMeta) {
  const { resolution, origin, height } = mapMeta;
  const [ox, oy, otheta] = origin;
  const yFromBottom = (height - 1) - py;
  const localX = (px + 0.5) * resolution;
  const localY = (yFromBottom + 0.5) * resolution;
  const cos = Math.cos(otheta || 0);
  const sin = Math.sin(otheta || 0);
  const wx = ox + (localX * cos - localY * sin);
  const wy = oy + (localX * sin + localY * cos);
  return { x: wx, y: wy };
}

function worldToPixel(wx, wy, mapMeta) {
  const { resolution, origin, height } = mapMeta;
  const [ox, oy, otheta] = origin;
  const cos = Math.cos(otheta || 0);
  const sin = Math.sin(otheta || 0);
  const dx = wx - ox;
  const dy = wy - oy;
  const localX = dx * cos + dy * -sin;
  const localY = dx * sin + dy * cos;
  const px = Math.floor(localX / resolution - 0.5);
  const yFromBottom = Math.floor(localY / resolution - 0.5);
  const py = (height - 1) - yFromBottom;
  return { px, py };
}
// -------------------- Main React component --------------------
export default function RobotMapDashboard() {
  const { selectedRobot } = useContext(RobotContext);
  const canvasRef = useRef(null);
   const [iotStatus, setIotStatus] = useState("Connecting...");
  const iotClient = useRef(null);

  // --- AWS IoT and Cognito Configuration ---
  const REGION = "us-east-1";
  const IDENTITY_POOL_ID = "us-east-1:c752bc7c-b58e-4d8c-9ea8-3d0f4265f9fe";
  const IOT_ENDPOINT = "ain7shdyozzxm-ats.iot.us-east-1.amazonaws.com";
  const THING_NAME = "sr1_anvi";

  const containerRef = useRef(null);
  const [mapImg, setMapImg] = useState(null);
  const [mapMeta, setMapMeta] = useState(null);
  
  // ✅ MODIFICATION: State now stores floating-point map coordinates (mx, my) for accuracy
  const [markers, setMarkers] = useState([]); // {id, mx, my, world, name}
  const [polygons, setPolygons] = useState([]); // {id, points: [{mx, my, world}]}
  const [drawingPolygon, setDrawingPolygon] = useState(null); // [{mx, my}]
  
  const [mode, setMode] = useState('pan'); // 'pan' | 'marker' | 'polygon'
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 700 });

  const dragStateRef = useRef({ draggingMarkerId: null, draggingVertex: null, panning: false, startScreen: null });
  const rosRef = useRef(null);
  const [log, setLog] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [base64Input, setBase64Input] = useState('');
  const [yamlInput, setYamlInput] = useState('resolution: 0.05 origin: [0.0, 0.0, 0.0] negate: 0 ');
  const [rosPreview, setRosPreview] = useState('');
  const [annotations, setAnnotations] = useState({ waypoints: [], zones: [] });

  // ... inside the RobotMapDashboard component ...

// ✅ ADD THIS useEffect to handle the entire AWS IoT connection process
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1158.0.min.js";
  script.async = true;

  const connectToIot = async () => {
    try {
      await window.AWS.config.credentials.getPromise();
      if (iotClient.current) {
        setIotStatus("Already Connected");
        return;
      }
      iotClient.current = new window.AWS.IotData({
        endpoint: IOT_ENDPOINT,
        region: REGION,
      });
      setIotStatus("Connected!");
      logMsg("✅ Successfully connected to AWS IoT Core.");
    } catch (err) {
      console.error("Connection failed:", err);
      setIotStatus("Connection Failed");
      logMsg(`❌ Connection failed: ${err.message}. Retrying...`);
      setTimeout(connectToIot, 5000);
    }
  };

  script.onload = () => {
    if (window.AWS) {
      window.AWS.config.update({
        region: REGION,
        credentials: new window.AWS.CognitoIdentityCredentials({
          IdentityPoolId: IDENTITY_POOL_ID,
        }),
      });
      connectToIot();
    } else {
      console.error("AWS SDK failed to load");
      setIotStatus("SDK Load Error");
    }
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
    iotClient.current = null;
  };
}, []); // Empty array ensures this runs only once on mount
// ... inside the RobotMapDashboard component ...

// ✅ ADD THIS function to send your map data via AWS IoT
const publishAnnotations = () => {
  if (iotStatus !== "Connected!") {
    logMsg("❌ Cannot send: Not connected to AWS IoT.");
    return;
  }
  if (markers.length === 0 && polygons.length === 0) {
    logMsg("Cannot send: No annotations to publish.");
    return;
  }

  // Define the topic and a payload structure to differentiate from movement commands
  const payload = {
    type: "annotations",
    waypoints: markers.map((m) => ({ name: m.name, x: m.world.x, y: m.world.y })),
    zones: polygons.map((z) => ({
      id: z.id,
      points: z.points.map((p) => ({ x: p.world.x, y: p.world.y })),
    })),
    timestamp: Date.now(),
  };

  console.log("Publishing annotations:", payload);
  const params = {
    topic: `${THING_NAME}/commands/movement`,
    payload: JSON.stringify(payload),
    qos: 0,
  };

  logMsg(`🚀 Publishing  to ${params.topic}...`);

  iotClient.current.publish(params, (err) => {
    if (err) {
      console.error("Publish failed:", err);
      logMsg(`❌ Publish failed: ${err.message}`);
    } else {
      logMsg("✅ sent successfully!");
    }
  });
};

// ... other functions like resetView(), etc.

  useEffect(() => {
    if (!selectedRobot) return;
    try {
      const mapData = selectedRobot.map_data;
      if (mapData?.map_pgm_base64) {
        const pgmBase64 = mapData.map_pgm_base64;
        loadMapFromPayload({
          pgmBase64,
          encrypted: false,
          encryption: mapData.encryption || null,
        });
      }
    } catch (err) {
      console.warn("Failed to process selectedRobot map_data:", selectedRobot, err);
    }
  }, [selectedRobot]);

  // ✅ NEW: This effect makes the canvas responsive to its container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use ResizeObserver to detect when the container's size changes
    const observer = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        setCanvasSize({ width, height });
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // ✅ NEW: This effect refits the map image whenever the canvas size changes
  useEffect(() => {
    if (mapImg) {
        resetView();
    }
  }, [canvasSize]);


  useEffect(() => {
    const waypoints = markers.map(m => ({ id: m.id, name: m.name, mx: m.mx, my: m.my, world: m.world }));
    const zones = polygons.map(z => ({ id: z.id, points: z.points.map(p => ({ mx: p.mx, my: p.my, world: p.world }))}));
    setAnnotations({ waypoints, zones });
  }, [markers, polygons]);
  
  useEffect(() => {
    draw();
  }, [mapImg, markers, polygons, drawingPolygon, offset, scale, canvasSize]); // Re-draw when size changes

  useEffect(() => {
    const waypoints = markers.map((m) => ({ name: m.name, x: m.world.x, y: m.world.y }));
    const zones = polygons.map((z) => ({ id: z.id, points: z.points.map((p) => ({ x: p.world.x, y: p.world.y })) }));
    const payload = { type: 'annotations', waypoints, zones, timestamp: Date.now() };
    setRosPreview(JSON.stringify(payload, null, 2));
  }, [markers, polygons]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function handleWheel(e) { if (e.ctrlKey || e.metaKey) e.preventDefault(); }
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);


  function logMsg(s) {
    setLog((l) => [...l, `${new Date().toLocaleTimeString()}: ${s}`].slice(-200));
  }

  function clearAnnotations() {
    setMarkers([]);
    setPolygons([]);
    setDrawingPolygon(null);
    logMsg('Cleared annotations');
  }

  async function loadMapFromPayload(payload) {
    try {
      const { pgmBase64, encrypted, encryption } = payload;
      let bytes = base64ToUint8Array(pgmBase64);
      if (encrypted) {
        const keyBytes = base64ToUint8Array(encryption.keyBase64);
        const iv = base64ToUint8Array(encryption.ivBase64);
        bytes = await decryptAesGcm(bytes.buffer, keyBytes, iv);
      }
      const pgm = parsePgm(bytes.buffer);
      const map = {
        resolution: 1, origin: [0, 0, 0], negate: 0,
        width: pgm.width, height: pgm.height,
      };
      const img = await pgmToImage(pgm, map.negate === 1);
      setMapMeta(map);
      setMapImg(img);
      logMsg('Loaded map: ' + pgm.width + 'x' + pgm.height);
      // resetView() will be called by the useEffect that watches mapImg
    } catch (err) {
      console.error(err);
      logMsg('Failed to load map: ' + (err.message || err));
    }
  }

    // This effect runs resetView after a new map image is set
    useEffect(() => {
        if (mapImg) {
            resetView();
        }
    }, [mapImg]);

  function screenToMapCoord(clientX, clientY) {
    const canvas = canvasRef.current;
    if (!canvas) return { mx: 0, my: 0 };
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const mx = (sx - offset.x) / scale;
    const my = (sy - offset.y) / scale;
    return { mx, my };
  }

  function mapToScreen(mx, my) {
    const sx = mx * scale + offset.x;
    const sy = my * scale + offset.y;
    return { sx, sy };
  }

  // ✅ MODIFICATION: Adds marker at precise floating-point map coordinates
  function addMarkerAtMap(mx, my) {
    if (!mapMeta) return;
    const px = Math.round(mx); // We still use rounded pixels for world coordinate conversion
    const py = Math.round(my);
    const world = pixelToWorld(px, py, mapMeta);
    const id = `m-${Date.now()}`;
    const marker = { id, mx, my, world, name: `WP-${markers.length + 1}` };
    setMarkers((s) => [...s, marker]);
    logMsg(`Added marker ${marker.name} @ mx=${mx.toFixed(2)}, my=${my.toFixed(2)}`);
  }

  function addVertexToDrawing(mx, my) {
    setDrawingPolygon((d) => (d ? [...d, { mx, my }] : [{ mx, my }]));
  }

  function finishPolygon() {
    if (!drawingPolygon || drawingPolygon.length < 3) return;
    const id = `z-${Date.now()}`;
    const pts = drawingPolygon.map((p) => {
        const px = Math.round(p.mx);
        const py = Math.round(p.my);
        return { mx: p.mx, my: p.my, world: pixelToWorld(px, py, mapMeta) };
    });
    setPolygons((s) => [...s, { id, points: pts }]);
    setDrawingPolygon(null);
    logMsg(`Finished polygon ${id}`);
  }

  // ✅ MODIFICATION: Hit testing now uses precise map coordinates
  function hitTestMarker(mx, my) {
    const r = 6 / scale; // Adjust hit radius based on zoom for consistent screen size
    for (let i = markers.length - 1; i >= 0; i--) {
      const m = markers[i];
      const dx = mx - m.mx;
      const dy = my - m.my;
      if (dx * dx + dy * dy <= r * r) return m.id;
    }
    return null;
  }

  function hitTestPolygonVertex(mx, my) {
    const r = 6 / scale;
    for (let zi = polygons.length - 1; zi >= 0; zi--) {
      const z = polygons[zi];
      for (let vi = 0; vi < z.points.length; vi++) {
        const p = z.points[vi];
        const dx = mx - p.mx;
        const dy = my - p.my;
        if (dx * dx + dy * dy <= r * r) return { zoneId: z.id, vertexIndex: vi };
      }
    }
    if (drawingPolygon) {
      for (let vi = 0; vi < drawingPolygon.length; vi++) {
        const p = drawingPolygon[vi];
        const dx = mx - p.mx;
        const dy = my - p.my;
        if (dx * dx + dy * dy <= r * r) return { zoneId: 'drawing', vertexIndex: vi };
      }
    }
    return null;
  }

  function onMouseDown(e) {
    const { mx, my } = screenToMapCoord(e.clientX, e.clientY);
    const markerId = hitTestMarker(mx, my);
    if (markerId) {
      dragStateRef.current.draggingMarkerId = markerId;
      return;
    }
    const v = hitTestPolygonVertex(mx, my);
    if (v) {
      dragStateRef.current.draggingVertex = v;
      return;
    }
    if (mode === 'pan') {
      dragStateRef.current.panning = true;
      dragStateRef.current.startScreen = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
      return;
    }
    if (mode === 'marker') {
      addMarkerAtMap(mx, my);
      return;
    }
    if (mode === 'polygon') {
      addVertexToDrawing(mx, my);
      return;
    }
  }

  function onMouseMove(e) {
    const { mx, my } = screenToMapCoord(e.clientX, e.clientY);
    const px = Math.round(mx);
    const py = Math.round(my);

    if (mapMeta) {
      setCursor({ px, py, world: pixelToWorld(px, py, mapMeta) });
    } else {
      setCursor({ px, py, world: null });
    }

    if (dragStateRef.current.draggingMarkerId) {
      const id = dragStateRef.current.draggingMarkerId;
      setMarkers((s) => s.map((m) => (m.id === id ? { ...m, mx, my, world: pixelToWorld(px, py, mapMeta) } : m)));
      return;
    }
    if (dragStateRef.current.draggingVertex) {
      const { zoneId, vertexIndex } = dragStateRef.current.draggingVertex;
      if (zoneId === 'drawing') {
        setDrawingPolygon((d) => d.map((p, idx) => (idx === vertexIndex ? { mx, my } : p)));
      } else {
        setPolygons((s) => s.map((z) => (z.id === zoneId ? { ...z, points: z.points.map((p, idx) => (idx === vertexIndex ? { ...p, mx, my, world: pixelToWorld(px, py, mapMeta) } : p)) } : z)));
      }
      return;
    }
    if (dragStateRef.current.panning && dragStateRef.current.startScreen) {
      const ss = dragStateRef.current.startScreen;
      const dx = e.clientX - ss.x;
      const dy = e.clientY - ss.y;
      setOffset({ x: ss.ox + dx, y: ss.oy + dy });
    }
  }

  function onMouseUp() {
    dragStateRef.current = {};
  }

  function onDoubleClick(e) {
    if (mode === 'polygon') {
      finishPolygon();
    }
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = -e.deltaY;
    const zoomFactor = delta > 0 ? 1.08 : 0.92;
    const { left, top } = canvasRef.current.getBoundingClientRect();
    const sx = e.clientX - left;
    const sy = e.clientY - top;
    const beforeX = (sx - offset.x) / scale;
    const beforeY = (sy - offset.y) / scale;
    const newScale = Math.max(0.1, Math.min(10, scale * zoomFactor));
    const newOffsetX = sx - beforeX * newScale;
    const newOffsetY = sy - beforeY * newScale;
    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!mapImg) {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText('No map loaded.', 10, 30);
      return;
    }

    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offset.x, offset.y);
    ctx.drawImage(mapImg, 0, 0);

    const lineWidth = 1.5 / scale;
    const handleRadius = 5 / scale;

    polygons.forEach((poly) => {
      ctx.beginPath();
      poly.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.mx, p.my) : ctx.lineTo(p.mx, p.my));
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,0,0,0.25)';
      ctx.fill();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = 'red';
      ctx.stroke();
      poly.points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.mx, p.my, handleRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fill();
        ctx.lineWidth = lineWidth / 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
      });
    });

    if (drawingPolygon && drawingPolygon.length > 0) {
      ctx.beginPath();
      drawingPolygon.forEach((p, i) => i === 0 ? ctx.moveTo(p.mx, p.my) : ctx.lineTo(p.mx, p.my));
      ctx.strokeStyle = 'orange';
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      drawingPolygon.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.mx, p.my, handleRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'orange';
        ctx.fill();
      });
    }

    markers.forEach((m) => {
      ctx.beginPath();
      ctx.arc(m.mx, m.my, handleRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'lime';
      ctx.fill();
      ctx.lineWidth = lineWidth / 2;
      ctx.strokeStyle = 'black';
      ctx.stroke();
    });

    ctx.restore();
  }

  function resetView() {
    if (!mapImg || !canvasRef.current) return;
    const cw = canvasRef.current.width;
    const ch = canvasRef.current.height;
    const sx = cw / mapImg.width;
    const sy = ch / mapImg.height;
    const s = Math.min(sx, sy) * 0.95; // Add a little padding
    setScale(s);
    const ox = (cw - mapImg.width * s) / 2;
    const oy = (ch - mapImg.height * s) / 2;
    setOffset({ x: ox, y: oy });
    logMsg('Reset view');
  }

  // ✅ MODIFICATION: Helper for button styles to show active mode
  const activeStyle = { backgroundColor: '#a0c4ff', fontWeight: 'bold' };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', height: '80vh' }}>
      <div ref={containerRef} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{ border: '1px solid #ccc', background: '#222', width: '100%', height: '100%' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp} // Handle mouse leaving canvas
          onDoubleClick={onDoubleClick}
          onWheel={onWheel}
        />
        <div style={{ marginTop: 8 }}>
            {/* ✅ MODIFICATION: Buttons now toggle mode and show active state */}
            <button onClick={() => setMode('pan')} style={mode === 'pan' ? activeStyle : {}}>Pan</button>
            <button onClick={() => setMode(m => m === 'marker' ? 'pan' : 'marker')} style={mode === 'marker' ? activeStyle : {}}>Add marker</button>
            <button onClick={() => setMode(m => m === 'polygon' ? 'pan' : 'polygon')} style={mode === 'polygon' ? activeStyle : {}}>Draw polygon</button>
            <button onClick={() => finishPolygon()}>Finish polygon</button>
            <button onClick={() => clearAnnotations()}>Clear annotations</button>
            <button onClick={() => resetView()}>Reset view</button>
              <button
          onClick={publishAnnotations}
          disabled={iotStatus !== 'Connected!'}
          style={iotStatus !== 'Connected!' ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : { backgroundColor: '#28a745', color: 'white' }}
        >
          Send to Robot
        </button>
        </div>
        {/* Other controls can be added here */}
      </div>

      <div style={{ width: 420, overflowY: 'auto', height: '100%' }}>
        <h3>Map & Annotations</h3>
        <div><strong>Mode:</strong> {mode}</div>
        <div style={{ marginTop: 8 }}>
          <h4>Cursor</h4>
          {cursor ? (
            <div>
              <div>Pixel: {cursor.px}, {cursor.py}</div>
              {cursor.world ? <div>World: {cursor.world.x.toFixed(3)}, {cursor.world.y.toFixed(3)}</div> : <div>No world</div>}
            </div>
          ) : ( <div>Move mouse over canvas</div> )}
        </div>
        <div style={{ marginTop: 8 }}>
          <h4>Markers</h4>
          <ul>{markers.map((m) => <li key={m.id}>{m.name}: {m.world.x.toFixed(3)}, {m.world.y.toFixed(3)}</li>)}</ul>
        </div>
        <div>
          <h4>Zones</h4>
          <ul>{polygons.map((z) => <li key={z.id}>{z.id} ({z.points.length} pts)</li>)}</ul>
          {drawingPolygon && (<div>Drawing: {drawingPolygon.length} pts</div>)}
        </div>
        <hr />
        <div style={{ marginTop: 8 }}>
          <h4>ROS message preview</h4>
          <textarea value={rosPreview} readOnly rows={12} style={{ width: '100%', fontFamily: 'monospace' }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <h4>Console</h4>
          <div style={{ height: 240, overflow: 'auto', background: '#000', color: '#0f0', padding: 8, fontFamily: 'monospace', fontSize: 12 }}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}