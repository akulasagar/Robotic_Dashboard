import React from "react";

// Create Context with default values
export const RobotContext = React.createContext({
  robots: [],
  selectedRobot: null,
  setSelectedRobot: () => {},
  robotControlsData: {},
  setRobotControlsData: () => {},
});
