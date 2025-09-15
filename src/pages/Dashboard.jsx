import { useState } from "react";
import { RoboData2 } from "../utils/RoboData2";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard1 from "../components/Dashboard/Dashboard1";
import Dashboard2 from "../components/Dashboard/Dashboard2";

export default function Dashboard() {
  const [selectedRobot, setSelectedRobot] = useState("");
  return (
    <>
      <Header />
      <main className="flex flex-col w-full gap-[10px] py-[18px]">

        <section className="flex h-[60px]">
          {/* Dropdown */}
          <div>
            <select
              className="border rounded-md px-2 text-sm  cursor-pointer h-[48px] w-[235px] ml-[10px]"
              value={selectedRobot}
              onChange={(e) => setSelectedRobot(e.target.value)}
            >
              <option value="">Select Robot</option>
              {RoboData2.map((robot, index) => (
                <option key={index} value={robot.name}>
                  {robot.name}
                </option>
              ))}
            </select>
          </div>
        </section>



        <section className="flex h-[calc(100vh-80px)]  w-full overflow-y-auto overflow-x-hidden custom-scroll">
         
            {/* Sidebar */}
              <Sidebar selectedRobot={selectedRobot} />
         

              <section className=" w-[calc(100%-96px)] ml-[96px] px-2 ">
                <Dashboard1/>
            <Dashboard2/>
          </section>

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
    </>
  );
}
