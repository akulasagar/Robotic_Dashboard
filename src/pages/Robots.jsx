import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { RoboData1 } from "../utils/RoboTopCards";
import { RobotContext } from "../context/RobotContext";

export default function Robots() {
  const { robots, setSelectedRobot } = useContext(RobotContext);
  const [activeRobotType, setActiveRobotType] = useState(
    RoboData1[0]?.type || ""
  );
  const navigate = useNavigate();

  // Filter robots by type
  const filteredRobots = robots.filter(
    (robot) => robot.type === activeRobotType
  );
 const getRobotCountByType = (type) => {
    return robots.filter((robot) => robot.type === type).length;
  };
  const handleSelectRobot = (robot) => {
    setSelectedRobot(robot); // update global context
    navigate("/dashboard"); // go to dashboard
  };

   const typeCounts = RoboData1.reduce((acc, eachType) => {
    acc[eachType.type] = robots.filter((robot) => robot.type === eachType.type).length;
    return acc;
  }, {});

  return (
    <div>
      <Header />
      <main className="flex flex-col w-full gap-[10px]">
        <section className="flex h-[calc(100vh-80px)] w-full overflow-y-auto overflow-x-hidden custom-scroll pt-[18px]">
          <Sidebar />

          <div className="flex flex-col gap-y-4 w-[calc(100%-96px)] ml-[96px]">
            {/* Robot Types */}
            <div className="mx-2 grid grid-cols-4 w-full gap-2">
              {RoboData1.map((each) => {
                 const count = typeCounts[each.type] || 0;
                return(
                <div
                  key={each.type}
                  onClick={() => setActiveRobotType(each.type)}
                  className={`h-[200px] max-w-[318px] w-full rounded-[14px] shadow-sm p-[20px] cursor-pointer relative ${
                    activeRobotType === each.type
                      ? "bg-[#1E9AB0] text-white"
                      : "bg-white"
                  }`}
                >
                  <img
                    className="h-[75px] w-full max-w-[75px]"
                    src={each.image}
                    alt={each.label}
                  />
                  <h1 className="text-[16px] mt-6">{each.label}</h1>
                  <div className="flex flex-row justify-between items-center mt-2">
                    {activeRobotType === each.type && (
                      <span className="flex w-[50px] h-[26px] bg-[#CBDF70] items-center justify-center rounded-[119px] text-black">
                        ADD
                      </span>
                    )}
                    <p
                      className={`w-[30px] h-[30px] rounded-[50%] flex items-center justify-center ml-auto ${
                        activeRobotType === each.type
                          ? "bg-[#CBDF70] text-white"
                          : "bg-[#E8F0E7] text-[#1B650E]"
                      }`}
                    >
                      {count}
                    </p>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Robots List */}
            {filteredRobots.length > 0 ? (
              <div className="mx-2 grid grid-cols-4 w-full gap-2 ">
                {filteredRobots.map((each) => (
                  <div
                    key={each.roboid || each.name}
                    onClick={() => handleSelectRobot(each)}
                    className="h-[470px] w-full max-w-[318px] p-[20px] text-[13px] text-black bg-white rounded-[15px] shadow-md mb-5 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <img src={each.image} alt={each.name} />
                    <div className="flex flex-col gap-y-2 mt-10">
                      <span>
                        <p>{each.name}</p>
                      </span>
                      <span className="flex flex-row items-center">
                        <p>{each.status}</p>
                        <p className="h-2.5 w-2.5 bg-amber-200 rounded-[50%] ml-3"></p>
                      </span>

                      {/* Battery */}
                      <div className="flex flex-row items-center gap-x-3 w-full mt-2">
                        <p className="whitespace-nowrap">Battery -</p>
                        <div className="relative w-full h-[5px] rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              each.battery >= 75
                                ? "bg-green-500"
                                : each.battery >= 35
                                ? "bg-yellow-400"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${each.battery}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">
                          {each.battery}%
                        </span>
                      </div>

                      <span className="flex flex-row">
                        <p>Location -</p>
                        <p>{each.location}</p>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] w-full">
                <p className="text-center text-gray-500 text-lg">
                  No Robots Found
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
