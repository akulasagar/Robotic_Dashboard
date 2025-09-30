import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { RobotContext } from "../context/RobotContext";
import { useContext } from 'react';

export default function MapManagement() {
  const { selectedRobot } = useContext(RobotContext);

  return (
    <>
      <Header />
      <main className="flex flex-col w-full gap-[10px]  ">
        {/* Dashboard Layout */}
        <section className="flex h-[calc(100vh-80px)] w-full overflow-y-auto overflow-x-hidden custom-scroll">
          <div className="mt-[18px]">
            <Sidebar selectedRobot={selectedRobot} />
          </div>

          <section className="w-[calc(100%-96px)] min-h-max ml-[96px] px-2 pb-[20px]">
            <div className='h-[665px] bg-white rounded-[14px] p-[22px] shadow-sm mt-[18px]'>
              <div className='flex justify-between items-center pb-[15px] '>
                <h1 className='text-[18px] font-bold'>Map Management</h1>
                <button className='text-[12px] text-white bg-[#1E9AB0] p-[8px] px-[18px] rounded-[6px] font-bold'>+ Add New Map</button>
              </div>
              <div className='flex gap-[14px] w-full h-full'>
                <div className='w-[70%] max-h-[530px] rounded-[14px] '>
                  <img className='w-full h-full object-cover rounded-[14px]' src="/map1.png" alt='Map Placeholder' />
                </div>
                <div className='w-[30%] h-full flex flex-col gap-[12px]'>
                  <h1 className='text-[14px] font-semibold px-[10px] '>Available maps</h1>
                  <div className='h-[220px] w-full bg-white rounded-[10px] m-[10px]  flex flex-col gap-[10px] border-1 border-gray-300 '>
                    <img className='h-[120px] w-full object-cover rounded-[10px]' src="/map1.png" alt='Map Placeholder' />
                    <div className='h-[100px] w-full flex flex-col justify-between items-start px-[10px] '>
                      <h1>Map 1</h1>
                      <div className='w-full flex '>
                        <button className='text-[12px]  p-[6px] px-[12px]  border-r-1 border-gray-400  w-[50%]'>Edit </button>
                        <button className='text-[12px]  p-[6px] px-[12px]  border-l-1 border-gray-400 w-[50%]'>Delete</button>
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
