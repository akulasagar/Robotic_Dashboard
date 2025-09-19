import { useContext, useEffect, useState } from "react";
import { RobotContext } from "../../context/RobotContext";

const MqttDashboard = () => {
  const [messages, setMessages] = useState([]);
  const { setRobotControlsData } = useContext(RobotContext);

  useEffect(() => {
    // Connect to local WebSocket server
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket backend");
    };

    ws.onmessage = (event) => {
      console.log("📩 Message from backend:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from WebSocket backend");
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      try {
        const parsed = JSON.parse(lastMessage); // assuming JSON messages
        setRobotControlsData(parsed?.message);
        console.log("✅ Updated robotControlsData from WS:", parsed);
      } catch (err) {
        console.warn("⚠️ Could not parse WS message:", lastMessage, err);
      }
    }
  }, [messages, setRobotControlsData]);

  return (
    <div className="bg-gray-500 w-full text-white p-4">
      <h2>🤖 Robot Live Data</h2>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
};

export default MqttDashboard;
