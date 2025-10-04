import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Robots from "./pages/Robots";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Events from "./pages/Events";
import Control from "./pages/Control";

import { RobotContext } from "./context/RobotContext";
import { useContext, useEffect, useRef } from "react";
import MqttDashboard from "./components/MqttDashboard";
import MapManagement from "./pages/MapManagement";

const App = () => {
  const iotClient = useRef(null);
  const { selectedRobot } = useContext(RobotContext);

  // --- AWS IoT and Cognito Configuration ---
  const REGION = "us-east-1";
  const IDENTITY_POOL_ID = "us-east-1:c752bc7c-b58e-4d8c-9ea8-3d0f4265f9fe";
  const IOT_ENDPOINT = "ain7shdyozzxm-ats.iot.us-east-1.amazonaws.com";

  // Connect to AWS IoT once
  const connectToIot = async () => {
    try {
      await window.AWS.config.credentials.getPromise();

      if (iotClient.current) {
        console.log("✅ Already Connected to AWS IoT");
        return;
      }

      iotClient.current = new window.AWS.IotData({
        endpoint: IOT_ENDPOINT,
        region: REGION,
      });

      console.log("✅ Connected to AWS IoT Core");
    } catch (err) {
      console.error("❌ Connection failed:", err);
      setTimeout(connectToIot, 5000); // retry after 5s
    }
  };

  // Load AWS SDK once on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1158.0.min.js";
    script.async = true;

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
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);

      if (iotClient.current) {
        iotClient.current = null; // cleanup ref
        console.log("⚠️ IoT client disconnected");
      }
    };
  }, []); // ✅ only run once

  // Handle selectedRobot changes (subscribe / update logic can go here)
  useEffect(() => {
    if (!selectedRobot) return;

    console.log("🔄 Selected robot changed:", selectedRobot);

    // 👉 subscribe / publish logic per robot goes here
    // Example:
    // iotClient.current.publish({ topic: `robots/${selectedRobot.roboid}/subscribe`, ... })

  }, [selectedRobot]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Robots />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/controls" element={<Control />} />
        <Route path="/mapmanagement" element={<MapManagement />} />
      </Routes>
      <MqttDashboard />
    </Router>
  );
};

export default App;
