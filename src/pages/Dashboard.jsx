import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard1 from "../components/Dashboard/Dashboard1";
import Dashboard2 from "../components/Dashboard/Dashboard2";
import { RobotContext } from "../context/RobotContext";
import { useContext } from "react";

export default function Dashboard() {
  const { robots, selectedRobot, setSelectedRobot } = useContext(RobotContext);
  const handleRobotChange = (e) => {
    const selectedName = e.target.value;
    const foundRobot = robots.find((robot) => robot.name === selectedName);
    setSelectedRobot(foundRobot);
  };

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
            {/* Dropdown */}
            <section className="flex h-[60px]  mt-2 sticky z-200 top-0 pt-[5px]">
              <select
                className="border rounded-md px-2 bg-[#F8F8F8] text-sm cursor-pointer h-[48px] w-[235px] shadow-md ml-auto"
                value={selectedRobot?.name || ""}
                onChange={handleRobotChange}
              >
                {console.log("robots List Data", robots)}
                {robots.map((robot, index) => (
                  <option key={index} value={robot.name}>
                    {robot.name}
                  </option>
                ))}
              </select>
            </section>

            <Dashboard1 />
            <Dashboard2 />
          </section>
        </section>
      </main>
    </>
  );
}
