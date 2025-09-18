import React from 'react';
import { useRobot } from "../context/RobotContext";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DatePicker from "react-datepicker";
import IconsData from '../components/IconsData';


export default function Events() {
  const { robots, selectedRobot, setSelectedRobot } = useRobot();

  const handleRobotChange = (e) => {
    const selectedName = e.target.value;
    const foundRobot = robots.find((robot) => robot.name === selectedName);
    setSelectedRobot(foundRobot);
  };


  return (
    <>
      <Header />
      <main className="flex flex-col w-full gap-[10px]  ">
        <section className="flex h-[calc(100vh-80px)] w-full overflow-y-auto overflow-x-hidden custom-scroll mt-[18px]">

          <Sidebar />

          <section className="w-[calc(100%-96px)] min-h-max ml-[96px] px-[10px] pb-[20px]  ">
            <div className='relative p-[10px] border-2 border-[#1E9AB0] h-full rounded-[12px]'>
              <div className='sticky top-0 flex justify-between items-center px-[20px] pb-[10px] '>
                <select
                  className="border rounded-md p-2 bg-[#F8F8F8] text-sm cursor-pointer   "
                  value={selectedRobot?.name || ""}
                  onChange={handleRobotChange}
                >
                  {robots.map((robot, index) => (
                    <option key={index} value={robot.name}>
                      {robot.name}
                    </option>
                  ))}
                </select>

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


              <div className='grid grid-cols-2 gap-5'>
                <div className='max-w-[610px] min-w-[380px] max-h-[420px] bg-white rounded-[14px] '>
                  <div className=''>
                    <div className='max-h-[220px] w-full '>
                      <div className='flex'>
                      <span className='p-2 max-w-[30px] rounded-[50%] aspect-1/1 bg-blue-600 text-white '>{IconsData.profile}</span>
                      <h1 className='p-2 text-[14px]'> Person Detection </h1>
                      </div>
                      <img src='/Face.png'/>
                      



                    </div>
                    <div className='max-h-[150px] w-full  p-[12px] flex flex-col gap-[12px] '>
                      <h1 className='text-[12px]'>Recent Events</h1>
                      
                    
                    <div className='grid grid-cols-6 overflow-y-auto  justify-evenly'>
                      <div className='flex flex-col justify-center m-auto'>
                    <img className='max-h[80px] max-w-[80px]' src='/Face2.png'/>
                    <p className='text-[6px] m-auto my-[4px]'> 2:32:45 pm, 15/10/23</p>
                    </div>
                    <div className='flex flex-col justify-center m-auto'>
                    <img className='max-h[80px] max-w-[80px]' src='/Face2.png'/>
                    <p className='text-[6px] m-auto my-[4px]'> 2:32:45 pm, 15/10/23</p>
                    </div>
                    <div className='flex flex-col justify-center m-auto'>
                    <img className='max-h[80px] max-w-[80px]' src='/Face2.png'/>
                    <p className='text-[6px] m-auto my-[4px]'> 2:32:45 pm, 15/10/23</p>
                    </div>
                    <div className='flex flex-col justify-center m-auto'>
                    <img className='max-h[80px] max-w-[80px]' src='/Face2.png'/>
                    <p className='text-[6px] m-auto my-[4px]'> 2:32:45 pm, 15/10/23</p>
                    </div>
                    <div className='flex flex-col justify-center m-auto'>
                    <img className='max-h[80px] max-w-[80px]' src='/Face2.png'/>
                    <p className='text-[6px] m-auto my-[4px]'> 2:32:45 pm, 15/10/23</p>
                    </div>
                    <div className='flex flex-col justify-center m-auto'>
                    <img className='max-h[80px] max-w-[80px]' src='/Face2.png'/>
                    <p className='text-[6px] m-auto my-[4px]'> 2:32:45 pm, 15/10/23</p>
                    </div>
                    <div className='flex flex-col justify-center m-auto'>
                    <img className='max-h[80px] max-w-[80px]' src='/Face2.png'/>
                    <p className='text-[6px] m-auto my-[4px]'> 2:32:45 pm, 15/10/23</p>
                    </div>
                   </div>


                    </div>
                  </div>

                </div>


              </div>

            </div>
          </section>
        </section>
      </main>
    </>
  );
}
