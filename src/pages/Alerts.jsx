import React, { useContext, useState, useEffect } from 'react'; // Import useState and useEffect
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RobotContext } from "../context/RobotContext";
import IconsData from '../components/IconsData';

const alertConfig = {
  "Battery Low": {
    bgColor: "bg-[#FFFBEB]",
    textColor: "text-[#B45309]",
    icon: IconsData.battery2
  },
  "Temperature High": {
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    icon: IconsData.temperaturehigh,
  },
  "Temperature Low": {
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    icon: IconsData.temperaturelow,
  },
  "Motor Overload": {
    bgColor: "bg-gray-100",
    textColor: "text-[#1F2937]",
    icon: IconsData.info,
  },
  "Connection Lost": {
    bgColor: "bg-gray-100",
    textColor: "text-[#1F2937]",
    icon: IconsData.connection,
  },
  "Software Error": {
    bgColor: "bg-gray-100",
    textColor: "text-[#1F2937]",
    icon: IconsData.info,
  },
  "Obstacle Detected": {
    bgColor: "bg-gray-100",
    textColor: "text-[#1F2937]",
    icon: IconsData.info,
  },
  default: {
    bgColor: "bg-gray-100",
    textColor: "text-[#1F2937]",
    icon: "IconsData.info",
  },
};

const AlertTag = ({ type }) => {
  const style = alertConfig[type] || alertConfig.default;
  return (
    <div className='flex items-center gap-[8px] justify-center w-[33.33%]'>
      <div className={`flex p-[8px] rounded-[8px] w-[180px] items-center gap-1 ${style.bgColor} ${style.textColor}`}>
        <p className='text-[14px]'>{style.icon}</p>
        <h1>{type}</h1>
      </div>
    </div>
  );
};



export default function Alerts() {
  const { robots, selectedRobot, setSelectedRobot } = useContext(RobotContext);

  // CHANGE 1: Create a LOCAL state for this page's selection.
  // It defaults to the globally selected robot, or "All Robots" if none is selected.
  const [pageSelection, setPageSelection] = useState(selectedRobot ? selectedRobot.name : "All Robots");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // CHANGE 2: Update the handler to manage both local and global state.
  const handleRobotChange = (e) => {
    const selectedName = e.target.value;
    
    // Always update the local state to control this page's view
    setPageSelection(selectedName);

    // ONLY update the global context if a SPECIFIC robot is chosen.
    // If "All Robots" is selected, the global state is NOT changed.
    if (selectedName !== "All Robots") {
      const foundRobot = robots.find((robot) => robot.name === selectedName);
      if (foundRobot) {
        setSelectedRobot(foundRobot);
      }
    }
  };

  // CHANGE 3: The logic to display alerts is now based on the LOCAL pageSelection state.
  const alertsToDisplay = (() => {
    if (pageSelection === "All Robots") {
      // "All Robots" is selected locally: combine all alerts.
      return robots.flatMap(robot =>
        robot.alerts.map(alert => ({ ...alert, robotName: robot.name }))
      );
    } else {
      // A specific robot is selected locally: find it and get its alerts.
      const currentRobot = robots.find(r => r.name === pageSelection);
      if (!currentRobot) return []; // Return empty array if robot not found
      return currentRobot.alerts.map(alert => ({ ...alert, robotName: currentRobot.name }));
    }
  })();

  return (
    <>
      <Header />
      <main className="flex flex-col w-full gap-[10px]">
        <section className="flex h-[calc(100vh-80px)] w-full overflow-y-auto overflow-x-hidden custom-scroll pt-[18px]">
          <Sidebar />
          <div className="flex flex-col gap-y-4 w-[calc(100%-96px)] ml-[96px]">
            <div className=' mx-[12px] bg-white rounded-[14px] p-[22px] shadow-sm'>
              <div className='flex justify-between items-center pb-[15px] '>
                <select
                  className="border rounded-md p-2 text-sm cursor-pointer"
                  // CHANGE 4: The dropdown's value is now controlled by our local state.
                  value={pageSelection}
                  onChange={handleRobotChange}
                >
                  <option value="All Robots">All Robots</option> {/* Added value prop */}
                  {robots.map((robot, index) => (
                    <option key={index} value={robot.name}>
                      {robot.name}
                    </option>
                  ))}
                </select>
                {/* ... other header elements ... */}
                 <div>
                   <h1 className='text-[14px] font-semibold'>Robot Alerts</h1>
                 </div>
                <div className='flex gap-4'>
                  <div className="m-auto text-start flex items-center">
                    <label className="block ">From : </label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      className="border rounded-[6px] p-2 ml-2 w-[160px]"
                      placeholderText="Select date"
                      maxDate={new Date()}
                    />
                  </div>
                  <div className="m-auto text-start flex items-center">
                    <label className="block ">To :</label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      className="border rounded-[6px] ml-2 p-2 w-[160px]"
                      placeholderText="Select date"
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              </div>

              {/* The rest of the component renders from alertsToDisplay, which is now correct */}
              <div className='h-[36px] bg-[#F9FAFB] flex px-[34px]'>
                 <div className='w-[50%] flex items-center text-[16px] font-semibold text-[#6B7280]'>
                   <div className='w-[33.33%] flex justify-center'><h1>Time & Date</h1></div>
                   <div className='w-[33.33%] flex justify-center'><h1>Robot Name</h1></div>
                   <div className='w-[33.33%] flex justify-center'><h1>Alert Type</h1></div>
                 </div>
                 <div className='w-[50%] flex items-center text-[16px] font-semibold text-[#6B7280]'>
                   <span className='w-[70%] flex justify-center'> <h1>Details</h1></span>
                   <span className='w-[30%] flex justify-center'> <h1>Media</h1></span>
                 </div>
              </div>
              
              <div>
                {alertsToDisplay.length === 0 ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <p className="text-gray-500">No alerts to display.</p>
                  </div>
                ) : (
                  <ul>
                    {alertsToDisplay.map((alert, index) => (
                      <li key={index}>
                        <div className=' flex items-center justify-between p-[34px]'>
                          <div className='w-[50%] flex items-center text-[14px] font-medium text-[#374151]'>
                            <div className='flex items-center gap-[8px] justify-center w-[33.33%]'>
                              <p>{IconsData.clock}</p>
                              <h1 className='text-[12px] text-[#111111]'>{alert.time_date}</h1>
                            </div>
                            <div className='flex items-center gap-[8px] justify-center w-[33.33%]'>
                              <h1>{alert.robotName}</h1>
                            </div>
                            <AlertTag type={alert.alert_type} />
                          </div>
                          <div className='w-[50%] flex justify-start items-center text-[14px] font-medium text-[#374151]'>
                            <span className='w-[70%] pl-[10px]'>
                              <h1>{alert.details}</h1>
                            </span>
                            <span className='flex justify-center w-[30%]'>
                              <img className='h-[40px] w-[40px] rounded-[6px]' src={alert.media} alt={alert.alert_type} />
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}