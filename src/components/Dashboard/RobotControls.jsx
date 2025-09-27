import { useEffect, useState, useRef } from "react";
import IconsData from "../IconsData";
import PanTiltControl from "./PanTiltControl";
import { Link } from "react-router-dom";

const RobotComds = {
  // robot controls
  start: "start",
  stop: "stop",
  pause: "pause",
  forward: "forward",
  backward: "backward",
  right: "right",
  left: "left",
  forwardRight: "forwardRight",
  forwardLeft: "forwardLeft",
  backwardRight: "backwardRight",
  backwardLeft: "backwardLeft",
  volumeUp: "volumeUp",
  volumeDown: "volumeDown",
  cameraOn: "cameraOn",
  cameraOff: "cameraOff",
  micOn: "micOn",
  micOff: "micOff",

  // robot changed with values
  speed: 1,
  pan: 0,
  tilt: 0,
};

const initialUserRobotControls = {
  robotOn: false,
  pause: false,
  mute: false,
  zoom: 0,
};

const RemoteControl = () => {
  const ControlModeOn = true;
  const [status, setStatus] = useState("Connecting...");
  const [userRobotControls, setUserRobotControls] = useState(
    initialUserRobotControls
  );
  const logContainerRef = useRef(null);
  const [speed, setSpeed] = useState(1);

  // The available speed levels.
  const speedLevels = [4, 3, 2, 1];

  // Calculate the vertical position of the car icon as a percentage.
  const carTopPercentageMap = {
    4: 8, // 5% from the top
    3: 35, // Mid-point
    2: 63, // Mid-point
    1: 87, // 95% from the top (or 5% from the bottom)
  };

  const carTopPercentage = carTopPercentageMap[speed];
  //   const {ControlModeOn} = props;

  const updateRobotOn = () => {
    console.log("before:", userRobotControls);

    setUserRobotControls((prev) => {
      const newState = { ...prev, robotOn: !prev.robotOn, pause: !prev.pause };
      console.log("after (inside setState):", newState);
      return newState;
    });
  };

  // Fire publishCommand whenever robotOn changes
  useEffect(() => {
    if (userRobotControls.robotOn) {
      publishCommand(RobotComds.start, userRobotControls);
    } else {
      publishCommand(RobotComds.stop, userRobotControls);
    }
  }, [userRobotControls.robotOn]);

  const updateRobotCam = () => {
    setUserRobotControls((prev) => {
      const newState = { ...prev, cameraOn: !prev.cameraOn };
      publishCommand(
        newState.cameraOn ? RobotComds.cameraOn : RobotComds.cameraOff,
        newState
      );
      return newState;
    });
  };

  const updateRobotMic = () => {
    setUserRobotControls((prev) => {
      const newState = { ...prev, mute: !prev.mute };
      publishCommand(
        newState.mute ? RobotComds.micOff : RobotComds.micOn,
        newState
      );
      return newState;
    });
  };

  let iotClient = useRef(null);

  // console.log("Robot Control : ", userRobotControls.robotOn ? "ON" : "OFF");
  // --- AWS IoT and Cognito Configuration ---
  const REGION = "us-east-1";
  const IDENTITY_POOL_ID = "us-east-1:c752bc7c-b58e-4d8c-9ea8-3d0f4265f9fe";
  const IOT_ENDPOINT = "ain7shdyozzxm-ats.iot.us-east-1.amazonaws.com";
  const THING_NAME = "sr1_anvi";

  // Add a log message
  const addLog = (message, type = "info") => {
    if (!logContainerRef.current) return;

    const logItem = document.createElement("p");
    const timestamp = new Date().toLocaleTimeString();
    logItem.textContent = `[${timestamp}] ${message}`;

    let colorClass = "text-gray-400";
    if (type === "success") colorClass = "text-green-400";
    else if (type === "error") colorClass = "text-red-500";
    else if (type === "warning") colorClass = "text-yellow-400";

    logItem.classList.add("text-xs", colorClass);
    logContainerRef.current.appendChild(logItem);

    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
  };

  // Connect to AWS IoT
  const connectToIot = async () => {
    try {
      await window.AWS.config.credentials.getPromise();

      if (iotClient.current) {
        setStatus("Already Connected to AWS IoT");
        addLog("Already connected to AWS IoT Core.", "warning");
        return;
      }

      iotClient.current = new window.AWS.IotData({
        endpoint: IOT_ENDPOINT,
        region: REGION,
      });

      setStatus("Connected!");
      addLog("Successfully connected to AWS IoT Core.", "success");
    } catch (err) {
      console.error("Connection failed:", err);
      setStatus("Connection failed.");
      addLog(`Connection failed: ${err.message}. Retrying in 5s...`, "error");
      setTimeout(connectToIot, 5000);
    }
  };

  // Publish a command
  const publishCommand = (command) => {
    console.log("publishing command -> ", command);
    console.log('Robot is : ', userRobotControls);

    if (!userRobotControls.robotOn) {
      addLog("Robot is OFF. Command skipped.", "warning");
      return;
    }

   // After (The Fix)
if (
  !userRobotControls.robotOn &&
  command !== RobotComds.start &&
  command !== RobotComds.stop
) {
  addLog("Robot is OFF. Command skipped.", "warning");
  return;
}

    const params = {
      topic: `${THING_NAME}/commands/movement`,
      payload: JSON.stringify({ action: command }),
      qos: 0,
    };

    addLog(`Publishing command: '${command}'...`, "info");

    iotClient.current.publish(params, (err) => {
      if (err) {
        console.error("Publish failed:", err);
        setStatus("Publish failed.");
        addLog(`Publish failed for '${command}': ${err.message}`, "error");
      } else {
        setStatus("Command sent!");
        addLog(`Command '${command}' published successfully.`, "success");
        setTimeout(() => setStatus("Connected!"), 1000);
      }
    });
  };

  useEffect(() => {
    if (!ControlModeOn) return;

    const script = document.createElement("script");
    script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1158.0.min.js";
    script.async = true;

    script.onload = () => {
      if (window.AWS) {
        window.AWS.config.update({
          region: REGION,
          credentials: new window.AWS.CognitoIdentityCredentials({
            IdentityPoolId: IDENTITY_POOL_ID,
          }),
        });

        connectToIot();
      } else {
        console.error("AWS SDK failed to load");
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);

      if (iotClient.current) {
        try {
          iotClient.current = null; // AWS.IotData doesn’t need .end(), but free ref
          addLog("IoT client disconnected.", "warning");
        } catch (e) {
          console.warn("IoT cleanup error:", e);
        }
      }
    };
  }, [ControlModeOn]);

  return (
    <>
      <div className="flex flex-col  bg-gray300 w-full h-auto text-white">

        {/* Remote Control Section */}
        <section className="flex justify-start gap-[40px] w-full items-center p-2 ">
          <div className="w-[50%] flex gap-[60px] ">

            <div className=" flex flex-col gap-[40px] pt-[25px] ">

              {/* control section */}
              <div className="flex items-center justify-start ml-[70px]">
                <div className="relative">
                  {/* Zoom Control (Left) */}
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col items-center bg-gray-800 rounded-full py-2 px-1 text-white">
                    <button
                      className="text-lg font-bold cursor-pointer px-1.5"
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                      onClick={() => console.log("zoom in")}
                    >
                      +
                    </button>
                    <span className="text-xs my-1 p">Zm</span>
                    <button
                      className="text-lg font-bold cursor-pointer"
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                      onClick={() => console.log("zoom out")}
                    >
                      -
                    </button>
                  </div>
                  {/* Volume Control (Right) */}
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex flex-col items-center bg-gray-800 rounded-full py-2 px-1 text-white">
                    <button
                      className="text-lg font-bold cursor-pointer px-1.5"
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                      onClick={() => publishCommand(RobotComds.volumeUp)}
                    >
                      +
                    </button>
                    <span className="text-xs my-1">Vl</span>
                    <button
                      className="text-lg font-bold cursor-pointer"
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                      onClick={() => publishCommand(RobotComds.volumeDown)}
                    >
                      -
                    </button>
                  </div>
                  {/* Main Circle with Controls */}
                  <div className="controls-box  bg-white rounded-full w-42 h-42 flex items-center border-1 border-gray-200 b justify-center flex-wrap relative">
                    <button
                      onClick={() => publishCommand(RobotComds.forwardLeft)}
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                    >
                      <i className="-rotate-45 mt-[15px] ml-[15px]  text-[#1F9AB060]">
                        {IconsData.arrow}
                      </i>
                    </button>
                    <button
                      onClick={() => publishCommand(RobotComds.forward)}
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                    >
                      <i className=" mb-[15px]  text-[#1F9AB0]">
                        {IconsData.arrow}
                      </i>
                    </button>
                    <button
                      onClick={() => publishCommand(RobotComds.forwardRight)}
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                    >
                      <i className="rotate-45 mt-[15px] mr-[15px]  text-[#1F9AB060]">
                        {IconsData.arrow}
                      </i>
                    </button>

                    <button
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                      onClick={() => publishCommand(RobotComds.left)}
                    >
                      <i className="-rotate-90 mr-[15px]  text-[#1F9AB0] ">
                        {IconsData.arrow}
                      </i>
                    </button>
                    {/* Hidden button not to use */}
                    <button className="text-[40px] ">
                      <i className="-rotate-45">{IconsData.arrow}</i>
                    </button>
                    <button
                      onClick={() => publishCommand(RobotComds.right)}
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                    >
                      <i className="rotate-90 ml-[15px]  text-[#1F9AB0] ">
                        {IconsData.arrow}
                      </i>
                    </button>
                    <button
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                      onClick={() => publishCommand(RobotComds.backwardLeft)}
                    >
                      <i className="-rotate-135 mb-[15px] ml-[15px] text-[#1F9AB060]">
                        {IconsData.arrow}
                      </i>
                    </button>
                    <button
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                      onClick={() => publishCommand(RobotComds.backward)}
                    >
                      <i className="rotate-180 mt-[15px]  text-[#1F9AB0] ">
                        {IconsData.arrow}
                      </i>
                    </button>


                    <button
                      disabled={
                        !userRobotControls.robotOn && !userRobotControls.pause
                      }
                      onClick={() => publishCommand(RobotComds.backwardRight)}
                    >
                      <i className="rotate-135 mr-[15px] mb-[15px]  text-[#1F9AB060]">
                        {IconsData.arrow}
                      </i>
                    </button>




                    {/* Center (Pause/Stop) */}
                    <div className="controls-pause-box bg-white absolute overflow-hidden border-1 border-gray-200  rounded-full w-20 h-20 flex items-center justify-center align-middle">
                      <button
                        disabled={!userRobotControls.robotOn}
                        onClick={() => publishCommand(RobotComds.pause)}
                        className="pause-control-btn text-gray-500 hover:text-black place-items-center hover:scale-102 hover:bg-[#eee] w-full h-full text-[30px] cursor-pointer"
                      >
                        {IconsData.pause}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* options buttons */}
              <div className="flex gap-4 h-auto ml-[60px] ">
                <button
                  onClick={() => updateRobotMic()}
                  className=" control-button  p-3   cursor-pointer"
                >
                  <p className="text-[#1F9AB0]"> {IconsData.mute}</p>
                </button>
                <button
                  onClick={() => updateRobotOn()}
                  style={{
                    backgroundColor: !userRobotControls.robotOn ? "#ff3535" : "#31ad31",
                  }}
                  className="power-control-btn  p-3  control-button cursor-pointer"
                >
                  {IconsData.power}
                </button>
                <button
                  onClick={() => updateRobotCam()}
                  className=" control-button  p-3   cursor-pointer"
                >
                  <p className="text-[#1F9AB0]">{IconsData.camera}</p>
                </button>
              </div>
            </div>

            {/* Speed Controls */}
            <div className="w-[150px]  h-[286px]">
              <div className="w-full h-full bg-white rounded-[8px] px-4 flex flex-col  items-center justify-start ">
                {/* Title */}
                <span className="font-bold text-gray-800 mb-1 ">Speed </span>

                {/* Main slider area. We give it enough width to hold the road and the points. */}
                <div className="relative h-70 w-24">
                  {/* The "Road" Track - made wider */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full bg-[#1F1F27] rounded-lg">
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 
                      bg-[repeating-linear-gradient(to_bottom,white,white_4px,transparent_4px,transparent_12px)]"
                    />
                  </div>

                  {/* The movable car icon with updated alignment logic */}
                  <div
                    className="absolute left-1/2 z-20 transition-all duration-500 ease-in-out"
                    style={{
                      top: `${carTopPercentage}%`,
                      transform: "translate(-50%, -50%)",
                      width: "80px", // This centers the icon perfectly on the point
                    }}
                  >
                    <img src="/Robot-speed.png" className="" />
                  </div>

                  {/* Container for the clickable points, now positioned outside the road.
          FIX: Removed 'py-2' to make its height match the car's travel path exactly.
        */}
                  <div className="absolute top-0 h-full flex flex-col py-[10px] justify-between items-center left-[calc(50%+2.25rem)] ">
                    {speedLevels.map((level) => {
                      const isSelected = speed === level;

                      return (
                        <button
                          key={level}
                          onClick={() => setSpeed(level)}
                          className="relative w-7 h-7 z-10 cursor-pointer flex items-center justify-center rounded-full bg-white"
                        >
                          <div
                            className={`
                  w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                  ${isSelected
                                ? "bg-blue-500 ring-2 ring-white"
                                : "bg-transparent border border-gray-400"
                              }
                `}
                          >
                            <span
                              className={` 
                    text-sm font-bold
                    ${isSelected ? "text-white" : "text-gray-800"}
                  `}
                            >
                              {level}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[50%] justify-center h-full flex flex-col ">
            <div className="flex justify-end w-full mb-auto mt-[25px] ">
              <Link to="/dashboard" className=" rounded-[14px] bg-white px-4 py-2 border border-[#1E9AB0] shadow-md font-semibold text-[14px] text-[#1E9AB0] w-auto">Go to Automatic Mode</Link>
            </div>
            {/* Pan Controls */}
            <div className="w-full">

              <PanTiltControl />
            </div>
          </div>
        </section>
        <div className="flex justify-between items-center px-10   ">
          {/* Connection Status */}
          <div className="bg-gray-800 px-6 mt-2 py-3 w-auto flex self-start rounded-lg text-center shadow-md">
            <p className="text-xs w-max">
              Remote Access Status:{" "}
              <span
                className={`font-bold ${userRobotControls.robotOn
                  ? "text-green-400"
                    : "text-red-400"
                  }`}
              >
                {userRobotControls.robotOn ? 'Connected' : 'Disconnected'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoteControl;
