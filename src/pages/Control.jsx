import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import { RobotContext } from "../context/RobotContext";
import RobotMapDashboard from "../components/Dashboard/RobotMapDashboard2";
import RemoteControl from "../components/Dashboard/RobotControls";
import { RobotMapDash } from "../components/Dashboard/RobotMapDash";

const Control = () => {
  const { selectedRobot } = useContext(RobotContext);

  return !selectedRobot ? (
    <>
      <Header />
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Sidebar />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">
            No Robot Selected
          </h1>
          <p className="text-gray-500">
            Please go back to the dashboard and select a robot to view its
            controls.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  ) : (
    <>
      <Header />

      <main className="flex w-full gap-[10px]">
        <section className="custom-scroll flex h-[calc(100vh-80px)] w-full overflow-y-auto overflow-x-hidden">
          <div className="mt-[18px]">
            <Sidebar />
          </div>

          <section className="ml-[96px] min-h-max w-[calc(100%-96px)] px-2 pb-[20px]">
            <div className="w-full flex md:flex-row flex-col gap-4">
              {/* Left Column */}
              <div className="w-[30vw] overflow-hidden flex flex-1 flex-col bg-white mt-[18px] rounded-[14px] p-[12px]">
                <div className="flex justify-center">
                  <div className="relative max-h-[440px] w-full rounded-[14px] bg-black p-3">
                    <div className="absolute flex items-center">
                      <p className="mr-2 h-2.5 w-2.5 rounded-[50%] bg-red-500"></p>
                      <p className="text-[14px] text-white">REC</p>
                    </div>
                    <video
                      src="/Robot_Camera_Video_Generation.mp4"
                      autoPlay
                      loop
                      muted
                      className="h-full w-full rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
                <RemoteControl />
              </div>

              {/* Map */}
              <div className="w-[50vw] sticky z-99 mt-[18px] overflow-hidden">
                {/* <RobotMapDashboard /> */}
                <RobotMapDash />
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

export default Control;
