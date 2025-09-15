import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { RoboData1 } from '../utils/RoboTopCards';
import { RoboData2 } from '../utils/RoboData2';
import { Link } from 'react-router-dom';

export default function Robots() {
    const [activeRobotType, setActiveRobotType] = useState(RoboData1[0].id); // default: first card active

    // Filter RoboData2 based on activeRobotType
    const filteredRobots = RoboData2.filter(robot => robot.id === activeRobotType);

    return (
        <div>
            <Header />
            <main className="flex flex-col w-full gap-[10px] py-[18px]">

                <section className="flex  h-[calc(100vh-80px)]  w-full overflow-y-auto overflow-x-hidden custom-scroll">

                    {/* Sidebar */}
                    <Sidebar />


                    <div className="flex flex-col gap-y-4 w-[calc(100%-96px)] ml-[96px] ">
                        {/* <main className="flex flex-row h-[calc(100vh-140px)]   w-full overflow-y-auto overflow-x-hidden"> */}


                        {/* Section 1: Robot Types */}
                        <div className=" mx-2 flex flex-row justify-evenly gap-2">
                            {RoboData1.map(each => (
                                <div
                                    key={each.id}
                                    onClick={() => setActiveRobotType(each.id)}
                                    className={`h-[200px] max-w-[318px] w-full rounded-[14px] shadow-sm p-[20px] cursor-pointer relative 
                  ${activeRobotType === each.id ? ' bg-[#1E9AB0] text-white' : 'bg-white'}`}
                                >
                                    <img
                                        className="h-[75px] w-full max-w-[75px]"
                                        src={each.image}
                                        alt="img"
                                    />
                                    <h1 className="text-[16px] mt-6">{each.label}</h1>
                                    <div className='flex flex-row justify-between items-center mt-2'>
                                        {activeRobotType === each.id && (
                                            <Link
                                                to={each.link}
                                                className="flex w-[50px] h-[26px] bg-[#CBDF70] items-center justify-center rounded-[119px] text-black "
                                            >
                                                ADD
                                            </Link>
                                        )}

                                        <p className={` w-[30px] h-[30px]  rounded-[50%] flex items-center justify-center  ml-auto ${activeRobotType === each.id ? ' bg-[#CBDF70] text-white' : 'bg-[#E8F0E7] text-[#1B650E]'}`}>{each.count}</p>

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 2: Robots List (Filtered) */}
                        <div className=" mx-2 grid grid-cols-4  justify-evenly gap-2">
                            {filteredRobots.length > 0 ? (
                                filteredRobots.map((each, index) => (
                                    <Link
                                        to="/dashboard"
                                        key={index}
                                        className="h-[470px] w-full max-w-[318px] p-[20px] text-[13px] text-black bg-white rounded-[15px] shadow-md mb-5 cursor-pointer"
                                    >
                                        <img src={each.image} alt="Robo image" />
                                        <div className="flex flex-col gap-y-2 mt-10">
                                            <span>
                                                <p>{each.name}</p>
                                            </span>
                                            <span className='flex flex-row items-center'>
                                                <p>{each.status}</p>
                                                <p className='h-2.5 w-2.5 bg-amber-200 rounded-[50%] ml-3'></p>
                                            </span>
                                            <div className="flex flex-row items-center gap-x-3 w-full mt-2">
                                                {/* Label */}
                                                <p className="whitespace-nowrap">Battery -</p>

                                                {/* Battery Bar */}
                                                <div className="relative w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-300 ${each.battery >= 75
                                                            ? "bg-green-500"
                                                            : each.battery >= 35
                                                                ? "bg-yellow-400"
                                                                : "bg-red-500"
                                                            }`}
                                                        style={{ width: `${each.battery}%` }}
                                                    />
                                                </div>

                                                {/* Battery Percentage */}
                                                <span className="text-sm font-medium whitespace-nowrap">
                                                    {each.battery}%
                                                </span>
                                            </div>

                                            <span className='flex flex-row'>
                                                <p>Location -</p>
                                                <p>{each.location}</p>

                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center  text-gray-500 w-full">No Robots Found</p>
                            )}
                        </div>
                    </div>
                    <style>{`
    .custom-scroll::-webkit-scrollbar {
      display: none;
    }
    .custom-scroll {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }
  `}</style>
                </section>
            </main>
        </div>

    );
}
