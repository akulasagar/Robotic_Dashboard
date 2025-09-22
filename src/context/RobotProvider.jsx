// RobotProvider.jsx
import { useEffect, useState } from "react";
import { RoboData2 } from "../utils/RoboData2";
import { RobotContext } from "./RobotContext";

// Safe JSON parse helper (no changes needed here)
const safeParse = (value, fallback) => {
  try {
    if (!value || value === "undefined") return fallback;
    return JSON.parse(value);
  } catch (err) {
    console.warn("⚠️ Failed to parse storage value:", err);
    return fallback;
  }
};

// Define a constant for the max number of logs to keep
const MAX_LOG_ENTRIES = 100;

export const RobotProvider = ({ children }) => {
  // ✨ CHANGE 1: Initialize 'robots' state directly from sessionStorage.
  // This loads the saved state on page load. Use a new key 'allRobots'.
  const [robots, setRobots] = useState(() =>
    safeParse(sessionStorage.getItem("allRobots"), RoboData2 || [])
  );

  // ❌ REMOVED: The separate 'robotControlsData' state is no longer needed.
  // const [robotControlsData, setRobotControlsData] = useState(...);

  const [selectedRobot, setSelectedRobot] = useState(() =>
    safeParse(localStorage.getItem("selectedRobot"), null)
  );

  // Persist selectedRobot (no changes needed here)
  useEffect(() => {
    if (selectedRobot) {
      localStorage.setItem("selectedRobot", JSON.stringify(selectedRobot));
    }
  }, [selectedRobot]);

  // Format robot live data into standard object (no changes needed here)
  const formatRobotData = (newData) => ({
    s_no: newData.sNo || "SRV-00",
    roboid: newData.roboId || "Robot-1",
    type: newData.robotType || "SRV",
    status: newData.status || "-",
    name: newData.robotName || "Surveillance Robot-Live",
    image: newData.robotImg || "/SurvellianceRobo1.png",
    battery: newData.batteryStatus || "72",
    location: newData.robotLocation || "Anvi Tech Park",
    health: newData.robotHealth || "50%",
    temperature: newData.temp || "23°c",
    alerts: newData.alerts || [],
    avg_speed: newData.avgSpeed || "50",
    current_speed: newData.currentSpeed || "0",
    signal_strength: newData.signalStrength || "Good",
    event_logs: [],
  });

  // Update robots with live data
  const updateRobotControlsData = (newData) => {
    const formatted = formatRobotData(newData);

    setRobots((prev) => {
      const idx = prev.findIndex((r) => r.roboid === formatted.roboid);

      if (idx !== -1) {
        const updated = [...prev];
        const oldRobot = updated[idx];

        // Generate log if status changed
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

        // Add alerts if any
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
        
        // ✨ CHANGE 2: Trim the event logs to prevent them from growing forever.
        if (formatted.event_logs.length > MAX_LOG_ENTRIES) {
          formatted.event_logs = formatted.event_logs.slice(0, MAX_LOG_ENTRIES);
        }

        updated[idx] = formatted;
        return updated;
      } else {
        // new robot
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

    // ❌ REMOVED: No longer need to set the separate robotControlsData state.
    // setRobotControlsData(formatted);
  };

  // ✨ CHANGE 3: Persist the entire 'robots' array whenever it changes.
  // This is the correct way to save your state.
  useEffect(() => {
    try {
      sessionStorage.setItem("allRobots", JSON.stringify(robots));
    } catch (error) {
      console.error("Failed to save robot data to sessionStorage:", error);
    }
  }, [robots]);

  return (
    <RobotContext.Provider
      value={{
        robots,
        selectedRobot,
        setSelectedRobot,
        // robotControlsData is no longer needed in the value
        setRobotControlsData: updateRobotControlsData,
      }}
    >
      {children}
    </RobotContext.Provider>
  );
};