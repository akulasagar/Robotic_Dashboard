// import { useEffect, useState } from "react";
// import { RoboData2 } from "../utils/RoboData2";
// import { RobotContext } from "./RobotContext";

// // Provider Component
// export const RobotProvider = ({ children }) => {
//   const [robots, setRobots] = useState(RoboData2 || []);

//   // Safe JSON parse helper
//   const safeParse = (value, fallback) => {
//     try {
//       if (!value || value === "undefined") return fallback;
//       return JSON.parse(value);
//     } catch (err) {
//       console.warn("⚠️ Failed to parse storage value:", err);
//       return fallback;
//     }
//   };

//   // Load control data from sessionStorage if available
//   const [robotControlsData, setRobotControlsData] = useState(() =>
//     safeParse(sessionStorage.getItem("robotControlsData"), {})
//   );

//   // Load selected robot from localStorage
//   const [selectedRobot, setSelectedRobot] = useState(() =>
//     safeParse(localStorage.getItem("selectedRobot"), null)
//   );

//   // Persist selectedRobot to localStorage
//   useEffect(() => {
//     if (selectedRobot) {
//       localStorage.setItem("selectedRobot", JSON.stringify(selectedRobot));
//     }
//   }, [selectedRobot]);

//   // Persist robotControlsData to sessionStorage
//   const updateRobotControlsData = newData => {
//     const robotControlsDataFormat = {
//         s_no: newData.sNo || 'SRV-01',
//         robotid: newData.roboId || 'Robot 1',
//         type: newData.robotType || 'SRV',
//         status: newData.status || 'Idle',
//         name: newData.robotName || "SurvellianceRobot-01",
//         image: newData.robotImg || "/SurvellianceRobo1.png",
//         battery: newData.batteryStatus ||"72",
//         location: newData.robotLocation || "My Home Appartments",
//         health: newData.robotHealth || "50%",
//         temperature: newData.temp || "23°c",
//         alerts:newData.alerts || [
//             "Motion detected Unauthorized moment in sector....",
//             "Motion detected Unauthorized moment in sector....",
//             "Motion detected Unauthorized moment in sector...."
//         ],
//         avg_speed: newData.avgSpeed || "50",
//         current_speed: newData.currentSpeed || "0",
//         signal_strength: newData.signalStrength || "Good",
//         event_logs: newData.eventLogs || ["",""],
//     }
//     console.log([robotControlsDataFormat, ...robots.splice(1)])
//     // setRobots([robotControlsDataFormat, ...robots.splice(1)])
//   };

//   useEffect(() => {
//     sessionStorage.setItem("robotControlsData", JSON.stringify(robotControlsData));
//     console.log("robotControlsData : ", robotControlsData);
//   }, [robotControlsData]);

//   return (
//     <RobotContext.Provider
//       value={{
//         robots,
//         selectedRobot,
//         setSelectedRobot,
//         robotControlsData,
//         setRobotControlsData: updateRobotControlsData,
//       }}
//     >
//       {children}
//     </RobotContext.Provider>
//   );
// };



import { useEffect, useState } from "react";
import { RoboData2 } from "../utils/RoboData2";
import { RobotContext } from "./RobotContext";

// Provider Component
export const RobotProvider = ({ children }) => {
  const [robots, setRobots] = useState(RoboData2 || []);

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

  // Load control data from sessionStorage if available
  const [robotControlsData, setRobotControlsData] = useState(() =>
    safeParse(sessionStorage.getItem("robotControlsData"), {})
  );

  // Load selected robot from localStorage
  const [selectedRobot, setSelectedRobot] = useState(() =>
    safeParse(localStorage.getItem("selectedRobot"), null)
  );

  // Persist selectedRobot to localStorage
  useEffect(() => {
    if (selectedRobot) {
      localStorage.setItem("selectedRobot", JSON.stringify(selectedRobot));
    }
  }, [selectedRobot]);

  // ✅ Update Robot Controls & replace 0th index robot
  const updateRobotControlsData = (newData) => {
    const formattedRobot = {
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
      alerts: newData.alerts || [
        "Motion detected Unauthorized moment in sector....",
        "Motion detected Unauthorized moment in sector....",
        "Motion detected Unauthorized moment in sector....",
      ],
      avg_speed: newData.avgSpeed || "50",
      current_speed: newData.currentSpeed || "0",
      signal_strength: newData.signalStrength || "Good",
      event_logs: newData.eventLogs || ["", ""],
    };

    // ✅ Set robotControlsData (for session persistence)
    setRobotControlsData(formattedRobot);

    // ✅ Insert new live robot data at 0 index, keep rest
    setRobots((prev) => [formattedRobot, ...prev.slice(1)]);

    console.log("🚀 Updated Robots:", [formattedRobot, ...robots.slice(1)]);
  };

  // Persist robotControlsData to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("robotControlsData", JSON.stringify(robotControlsData));
    console.log("robotControlsData : ", robotControlsData);
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
