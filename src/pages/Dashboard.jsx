import { useRobot } from "../context/RobotContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard1 from "../components/Dashboard/Dashboard1";
import Dashboard2 from "../components/Dashboard/Dashboard2";
import Dashboard3 from "../components/Dashboard/Dashboard3";

export default function Dashboard() {
  const { robots, selectedRobot, setSelectedRobot } = useRobot();

  const handleRobotChange = (e) => {
    const selectedName = e.target.value;
    const foundRobot = robots.find((robot) => robot.name === selectedName);
    setSelectedRobot(foundRobot);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col w-full gap-[10px] ">
       
        {/* Dashboard Layout */}
        <section className="flex h-[calc(100vh-80px)] w-full overflow-y-auto overflow-x-hidden custom-scroll">
          <Sidebar selectedRobot={selectedRobot} />


          <section className="w-[calc(100%-96px)] min-h-max ml-[96px] px-2 pb-[20vh]">
            {/* Dropdown */}
            <section className="flex h-[60px]  mt-2 sticky z-200 top-0 pt-1">
              <select
                className="border rounded-md px-2 bg-[#F8F8F8] text-sm cursor-pointer h-[48px] w-[235px] shadow-md"
                value={selectedRobot?.name || ""}
                onChange={handleRobotChange}
              >
                {robots.map((robot, index) => (
                  <option key={index} value={robot.name}>
                    {robot.name}
                  </option>
                ))}
              </select>
            </section>

            <Dashboard1 />
            <Dashboard2 />
            <Dashboard3 />
          </section>
        </section>
      </main>
    </>
  );
}
