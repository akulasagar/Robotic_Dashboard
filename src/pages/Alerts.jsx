import React, { useContext } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DatePicker from "react-datepicker";
import { RobotContext } from "../context/RobotContext";
import IconsData from '../components/IconsData';
export default function Alerts() {
  const { robots, selectedRobot, setSelectedRobot } = useContext(RobotContext);

  const handleRobotChange = (e) => {
    const selectedName = e.target.value;
    const foundRobot = robots.find((robot) => robot.name === selectedName);
    setSelectedRobot(foundRobot);
  };
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
                  className="border rounded-md p-2  text-sm cursor-pointer   "
                  value={selectedRobot?.name || ""}
                  onChange={handleRobotChange}
                >
                  <option>All Robots</option>
                  {robots.map((robot, index) => (

                    <option key={index} value={robot.name}>
                      {robot.name}
                    </option>
                  ))}
                </select>
                <div>
                  <h1 className='text-[14px] font-semibold'>Robot Alerts</h1>
                </div>

                <div className='flex gap-4'>
                  {/* From Date */}
                  <div className="m-auto text-start flex items-center">
                    <label className="block ">From : </label>
                    <DatePicker
                      onChange={(date) => setFromDate(date)}
                      className="border rounded-[6px] p-2 ml-2 w-[160px]"
                      placeholderText="Select date"
                      maxDate={new Date()}
                    />
                    <p className="text-red-500 text-sm mt-1 h-[20px]"></p>
                  </div>

                  {/* To Date */}
                  <div className="m-auto text-start flex items-center">
                    <label className="block ">To :</label>
                    <DatePicker
                      onChange={(date) => setToDate(date)}
                      className="border  rounded-[6px] ml-2 p-2 w-[160px]"
                      placeholderText="Select date"
                      maxDate={new Date()}
                    />
                    <p className="text-red-500 text-sm mt-1 h-[20px]"></p>
                  </div>
                </div>

              </div>

              <div className='h-[36px] bg-[#F9FAFB] flex px-[34px]  '>
                <div className='w-[50%] flex  items-center text-[16px] font-semibold text-[#6B7280]'>
                  <div className='w-[33.33%] flex justify-center'><h1>Time & Date</h1></div>
                  <div className='w-[33.33%]  flex justify-center'><h1>Robot Name</h1></div>
                  <div className='w-[33.33%]  flex justify-center'><h1>Alert Type</h1></div>
                </div>
                <div className='w-[50%] flex items-center text-[16px] font-semibold text-[#6B7280]'>
                  <span className='w-[70%] flex justify-center'> <h1>Details</h1></span>
                  <span className='w-[30%] flex justify-center'> <h1>Media</h1></span>
                </div>
              </div>
              <div> 
{console.log("fghjklkjh",selectedRobot)}
                {selectedRobot && (
  selectedRobot.alerts.length === 0 ? (
    <div className="flex justify-center items-center h-[200px]">
      <p className="text-gray-500">No alerts for this robot.</p>
    </div>
  ) : (
                <ul>
                  <li>
                    <div className='h-[86px] flex items-center justify-between p-[34px] '>
                      <div className='w-[50%] flex  items-center text-[14px] font-medium text-[#374151]'>
                        <div className='flex items-center gap-[8px] justify-center  w-[33.33%]'><p>{IconsData.clock}</p> <h1 className='text-[12px] text-[#111111]'>12-08-2023, 10:30 AM</h1></div>
                        <div className='flex items-center gap-[8px]  justify-center w-[33.33%]'><h1>Surveillance Robot-Live</h1></div>
                        <div className='flex items-center gap-[8px]  justify-center w-[33.33%]'><div className=' flex p-[8px] bg-[#FFFAC5] text-[#854D0E] rounded-[8px]'><p className=' '>{IconsData.battery}</p><h1>Obstacle Detected</h1></div></div>
                      </div>
                      <div className='w-[50%] flex justify-start items-center text-[14px] font-medium text-[#374151]'>
                        <span className='w-[70%]'> <h1>Obstacle detected in path. Robot stopped to avoid collision.</h1></span>
                        <span className='flex justify-center w-[30%]'><img className='h-[40px] w-[40px] rounded-[6px]' src='/AlertImage1.png' /></span>
                      </div>
                    </div>
                  </li>
                </ul>
  )
                )}
              </div>
              

            </div>






          </div>
        </section>
      </main>
    </>

  );
}
