import React from "react";
import { RoboEventsData } from "../../utils/RoboEventsData";
import { Link } from "react-router-dom";
import RobotControls from "./RobotControls";
import { useRobot } from "../../context/RobotContext";

export default function Dashboard3() {
  const { selectedRobot } = useRobot();

  if (!selectedRobot) {
    return (
      <section className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500 text-lg">No Robot Selected</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-[26px] max-w-[1365px]">
      {/* Recent Event Logs */}
      <div className="w-full bg-white h-[350px] rounded-[14px] p-[24px]">
        <div className="flex justify-between h-[40px] pb-2">
          <h1 className="text-[22px] font-semibold">Recent Event Logs</h1>
          <Link
            to=""
            className="w-[90px] text-[14px] border-1 border-gray-400 rounded-[100px] flex items-center justify-center cursor-pointer"
          >
            See All ↗
          </Link>
        </div>

        <div className="h-[54px] w-full grid grid-cols-4 items-center bg-[#1E91B0] text-white text-start px-[20px]">
          <p>Robot ↑↓</p>
          <p>Time and Date ↑↓</p>
          <p>Event ↑↓</p>
          <p>Status ↑↓</p>
        </div>

        {RoboEventsData && RoboEventsData.length > 0 ? (
          RoboEventsData.map((each, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center justify-center px-[20px] text-start h-[54px]"
            >
              <div className="flex gap-2">
                <img
                  className="max-h-[26px] max-w-[26px]"
                  src={selectedRobot.image}
                  alt="robot"
                />
                <p>{each.roboid}</p>
              </div>
              <p>{each.time_date}</p>
              <p>{each.event}</p>
              <Link
                to=""
                className="w-[100px] h-[30px] text-[14px] border-1 border-gray-400 rounded-[100px] flex items-center justify-center"
              >
                <span className="h-2.5 w-2.5 bg-green-700 rounded-[50%] mr-2"></span>
                <p>{each.status}</p>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center mt-[20px]">
            <p className="text-[20px] text-gray-500">No Event Logs</p>
          </div>
        )}
      </div>

      {/* Video Feed / Manual Control */}
      <div className="h-[430px] w-full rounded-[14px] bg-white p-[24px]">
        <h1 className="text-[22px] font-semibold">Video Feed / Manual Control</h1>
        <div className="flex gap-5 py-2">
          <div className="h-[320px] w-full max-w-[615px] rounded-[14px] bg-black p-3 relative">
            <div className="flex items-center absolute">
              <p className="h-2.5 w-2.5 bg-red-500 rounded-[50%] mr-2"></p>
              <p className="text-white text-[14px]">REC</p>
            </div>
            <video
              src="/Robot_Camera_Video_Generation.mp4"
              autoPlay
              loop
              muted
              className="rounded-2xl shadow-lg w-full h-full"
            />
          </div>

          <div>
            <RobotControls />
          </div>
        </div>
      </div>
    </section>
  );
}
