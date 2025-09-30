import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed
import { RobotContext } from '../../context/RobotContext'; 
import IconsData from '../../components/IconsData'; // Adjust path to your icons file

// 1. Configuration for alert styles
// Add any other alert types you have to this object.
const recentAlertConfig = {
  "Battery Low": {
    bgColor: "bg-orange-200",
    textColor: "text-orange-400",
    icon: IconsData.battery,
  },
  "Temperature High": {
    bgColor: "bg-red-200",
    textColor: "text-red-400",
    icon: IconsData.warning,
  },
  "Connection Lost": {
    bgColor: "bg-gray-200",
    textColor: "text-gray-500",
    icon: IconsData.connection,
  },
  // Add a default style for any unknown alert types
  default: {
    bgColor: "bg-gray-200",
    textColor: "text-gray-500",
    icon: IconsData.info,
  },
};

export default function RecentAlertsCard() {
  // 2. Get the currently selected robot from the global context
  const { selectedRobot } = useContext(RobotContext);

  // 3. Process the alerts to get the 3 most recent ones
  const recentAlerts = useMemo(() => {
    if (!selectedRobot || !selectedRobot.alerts || selectedRobot.alerts.length === 0) {
      return [];
    }

    // Sort alerts by date in descending order (newest first)
    // This assumes `time_date` is a format that can be compared, like an ISO string
    const sortedAlerts = [...selectedRobot.alerts].sort((a, b) => 
      new Date(b.time_date) - new Date(a.time_date)
    );

    // Return only the top 3
    return sortedAlerts.slice(0, 3);
  }, [selectedRobot]);

  return (
    <div className="w-full h-[380px] bg-white rounded-[16px] p-3 flex flex-col gap-[26px]">
      <span className="flex justify-between px-2 ">
        <p className='text-[22px] font-semibold'>Recent Alerts</p>
  <Link
                to="/alerts"
                className="w-[90px] text-[14px] border-1 border-gray-400 rounded-[100px] flex items-center justify-center cursor-pointer"
              >
                See All ↗
              </Link>
      </span>

      <div className="w-full h-full flex flex-col gap-[18px] px-2">
        {/* 4. Conditionally render the alerts or a placeholder message */}
        {!selectedRobot ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Please select a robot to view alerts.</p>
          </div>
        ) : recentAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No recent alerts for {selectedRobot.name}.</p>
          </div>
        ) : (
          recentAlerts.map((alert, index) => {
            // Get the correct style from our config object
            const style = recentAlertConfig[alert.alert_type] || recentAlertConfig.default;
            
            return (
              <div
                key={index}
                className="w-full h-[86px] bg-gray-50 rounded-[10px] flex flex-row p-[18px] gap-[12px] items-center"
              >
                <span className={`h-[52px] w-[52px] rounded-[50%] ${style.bgColor} flex items-center justify-center aspect-square flex-shrink-0`}>
                  <p className={`text-2xl ${style.textColor}`}>{style.icon}</p>
                </span>
                <span className="flex flex-col w-full overflow-hidden">
                  <p className="text-[15px] font-semibold truncate">
                    {alert.alert_type}
                  </p>
                  <p className="text-[12px] text-gray-500 truncate">
                    {alert.details}
                  </p>
                </span>
                <span className="flex-shrink-0">
                  <Link to="/alerts">
                    <img
                      className="h-[26px] w-[26px] cursor-pointer"
                      src="/arrow-icon.png"
                      alt="View Alert"
                    />
                  </Link>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}