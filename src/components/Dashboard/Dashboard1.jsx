import React, { useContext } from "react";
import { RobotContext } from "../../context/RobotContext";

export default function Dashboard1() {
  const { selectedRobot } = useContext(RobotContext);

  // Prevent crash when no robot is selected
  if (!selectedRobot) {
    return (
      <section className="flex justify-center items-center h-[160px]">
        <p className="text-gray-500 text-lg">No Robot Selected</p>
      </section>
    );
  }

  return (
    <section className="flex gap-x-3">
      {/* Performance Card */}
      <div className="p-2 h-[160px] max-w-[450px] w-full rounded-[32px] bg-gradient-to-r from-white from-20% to-[#5BB9C5] flex flex-col gap-y-3 px-6">
        <span className="flex justify-between">
          <p className="text-[16px] text-dark">Performance</p>
          <select className="bg-white w-max h-[18px] text-[12px] rounded-[5px] ">
            <option className="text-[12px]">weekly</option>
            <option className="text-[12px]">monthly</option>
          </select>
        </span>
        <span className="flex justify-start w-full">
          <div className="w-[45px] h-[56px]">
            <p className="text-[40px]">24</p>
            <p className="text-[12px]">Hours</p>
          </div>
          <img
            src="/perforamce bar.png"
            className="w-full min-w-[130px] max-w-[220px] h-[100px] ml-[46px] objeect-contain"
          />
        </span>
      </div>

      {/* Overall Health Card */}
      <div className="p-2 h-[160px] max-w-[450px] w-full rounded-[32px] bg-gradient-to-r from-white from-20% to-[#5BB9C5] flex flex-col gap-y-3 px-6">
        <p className="text-[16px] text-dark">Overall Health</p>
        <p className="text-[40px] font-semibold ">{selectedRobot.health}</p>
        <div className="flex justify-center items-baseline gap-2">
          <span className="flex items-center">
            <p className="h-3 w-3 bg-[#1EB036] rounded-[50%] mr-1 "></p>
            <p className="text-[10px]"> Excellent condition</p>
          </span>
          <span className="flex items-center ">
            <p className="h-3 w-3 bg-[#FF7F00] rounded-[50%] mr-1"></p>
            <p className="text-[10px]"> Good Condition</p>
          </span>
          <span className="flex items-center ">
            <p className="h-3 w-3 bg-[#FF0000] rounded-[50%] mr-1 "></p>
            <p className="text-[10px]"> Bad condition</p>
          </span>
        </div>
      </div>

      {/* Temperature Card */}
      <div className="p-2 h-[160px] max-w-[450px] w-full rounded-[32px] rounded-tr-[36px] bg-gradient-to-r from-white from-20% to-[#5BB9C5] pl-6 flex relative">
        <div className="flex-col gap-y-3">
          <p className="text-[16px] text-dark inline-block">Temperature</p>
          <div className="flex items-baseline gap-5">
            <p className="text-[40px] font-semibold mt-3 ">
              {selectedRobot.temperature}
            </p>
            <span className="flex items-center gap-2">
              <img className="h-5 w-2" src="/Temperature-icon.png" />
              <p className="text-[10px] inline-block ">Condition normal</p>
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="h-[50%]">
            <span className="h-[70px] w-[70px] rounded-[50%] bg-gradient-to-t from-[#FF9900] from-50% to-[#FFEE94] absolute top-[2px] right-[2px] z-[-10px]"></span>
            <img
              className="z-10 w-full max-w-[92px] h-[55px] absolute top-5 right-3.5"
              src="/clouds.png "
            />
          </span>
          <span className="flex flex-col items-baseline justify-end text-white text-[12px] ml-25">
            <p>Climate</p>
            <p className="text-black">23°c</p>
            <p>Cloudy Sunny</p>
          </span>
        </div>
      </div>
    </section>
  );
}
