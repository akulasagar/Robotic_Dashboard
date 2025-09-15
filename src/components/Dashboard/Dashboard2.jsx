import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard2() {
    return (

        <section className='flex  mt-[20px] gap-5 '>
            <div className='flex flex-col gap-[20px]  mb-10'>
            {/* Robot status card */}
                <div className='w-[300px] h-[270px] rounded-[32px] bg-white p-3'>
                    <p className='text-[22px] font-semibold'>Status </p>
                    <p className='text-[22px] mt-[20px] text-[#1E9AB0] '>Currently Idle</p>

                </div>
            {/* Robot Speed card */}
                <div className="w-[300px] h-[376px] rounded-[32px] bg-white p-3 flex flex-col items-center">
                    <p className="text-[22px] font-semibold">Speed Statistics</p>
                     
                    <div className="flex gap-4 mt-2 mb-4">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-[#0097A7]"></span>
                            <span className="text-sm text-gray-700">Average Speed</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-black"></span>
                            <span className="text-sm text-gray-700">Current Speed</span>
                        </div>
                    </div>
                    {/* Circular Chart */}
                    <div className="relative flex items-center justify-center w-[260px] h-[260px]">
                        {/* Outer Circle (Average Speed) */}
                        <svg className="absolute w-[260px] h-[260px] -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="100"
                                stroke="#E5E7EB"
                                strokeWidth="20"
                                fill="transparent"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="100"
                                stroke="#0097A7"
                                strokeWidth="20"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 100}
                                strokeDashoffset={2 * Math.PI * 100 * 0.50} 
                                strokeLinecap="butt" /* <-- flat ends */
                            />
                        </svg>

                        {/* Inner Circle (Current Speed) */}
                        <svg className="absolute w-[180px] h-[180px] -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="60"
                                stroke="#E5E7EB"
                                strokeWidth="12"
                                fill="transparent"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="60"
                                stroke="black"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 70}
                                strokeDashoffset={2 * Math.PI * 70 * 0.65} // 35% filled
                                strokeLinecap="butt" /* <-- flat ends */
                            />
                        </svg>

                        {/* Center Text */}
                        <div className="absolute text-center">
                            <p className="text-[18px] font-semibold">38</p>
                            <p className=" text-[18px] text-md">kmph</p>
                        </div>
                    </div>
                </div>
            </div>



{/* Recent ALerts Card */}
            <div className='flex flex-col gap-[10px]'>
                <div className='max-w-[510px] w-full h-[380px]  bg-white rounded-[16px] p-3 flex flex-col gap-[26px]' >
                    <span className='flex justify-between px-2 text-[22px] font-semibold'><p>Recent Alerts</p> <img src='' /></span>
                    <div className='w-[478px] h-[292px] flex flex-col gap-[18px]'>
                        <div className='w-[478px] h-[86px] bg-gray-50 rounded-[10px] flex flex-row  p-[18px] gap-[12px] items-center '>
                            <span className='h-[52px] w-[52px] rounded-[50%] bg-red-200 flex items-center justify-center '>
                                <img className='h-[14px] w-[12px]' src='/warning-icon.png' />
                            </span>
                            <span className='flex flex-col w-[340px] '>
                                <p className='text-[15px] font-semibold '> Motion detected</p>
                                <p className='text-[12px] text-gray-500'>Unauthorized moment in sector.... </p>
                            </span>
                            <span className=''>
                               <Link to="/alerts"> <img className='h-[26px] w-[26px] cursor-pointer' src='/arrow-icon.png' /></Link>

                            </span>
                        </div>
                        <div className='max-w-[478px] w-full h-[86px] bg-gray-50 rounded-[10px] flex flex-row  p-[18px] gap-[12px] items-center '>
                            <span className='h-[52px] w-[52px] rounded-[50%] bg-orange-200 flex items-center justify-center '>
                                <img className='h-[8px] w-[16px]' src='/Battery-icon.png' />
                            </span>
                            <span className='flex flex-col w-[340px] '>
                                <p className='text-[15px] font-semibold '> Motion detected</p>
                                <p className='text-[12px] text-gray-500'>Unauthorized moment in sector.... </p>
                            </span>
                            <span className=''>
                               <Link to="/alerts"> <img className='h-[26px] w-[26px] cursor-pointer' src='/arrow-icon.png' /></Link>

                            </span>
                        </div>
                        <div className='max-w-[478px] w-full h-[86px] bg-gray-50 rounded-[10px] flex flex-row  p-[18px] gap-[12px] items-center '>
                            <span className='h-[52px] w-[52px] rounded-[50%] bg-red-200 flex items-center justify-center '>
                                <img className='h-[14px] w-[12px]' src='/warning-icon.png' />
                            </span>
                            <span className='flex flex-col w-[340px] '>
                                <p className='text-[15px] font-semibold '> Motion detected</p>
                                <p className='text-[12px] text-gray-500'>Unauthorized moment in sector.... </p>
                            </span>
                            <span className=''>
                               <Link to="/alerts"> <img className='h-[26px] w-[26px] cursor-pointer' src='/arrow-icon.png' /></Link>

                            </span>
                        </div>
                    </div>

{/* Robo Info Card */}
                </div>
                <div className='max-w-[510px] w-full h-[275px] bg-gradient-to-r from-white from-40% to-[#5BB9C5]  rounded-[32px] border-b-5 border-[#5BB9C5] flex p-3' >
                    <div className='w-[60%] p-3 flex flex-col gap-4'>
                        <div className='pl-5'>
                            <p className='text-[22px] font-semibold'>Survelliance <br/>robot</p>
                            <p className='text-[12px]'> 12-27SR</p>
                        </div>
                        <div className='flex gap-10'>
                            <span>
                            <p className='pl-4 text-gray-400'>Status</p>
                           <span className='flex items-center'> <p className='h-2.5 w-2.5 bg-amber-200 rounded-[50%] mr-2'></p> <p>Idle</p>  </span>
                        </span>
                        <span className='justify-center items-center flex flex-col'> 
                            <p className=' text-gray-400'>Battery Level</p>
                            <span className='flex items-center'> <img className='h-[8px] w-[14px]' src='/Battery-icon.png'/> <p>72%</p>  </span>
                        </span>
                        </div>
                        <div>

                        </div>
                        

                    </div>
                    <div className='w-[40%]'>

                    </div>
                </div>

            </div>


{/* Map card */}
            <div className=' gap-[10px] '>
                <div className='h-[665px] w-[395px] bg-gray-200 rounded-[32px]'>

                </div>


            </div>
        </section>
    );
}
