import { useContext, useEffect, useRef } from "react";
import { RobotContext } from "../context/RobotContext";

const MqttDashboard = () => {
  const { setRobotControlsData } = useContext(RobotContext);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        console.log("📩 Live WS message:", data);

        // ✅ Pass directly to provider
        setRobotControlsData(data.message); 
        // ^ data.message should contain { map_data, robot_status }
      } catch (err) {
        console.warn("⚠️ Could not parse WS message:", event.data, err);
      }
    };

    ws.onclose = () => console.log("🔌 WebSocket disconnected");
    return () => ws.close();
  }, [setRobotControlsData]);

  return null; // This component just sets up WebSocket connection
};

export default MqttDashboard;
