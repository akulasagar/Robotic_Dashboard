import { createContext, useState, useContext, useEffect } from "react";
import { RoboData2 } from "../utils/RoboData2";

const RobotContext = createContext();

export const RobotProvider = ({ children }) => {
  const [robots, setRobots] = useState(RoboData2);

  // Load from localStorage on first render
  const [selectedRobot, setSelectedRobot] = useState(() => {
    const storedRobot = localStorage.getItem("selectedRobot");
    return storedRobot ? JSON.parse(storedRobot) : null;
  });

  // Whenever selectedRobot changes, persist to localStorage
  useEffect(() => {
    if (selectedRobot) {
      localStorage.setItem("selectedRobot", JSON.stringify(selectedRobot));
    }
  }, [selectedRobot]);

  return (
    <RobotContext.Provider value={{ robots, selectedRobot, setSelectedRobot }}>
      {children}
    </RobotContext.Provider>
  );
};

// Custom hook
export const useRobot = () => useContext(RobotContext);
