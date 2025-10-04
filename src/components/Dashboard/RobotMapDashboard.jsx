import { RobotContext } from "../../context/RobotContext";
import {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import YAML from "js-yaml";
import ROSLIB from "roslib";

import '../../styles/RobotMapDash.css'

// -------------------- Main React component --------------------
const RobotMapDashboard = () => {
  const { selectedRobot } = useContext(RobotContext);
  const canvasRef = useRef(null);
  const [iotStatus, setIotStatus] = useState("Connecting...");
  const iotClient = useRef(null);

  // --- AWS IoT and Cognito Configuration ---
  const REGION = "us-east-1";
  const IOT_ENDPOINT = "ain7shdyozzxm-ats.iot.us-east-1.amazonaws.com";
  const THING_NAME = "sr1_anvi";

  const containerRef = useRef(null);
  const [mapImg, setMapImg] = useState(null);
  const [mapMeta, setMapMeta] = useState(null);

  // ✅ MODIFICATION: State now stores floating-point map coordinates (mx, my) for accuracy
  const [markers, setMarkers] = useState([]); // {id, mx, my, world, name}
  const [polygons, setPolygons] = useState([]); // {id, points: [{mx, my, world}]}
  const [drawingPolygon, setDrawingPolygon] = useState(null); // [{mx, my}]

  const [mode, setMode] = useState("pan"); // 'pan' | 'marker' | 'polygon'
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 700 });

  const dragStateRef = useRef({
    draggingMarkerId: null,
    draggingVertex: null,
    panning: false,
    startScreen: null,
  });
  // const rosRef = useRef(null);
  const [log, setLog] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [base64Input, setBase64Input] = useState('');
  // const [yamlInput, setYamlInput] = useState('resolution: 0.05 origin: [0.0, 0.0, 0.0] negate: 0 ');
  const [rosPreview, setRosPreview] = useState("");
  const [annotations, setAnnotations] = useState({ waypoints: [], zones: [] });

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
      waypoints: markers.map((m) => ({
        name: m.name,
        x: m.world.x,
        y: m.world.y,
      })),
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

  // -------------------- Utility helpers (No changes needed here) --------------------
  const base64ToUint8Array = (base64) => {
    // const binary = atob(base64);
    // const len = binary.length;
    // const bytes = new Uint8Array(len);
    // for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    // return bytes;
      if (!base64) {
        throw new Error("Empty base64 string");
      }

      // Strip off data URL prefix if present
      const cleaned = base64.replace(/^data:.*;base64,/, "").trim();

      // Remove any whitespace or line breaks
      const normalized = cleaned.replace(/[\r\n\s]/g, "");

      const binary = atob(normalized);
      const len = binary.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
  };

  const decryptAesGcm = async (rawBytes, keyBytes, iv) => {
    try {
      const keyBuf =
        keyBytes instanceof Uint8Array ? keyBytes : new Uint8Array(keyBytes);
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyBuf,
        "AES-GCM",
        false,
        ["decrypt"]
      );
      const plain = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        rawBytes
      );
      return new Uint8Array(plain);
    } catch (err) {
      console.error("decrypt failed", err);
      throw err;
    }
  };

  const parsePgm = (arrayBuffer) => {
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
      while (
        i < bytes.length &&
        bytes[i] !== 9 &&
        bytes[i] !== 10 &&
        bytes[i] !== 13 &&
        bytes[i] !== 32
      )
        i++;
      return new TextDecoder().decode(bytes.slice(start, i));
    };
    const magic = readToken();
    if (!magic || (magic !== "P5" && magic !== "P2"))
      throw new Error("Unsupported PGM format");
    const width = parseInt(readToken(), 10);
    const height = parseInt(readToken(), 10);
    const maxval = parseInt(readToken(), 10);
    while (
      i < bytes.length &&
      (bytes[i] === 9 || bytes[i] === 10 || bytes[i] === 13 || bytes[i] === 32)
    )
      i++;
    let pixels;
    if (magic === "P5") {
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
  };

  const pgmToImage = async (pgm, negate = false) => {
    const canvas = document.createElement("canvas");
    canvas.width = pgm.width;
    canvas.height = pgm.height;
    const ctx = canvas.getContext("2d");
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
  };

  const pixelToWorld = (px, py, mapMeta) => {
    const { resolution, origin, height } = mapMeta;
    const [ox, oy, otheta] = origin;
    const yFromBottom = height - 1 - py;
    const localX = (px + 0.5) * resolution;
    const localY = (yFromBottom + 0.5) * resolution;
    const cos = Math.cos(otheta || 0);
    const sin = Math.sin(otheta || 0);
    const wx = ox + (localX * cos - localY * sin);
    const wy = oy + (localX * sin + localY * cos);
    return { x: wx, y: wy };
  };

  // const worldToPixel = (wx, wy, mapMeta) => {
  //   const { resolution, origin, height } = mapMeta;
  //   const [ox, oy, otheta] = origin;
  //   const cos = Math.cos(otheta || 0);
  //   const sin = Math.sin(otheta || 0);
  //   const dx = wx - ox;
  //   const dy = wy - oy;
  //   const localX = dx * cos + dy * -sin;
  //   const localY = dx * sin + dy * cos;
  //   const px = Math.floor(localX / resolution - 0.5);
  //   const yFromBottom = Math.floor(localY / resolution - 0.5);
  //   const py = (height - 1) - yFromBottom;
  //   return { px, py };
  // }

  const clearAnnotations = () => {
    setMarkers([]);
    setPolygons([]);
    setDrawingPolygon(null);
    logMsg("Cleared annotations");
  };

  const loadMapFromPayload = useCallback(async (payload) => {
    console.log("payload : ", payload);
    try {
      const { pgmBase64, encrypted, encryption } = payload;
      console.log('pgmBase64 : ', pgmBase64)
      let bytes = base64ToUint8Array(pgmBase64);
      console.log('bytes: ', bytes)
      if (encrypted) {
        const keyBytes = base64ToUint8Array(encryption.keyBase64);
        const iv = base64ToUint8Array(encryption.ivBase64);
        bytes = await decryptAesGcm(bytes.buffer, keyBytes, iv);
      }
      const pgm = parsePgm(bytes.buffer);
      const map = {
        resolution: 1,
        origin: [0, 0, 0],
        negate: 0,
        width: pgm.width,
        height: pgm.height,
      };
      const img = await pgmToImage(pgm, map.negate === 1);
      setMapMeta(map);
      setMapImg(img);
      logMsg("Loaded map: " + pgm.width + "x" + pgm.height);
      // resetView() will be called by the useEffect that watches mapImg
    } catch (err) {
      console.error(err);
      logMsg("Failed to load map: " + (err.message || err));
    }
  }, []);

  // This effect runs resetView after a new map image is set
  useEffect(() => {
    if (mapImg) {
      resetView();
    }
  }, [mapImg]);

  useEffect(() => {
    connectToIot();
  }, []);

  useEffect(() => {
    if (!selectedRobot) return;
    try {
      const mapData = selectedRobot?.map_data || null;
      const defaultPgmMap =
        "data:image/png;base64,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";
      if (mapData?.map_pgm_base64 || defaultPgmMap) {
        // console.log(mapData, defaultPgmMap)
        const pgmBase64 = mapData?.map_pgm_base64 || defaultPgmMap;
        loadMapFromPayload({
          pgmBase64,
          encrypted: false,
          encryption: mapData?.encryption || null,
        });
      }
    } catch (err) {
      console.warn("Failed to process selectedRobot map_data:", err);
    }
  }, [selectedRobot, loadMapFromPayload]);

  // ✅ NEW: This effect makes the canvas responsive to its container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use ResizeObserver to detect when the container's size changes
    const observer = new ResizeObserver((entries) => {
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
    const waypoints = markers.map((m) => ({
      id: m.id,
      name: m.name,
      mx: m.mx,
      my: m.my,
      world: m.world,
    }));
    const zones = polygons.map((z) => ({
      id: z.id,
      points: z.points.map((p) => ({ mx: p.mx, my: p.my, world: p.world })),
    }));
    setAnnotations({ waypoints, zones });
  }, [markers, polygons]);

  useEffect(() => {
    draw();
  }, [mapImg, markers, polygons, drawingPolygon, offset, scale, canvasSize]); // Re-draw when size changes

  useEffect(() => {
    const waypoints = markers.map((m) => ({
      name: m.name,
      x: m.world.x,
      y: m.world.y,
    }));
    const zones = polygons.map((z) => ({
      id: z.id,
      points: z.points.map((p) => ({ x: p.world.x, y: p.world.y })),
    }));
    const payload = {
      type: "annotations",
      waypoints,
      zones,
      timestamp: Date.now(),
    };
    setRosPreview(JSON.stringify(payload, null, 2));
  }, [markers, polygons]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    }
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const logMsg = (s) => {
    setLog((l) =>
      [...l, `${new Date().toLocaleTimeString()}: ${s}`].slice(-200)
    );
  }
 
  const screenToMapCoord = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { mx: 0, my: 0 };
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const mx = (sx - offset.x) / scale;
    const my = (sy - offset.y) / scale;
    return { mx, my };
  }

  // const mapToScreen = (mx, my) => {
  //   const sx = mx * scale + offset.x;
  //   const sy = my * scale + offset.y;
  //   return { sx, sy };
  // }

  // ✅ MODIFICATION: Adds marker at precise floating-point map coordinates
  const addMarkerAtMap = (mx, my) => {
    if (!mapMeta) return;
    const px = Math.round(mx); // We still use rounded pixels for world coordinate conversion
    const py = Math.round(my);
    const world = pixelToWorld(px, py, mapMeta);
    const id = `m-${Date.now()}`;
    const marker = { id, mx, my, world, name: `WP-${markers.length + 1}` };
    setMarkers((s) => [...s, marker]);
    logMsg(
      `Added marker ${marker.name} @ mx=${mx.toFixed(2)}, my=${my.toFixed(2)}`
    );
  }

  const addVertexToDrawing = (mx, my) => {
    setDrawingPolygon((d) => (d ? [...d, { mx, my }] : [{ mx, my }]));
  }

  const finishPolygon = () => {
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
  const hitTestMarker = (mx, my) => {
    const r = 6 / scale; // Adjust hit radius based on zoom for consistent screen size
    for (let i = markers.length - 1; i >= 0; i--) {
      const m = markers[i];
      const dx = mx - m.mx;
      const dy = my - m.my;
      if (dx * dx + dy * dy <= r * r) return m.id;
    }
    return null;
  }

  const hitTestPolygonVertex = (mx, my) => {
    const r = 6 / scale;
    for (let zi = polygons.length - 1; zi >= 0; zi--) {
      const z = polygons[zi];
      for (let vi = 0; vi < z.points.length; vi++) {
        const p = z.points[vi];
        const dx = mx - p.mx;
        const dy = my - p.my;
        if (dx * dx + dy * dy <= r * r)
          return { zoneId: z.id, vertexIndex: vi };
      }
    }
    if (drawingPolygon) {
      for (let vi = 0; vi < drawingPolygon.length; vi++) {
        const p = drawingPolygon[vi];
        const dx = mx - p.mx;
        const dy = my - p.my;
        if (dx * dx + dy * dy <= r * r)
          return { zoneId: "drawing", vertexIndex: vi };
      }
    }
    return null;
  }

  const onMouseDown = (e) => {
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
    if (mode === "pan") {
      dragStateRef.current.panning = true;
      dragStateRef.current.startScreen = {
        x: e.clientX,
        y: e.clientY,
        ox: offset.x,
        oy: offset.y,
      };
      return;
    }
    if (mode === "marker") {
      addMarkerAtMap(mx, my);
      return;
    }
    if (mode === "polygon") {
      addVertexToDrawing(mx, my);
      return;
    }
  }

  const onMouseMove = (e) => {
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
      setMarkers((s) =>
        s.map((m) =>
          m.id === id
            ? { ...m, mx, my, world: pixelToWorld(px, py, mapMeta) }
            : m
        )
      );
      return;
    }
    if (dragStateRef.current.draggingVertex) {
      const { zoneId, vertexIndex } = dragStateRef.current.draggingVertex;
      if (zoneId === "drawing") {
        setDrawingPolygon((d) =>
          d.map((p, idx) => (idx === vertexIndex ? { mx, my } : p))
        );
      } else {
        setPolygons((s) =>
          s.map((z) =>
            z.id === zoneId
              ? {
                  ...z,
                  points: z.points.map((p, idx) =>
                    idx === vertexIndex
                      ? { ...p, mx, my, world: pixelToWorld(px, py, mapMeta) }
                      : p
                  ),
                }
              : z
          )
        );
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

  const onMouseUp = () => {
    dragStateRef.current = {};
  }

  const onDoubleClick = () => {
    if (mode === "polygon") {
      finishPolygon();
    }
  }

  const onWheel = (e) => {
    // e.preventDefault();
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

    console.log("e : ");
    setOffset({ x: newOffsetX, y: newOffsetY });
  }

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!mapImg) {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "14px monospace";
      ctx.fillText("No map loaded.", 10, 30);
      return;
    }

    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offset.x, offset.y);
    ctx.drawImage(mapImg, 0, 0);

    const lineWidth = 1.5 / scale;
    const handleRadius = 5 / scale;

    polygons.forEach((poly) => {
      ctx.beginPath();
      poly.points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.mx, p.my) : ctx.lineTo(p.mx, p.my)
      );
      ctx.closePath();
      ctx.fillStyle = "rgba(255,0,0,0.25)";
      ctx.fill();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = "red";
      ctx.stroke();
      poly.points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.mx, p.my, handleRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
        ctx.lineWidth = lineWidth / 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
      });
    });

    if (drawingPolygon && drawingPolygon.length > 0) {
      ctx.beginPath();
      drawingPolygon.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.mx, p.my) : ctx.lineTo(p.mx, p.my)
      );
      ctx.strokeStyle = "orange";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      drawingPolygon.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.mx, p.my, handleRadius, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
      });
    }

    markers.forEach((m) => {
      ctx.beginPath();
      ctx.arc(m.mx, m.my, handleRadius, 0, Math.PI * 2);
      ctx.fillStyle = "lime";
      ctx.fill();
      ctx.lineWidth = lineWidth / 2;
      ctx.strokeStyle = "black";
      ctx.stroke();
    });

    ctx.restore();
  }

  const resetView = () => {
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
    logMsg("Reset view");
  }

  // ✅ MODIFICATION: Helper for button styles to show active mode
  const activeStyle = { backgroundColor: "#a0c4ff", fontWeight: "bold" };

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        height: "80vh",
        width: "auto",
      }}
    >
      <div
        ref={containerRef}
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            border: "1px solid #ccc",
            background: "#222",
            width: "100%",
            height: "100%",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp} // Handle mouse leaving canvas
          onDoubleClick={onDoubleClick}
          onWheel={(e) => onWheel(e)}
        />

        <div
          style={{ marginTop: 8 }}
          className="map-btns-box flex justify-center align-middle gap-2 flex-wrap"
        >
          {/* ✅ MODIFICATION: Buttons now toggle mode and show active state */}
          <button
            onClick={() => setMode("pan")}
            style={mode === "pan" ? activeStyle : {}}
          >
            Pan
          </button>
          <button
            onClick={() => setMode((m) => (m === "marker" ? "pan" : "marker"))}
            style={mode === "marker" ? activeStyle : {}}
          >
            Add marker
          </button>
          <button
            onClick={() =>
              setMode((m) => (m === "polygon" ? "pan" : "polygon"))
            }
            style={mode === "polygon" ? activeStyle : {}}
          >
            Draw polygon
          </button>
          <button onClick={() => finishPolygon()}>Finish polygon</button>
          <button onClick={() => clearAnnotations()}>Clear annotations</button>
          <button onClick={() => resetView()}>Reset view</button>
          <button
            onClick={publishAnnotations}
            disabled={iotStatus !== "Connected!"}
            style={
              iotStatus !== "Connected!"
                ? { backgroundColor: "#ccc", cursor: "not-allowed" }
                : { backgroundColor: "#28a745", color: "white" }
            }
          >
            Send to Robot
          </button>
        </div>
        {/* Other controls can be added here */}
      </div>

      {/* Map Content Box */}
      <div style={{ width: 30, overflowY: "auto", height: "100%" }} className="hidden">
        <h3>Map & Annotations</h3>
        <div>
          <strong>Mode:</strong> {mode}
        </div>
        <div style={{ marginTop: 8 }}>
          <h4>Cursor</h4>
          {cursor ? (
            <div>
              <div>
                Pixel: {cursor.px}, {cursor.py}
              </div>
              {cursor.world ? (
                <div>
                  World: {cursor.world.x.toFixed(3)},{" "}
                  {cursor.world.y.toFixed(3)}
                </div>
              ) : (
                <div>No world</div>
              )}
            </div>
          ) : (
            <div>Move mouse over canvas</div>
          )}
        </div>
        <div style={{ marginTop: 8 }}>
          <h4>Markers</h4>
          <ul>
            {markers.map((m) => (
              <li key={m.id}>
                {m.name}: {m.world.x.toFixed(3)}, {m.world.y.toFixed(3)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Zones</h4>
          <ul>
            {polygons.map((z) => (
              <li key={z.id}>
                {z.id} ({z.points.length} pts)
              </li>
            ))}
          </ul>
          {drawingPolygon && <div>Drawing: {drawingPolygon.length} pts</div>}
        </div>
        <hr />
        <div style={{ marginTop: 8 }}>
          <h4>ROS message preview</h4>
          <textarea
            value={rosPreview}
            readOnly
            rows={12}
            style={{ width: "100%", fontFamily: "monospace" }}
          />
        </div>
        <div style={{ marginTop: 8 }} className="hidden">
          <h4>Console</h4>
          <div
            style={{
              height: 240,
              overflow: "auto",
              background: "#000",
              color: "#0f0",
              padding: 8,
              fontFamily: "monospace",
              fontSize: 12,
            }}
          >
            {log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// export default RobotMapDashboard;
