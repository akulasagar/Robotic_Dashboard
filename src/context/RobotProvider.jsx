// RobotProvider.jsx
import { useEffect, useState } from "react";
import { RoboData2 } from "../utils/RoboData2";
import { RobotContext } from "./RobotContext";

// Safe JSON parse helper
const safeParse = (value, fallback) => {
  try {
    if (!value || value === "undefined") return fallback;
    return JSON.parse(value);
  } catch (err) {
    console.warn("⚠️ Failed to parse storage value:", err);
    return fallback;
  }
};

export const RobotProvider = ({ children }) => {
  const [robots, setRobots] = useState(RoboData2 || []);

  const [robotControlsData, setRobotControlsData] = useState(() =>
    safeParse(sessionStorage.getItem("robotControlsData"), {})
  );

  const [selectedRobot, setSelectedRobot] = useState(() =>
    safeParse(localStorage.getItem("selectedRobot"), null)
  );

  // Persist selectedRobot
  useEffect(() => {
    if (selectedRobot) {
      localStorage.setItem("selectedRobot", JSON.stringify(selectedRobot));
    }
  }, [selectedRobot]);

  // Format robot live data into standard object
  const formatRobotData = (newData) => ({
    s_no: newData.sNo || "SRV-00",
    robotid: newData.roboId || "Robot-1",
    type: newData.robotType || "SRV",
    status: newData.status || "Idle",
    name: newData.robotName || "SurveillanceRobot-01",
    image: newData.robotImg || "/SurveillanceRobo1.png",
    battery: newData.batteryStatus || "72",
    location: newData.robotLocation || "My Home Apartments",
    health: newData.robotHealth || "50%",
    temperature: newData.temp || "23°c",
    alerts: newData.alerts || [],
    avg_speed: newData.avgSpeed || "50",
    current_speed: newData.currentSpeed || "0",
    signal_strength: newData.signalStrength || "Good",
    // keep logs locally
    event_logs: [],
  });

  // Update robots with live data
  const updateRobotControlsData = (newData) => {
    const formatted = formatRobotData(newData);

    setRobots((prev) => {
      const idx = prev.findIndex((r) => r.robotid === formatted.robotid);

      if (idx !== -1) {
        const updated = [...prev];
        const oldRobot = updated[idx];

        // 🟢 Generate log if status changed
        if (oldRobot.status !== formatted.status) {
          formatted.event_logs = [
            {
              time_date: new Date().toLocaleString(),
              event: `Status changed from ${oldRobot.status} → ${formatted.status}`,
              status: formatted.status,
            },
            ...oldRobot.event_logs,
          ];
        } else {
          formatted.event_logs = oldRobot.event_logs;
        }

        // 🟢 Add alerts if any
        if (formatted.alerts && formatted.alerts.length > 0) {
          formatted.alerts.forEach((a) => {
            formatted.event_logs = [
              {
                time_date: new Date().toLocaleString(),
                event: `ALERT: ${a}`,
                status: formatted.status,
              },
              ...formatted.event_logs,
            ];
          });

          formatted.alerts = [...(oldRobot.alerts || []), ...formatted.alerts];
        } else {
          formatted.alerts = oldRobot.alerts || [];
        }

        updated[idx] = formatted;
        return updated;
      } else {
        // new robot → prepend at index 0
        formatted.event_logs = [
          {
            time_date: new Date().toLocaleString(),
            event: "Robot registered in system",
            status: formatted.status,
          },
        ];
        return [formatted, ...prev];
      }
    });

    setRobotControlsData(formatted);
  };

  // Persist robotControlsData
  useEffect(() => {
    sessionStorage.setItem(
      "robotControlsData",
      JSON.stringify(robotControlsData)
    );
  }, [robotControlsData]);

  return (
    <RobotContext.Provider
      value={{
        robots,
        selectedRobot,
        setSelectedRobot,
        robotControlsData,
        setRobotControlsData: updateRobotControlsData,
      }}
    >
      {children}
    </RobotContext.Provider>
  );
};
