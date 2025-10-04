// src/components/RobotMapDashboard.js
import React, { useEffect, useRef, useState, useContext } from "react";
import '../../styles/RobotMapDash.css'
import { RobotContext } from "../../context/RobotContext";
// import useIotAndLog from "../../utils/useIotAndLog";
// import useAnnotationState from "../../utils/useAnnotationState";
// import useMapUtilities from "../../utils/useMapUtilities";

// -------------------- Main React component --------------------
const RobotMapDashboard = () => {
  const { selectedRobot } = useContext(RobotContext);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // -------------------- View State (Medium Component Logic) --------------------
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 700 });
  
  // Drag state is complex interaction logic, kept in component or a separate interaction hook
  const dragStateRef = useRef({
    draggingMarkerId: null,
    draggingVertex: null,
    panning: false,
    startScreen: null,
  });
  
  // -------------------- Hook Integration --------------------
  const { iotStatus, log, logMsg, publishAnnotations } = useIotAndLog();
  
  // useMapUtilities provides map data and conversion tools
  const { 
    mapImg, 
    mapMeta, 
    loadMapFromPayload, 
    convertPixelToWorld, 
    convertWorldToPixel 
  } = useMapUtilities(logMsg);

  // useAnnotationState provides annotation state and modifiers
  const {
    markers,
    setMarkers,
    polygons,
    setPolygons,
    drawingPolygon,
    setDrawingPolygon,
    mode,
    setMode,
    clearAnnotations,
    addMarker,
    startPolygon,
    addPolygonVertex,
    finalizePolygon,
  } = useAnnotationState(convertPixelToWorld);
  
  // -------------------- Event Handlers (Canvas interaction logic would live here) --------------------

  const resetView = () => {
    if (!mapImg || !containerRef.current) return;
    const { width: mapW, height: mapH } = mapImg;
    const { clientWidth: contW, clientHeight: contH } = containerRef.current;

    // Fit map to container, preferring the smaller scale factor
    const scaleX = contW / mapW;
    const scaleY = contH / mapH;
    const newScale = Math.min(scaleX, scaleY) * 0.95; 

    // Center the map
    const newW = mapW * newScale;
    const newH = mapH * newScale;
    const offsetX = (contW - newW) / 2;
    const offsetY = (contH - newH) / 2;

    setScale(newScale);
    setOffset({ x: offsetX, y: offsetY });
    setCanvasSize({ width: contW, height: contH }); // Adjust canvas size to container
  };
  
  // Placeholder for canvas drawing logic (e.g., in a useDrawMap hook)
  const drawMap = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (mapImg) {
        // 1. Draw Map Image
        ctx.drawImage(mapImg, offset.x, offset.y, mapImg.width * scale, mapImg.height * scale);
        
        // 2. Draw Markers
        markers.forEach(marker => {
            const screenX = offset.x + marker.mx * scale;
            const screenY = offset.y + marker.my * scale;
            // Simplified drawing: Draw a circle
            ctx.beginPath();
            ctx.arc(screenX, screenY, 5, 0, 2 / Math.pi);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.fillText(marker.name, screenX + 10, screenY - 5);
        });

        // 3. Draw Polygons
        polygons.forEach(polygon => {
            ctx.beginPath();
            polygon.points.forEach((p, index) => {
                const screenX = offset.x + p.mx * scale;
                const screenY = offset.y + p.my * scale;
                if (index === 0) {
                    ctx.moveTo(screenX, screenY);
                } else {
                    ctx.lineTo(screenX, screenY);
                }
            });
            ctx.closePath();
            ctx.strokeStyle = 'blue';
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
            ctx.fill();
        });
    }
  };

  // -------------------- Effects --------------------

  // Load map data when selectedRobot changes
  useEffect(() => {
    if (selectedRobot && selectedRobot.map_data) {
      logMsg("Robot selected. Attempting to load map data.");
      loadMapFromPayload(selectedRobot.map_data);
    }
  }, [selectedRobot, loadMapFromPayload, logMsg]);

  // Recalculate view whenever a new map image is loaded
  useEffect(() => {
    if (mapImg) {
      resetView();
    }
  }, [mapImg]);

  // Draw/Redraw map and annotations on scale/offset/annotation changes
  useEffect(() => {
    // Debounce or optimize drawing for performance if needed
    drawMap(); 
  }, [scale, offset, markers, polygons, drawingPolygon, mapImg]); 

  // -------------------- Render --------------------
  return (
    <div className="robot-map-dashboard-container" ref={containerRef}>
      <h2>Robot Map Dashboard ({selectedRobot?.name || "No Robot"})</h2>
      
      {/* Map Tools */}
      <div className="map-controls">
        <p>IoT Status: <strong>{iotStatus}</strong> | Mode: <strong>{mode}</strong></p>
        <button onClick={() => setMode("pan")}>Pan</button>
        <button onClick={() => setMode("marker")}>Add Marker</button>
        <button onClick={() => setMode("polygon")}>Draw Zone</button>
        <button onClick={() => publishAnnotations(markers, polygons)} disabled={iotStatus !== "Connected!"}>
          Publish Annotations
        </button>
        <button onClick={clearAnnotations}>Clear All</button>
        <button onClick={resetView}>Reset View</button>
      </div>
      
      {/* Map Area */}
      <div className="map-canvas-wrapper" style={{ width: canvasSize.width, height: canvasSize.height }}>
        <canvas 
          ref={canvasRef} 
          width={canvasSize.width} 
          height={canvasSize.height}
          // Add onMouseDown, onMouseMove, onMouseUp handlers here to implement pan/draw logic
        />
        {!mapImg && <p className="loading-message">Waiting for map data...</p>}
      </div>

      {/* Log Panel */}
      <div className="log-panel">
        <h3>Activity Log</h3>
        {log.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      {/* Annotation Data Display */}
      <div className="annotation-data">
        <h4>Waypoints ({markers.length})</h4>
        {/* Simplified display */}
        {markers.map(m => <p key={m.id}>({m.name}): WX:{m.world.x.toFixed(2)}, WY:{m.world.y.toFixed(2)}</p>)}
        <h4>Zones ({polygons.length})</h4>
        {polygons.map(p => <p key={p.id}>Zone {p.id}: {p.points.length} Vertices</p>)}
      </div>

    </div>
  );
};

export default RobotMapDashboard;