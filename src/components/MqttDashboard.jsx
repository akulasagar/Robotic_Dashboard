import { useContext, useEffect, useRef } from "react";
import { RobotContext } from "../context/RobotContext";

const MqttDashboard = () => {
  const { setRobotControlsData } = useContext(RobotContext);

  // Use ref instead of state to avoid re-renders for every message
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket backend");
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data); // expecting JSON
        if (parsed?.message) {
          setRobotControlsData(parsed.message); // directly update context
          // console.log("✅ Updated robotControlsData:", parsed.message);
        }
      } catch (err) {
        console.warn("⚠️ Could not parse WS message:", event.data, err);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from WebSocket backend");
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [setRobotControlsData]);

  return null;
};

export default MqttDashboard;
