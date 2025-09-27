// RobotProvider.jsx
import { useEffect, useState } from "react";
import { RoboData2 } from "../utils/RoboData2";
import { RobotContext } from "./RobotContext";

// Safe JSON parse helper (no changes needed here)
const safeParse = (value, fallback) => {
  try {
    if (!value || value === "undefined") return fallback;
    // console.log('value :', JSON.parse(value))
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
  const formatRobotData = (newData) => {
  
  if (!newData || !newData.robot_status) return null;

 const robot_status = newData.robot_status;
   const map_data = newData.map_data || {}; // ✅ make it safe (optional)
    return {
      s_no: robot_status.sNo || "SRV-00",
      roboid: robot_status.roboId || "Robot-1",
      type: robot_status.robotType || "SRV",
      status: robot_status.status || "Unknown",
      name: robot_status.robotName || "Surveillance Robot-Live",
      image: robot_status.robotImg || "/SurvellianceRobo1.png",
      battery: robot_status.batteryStatus || "72",
      location: robot_status.robotLocation || "Anvi Tech Park",
      health: robot_status.robotHealth || "50%",
      temperature: robot_status.temp || "23°c",
      alerts: robot_status.alerts || [],
      avg_speed: robot_status.avgSpeed || "50",
      current_speed: robot_status.currentSpeed || "0",
      signal_strength: robot_status.signalStrength || "Good",
      event_logs: [],
      map_data: map_data || null, // ✅ prevent crash
  }};

  // Update robots with live data
  const updateRobotControlsData = (newData) => {
     const formatted = formatRobotData(newData);
    if (!formatted) return; 
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
              event: `${oldRobot.status} → ${formatted.status}`,
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
            event: formatted.status,
            status: formatted.status,
          },
        ];
        return [formatted, ...prev];
      }
    });

    setSelectedRobot(formatted);

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