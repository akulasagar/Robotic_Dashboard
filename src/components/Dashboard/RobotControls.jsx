import { useEffect, useState, useRef } from "react";
import IconsData from "../IconsData";
import PanTiltControl from "./PanTiltControl";


const RemoteControl = () => {
 
  
  const [speed, setSpeed] = useState(1);
  
  // The available speed levels.
  const speedLevels = [4, 3, 2, 1];

  // Calculate the vertical position of the car icon as a percentage.
  const carTopPercentageMap = {
    4: 8,   // 5% from the top
    3: 35,  // Mid-point
    2: 63,  // Mid-point
    1: 87,  // 95% from the top (or 5% from the bottom)
  };

  const carTopPercentage = carTopPercentageMap[speed];
  //   const {ControlModeOn} = props;

  const [status, setStatus] = useState("Connecting...");
  const logContainerRef = useRef(null);

  let iotClient = useRef(null);

  console.log('Remote Control');
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
        setStatus("Already Connected");
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
    if (!iotClient.current) {
      addLog("IoT client not connected. Please wait...", "warning");
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

        setTimeout(() => {
          setStatus("Connected!");
        }, 1000);
      }
    });
  };

  useEffect(() => {
    // Load AWS SDK from CDN dynamically
    const script = document.createElement("script");
    script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1158.0.min.js";
    script.onload = () => {
      window.AWS.config.region = REGION;
      window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID,
      });
      connectToIot();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);



  

  return (
    <div className="flex gap-8 bg-gray300 w-full h-auto text-white">
      {/* Remote Control Section */}
      <section className="flex justify-between w-full items-center">
        <div className=" flex flex-col gap-[40px] w-[30%]">
          {/* Connection Status */}
          {/* <div className="bg-gray-800 px-6 mt-2 py-3 w-auto flex self-start rounded-lg text-center shadow-md">
            <p className="text-xs w-max">
              Remote Access Status:{" "}
              <span
                className={`font-bold ${status === "Connected!"
                  ? "text-green-400"
                  : status === "Already Connected"
                    ? "text-yellow-400"
                    : "text-red-400"
                  }`}
              >
                {status}
              </span>
            </p>
          </div> */}

          {/* control section */}
          <div className="flex items-center justify-start ml-[70px]">
            <div className="relative">
              {/* Zoom Control (Left) */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col items-center bg-gray-800 rounded-full py-2 px-1 text-white">
                <button className="text-lg font-bold cursor-pointer px-1.5">
                  +
                </button>
                <span className="text-xs my-1 p">Zm</span>
                <button className="text-lg font-bold cursor-pointer">-</button>
              </div>

              {/* Volume Control (Right) */}
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex flex-col items-center bg-gray-800 rounded-full py-2 px-1 text-white">
                <button className="text-lg font-bold cursor-pointer px-1.5" onClick={() => publishCommand('VolumeUp')}>
                  +
                </button>
                <span className="text-xs my-1">Vl</span>
                <button className="text-lg font-bold cursor-pointer" onClick={() => publishCommand('VolumeDown')}>-</button>
              </div>


              {/* Main Circle with Controls */}
              <div className="controls-box rotate-45 bg-[#1F9AB0] rounded-full w-38 h-38 flex items-center justify-center flex-wrap relative">

                <button onClick={() => publishCommand("up")}>
                  <i className="-rotate-45 mt-[15px] ml-[15px] ">{IconsData.arrow}</i>
                </button>
                <button onClick={() => publishCommand("forward_right")}>
                  <i className="rotate-0 mb-[15px] text-[#FFFFFF38]">{IconsData.arrow}</i>
                </button>
                <button onClick={() => publishCommand("right")}>
                  <i className="rotate-45 mt-[15px] mr-[15px]">{IconsData.arrow}</i>
                </button>
                <button onClick={() => publishCommand("forward_left")}>
                  <i className="-rotate-90 mr-[15px] text-[#FFFFFF38]">{IconsData.arrow}</i>
                </button>
                {/* Hidden button not to use */}
                <button >
                  <i className="-rotate-45">{IconsData.arrow}</i>
                </button>
                <button onClick={() => publishCommand("backward_right")}>
                  <i className="rotate-90 ml-[15px] text-[#FFFFFF38]">{IconsData.arrow}</i>
                </button>
                <button onClick={() => publishCommand("left")}>
                  <i className="-rotate-135 ml-[15px] mb-[15px]">{IconsData.arrow}</i>
                </button>
                <button onClick={() => publishCommand("backward_left")}>
                  <i className="rotate-180 mt-[15px] text-[#FFFFFF38]">{IconsData.arrow}</i>
                </button>
                <button onClick={() => publishCommand("down")}>
                  <i className="rotate-135 mb-[15px] mr-[15px]">{IconsData.arrow}</i>
                </button>





                {/* Center (Pause/Stop) */}
                <div className="bg-white absolute overflow-hidden -rotate-45 rounded-full w-20 h-20 flex items-center justify-center align-middle">
                  <button
                    onClick={() => publishCommand("stop")}
                    className="text-gray-500 hover:text-black place-items-center hover:scale-102 hover:bg-[#eee] w-full h-full text-[30px] cursor-pointer"
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
              onClick={() => publishCommand("mute")}
              className="bg-[#1F9AB0] p-3 rounded-xl shadow-md cursor-pointer"
            >
              {IconsData.mute}
            </button>
            <button
              onClick={() => publishCommand("power")}
              className="bg-[#1F9AB0] p-3 rounded-xl shadow-md cursor-pointer"
            >
              {IconsData.power}
            </button>
            <button
              onClick={() => publishCommand("camera")}
              className="bg-[#1F9AB0] p-3 rounded-xl shadow-md cursor-pointer"
            >
              {IconsData.camera}
            </button>
          </div>

        </div>
        {/* <div className="w-full h-auto flex mt-[20px] items-start justify-center relative">

          <div className="flex flex-col w-auto">
            <div className=" w-[105px] flex justify-center h-[40px] overflow-hidden " >
              <div className="w-[100px] h-[100px] border-gray-600 border-2 rounded-[50%]  ">
              </div>
            </div>
            <span className="text-black -rotate-90">{IconsData.videocamera}</span>
          </div>
          
        <div className="flex w-auto ">
            <div className="mt-[10px] w-[105px] flex justify-center h-[40px] overflow-hidden -rotate-90" >
              <div className="w-[100px] h-[100px] border-gray-600 border-2 rounded-[50%]  ">
              </div>
            </div>
            <span className="text-black rotate-180">{IconsData.videocamera}</span>
          </div>

        </div> */}
        <div className="w-[20%] p-[2px] h-[286px]">
    <div className="w-full h-full bg-white rounded-[8px] p-4 flex flex-col  items-center">
        
      {/* Title */}
      <span className="font-bold text-gray-800 mb-1 ">Speed </span>

      {/* Main slider area. We give it enough width to hold the road and the points. */}
      <div className="relative h-70 w-24">
        
        {/* The "Road" Track - made wider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full bg-[#1F1F27] rounded-lg">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 
                      bg-[repeating-linear-gradient(to_bottom,white,white_4px,transparent_4px,transparent_12px)]" 
          />
        </div>

        {/* The movable car icon with updated alignment logic */}
        <div
          className="absolute left-1/2 z-20 transition-all duration-500 ease-in-out"
          style={{
            top: `${carTopPercentage}%`,
            transform: 'translate(-50%, -50%)',
            width:'80px' // This centers the icon perfectly on the point
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
                className="relative w-7 h-7 z-10 flex items-center justify-center rounded-full bg-white"
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                  ${isSelected ? 'bg-blue-500 ring-2 ring-white' : 'bg-gray-200 border border-gray-400'}
                `}>
                  <span className={` 
                    text-sm font-bold
                    ${isSelected ? 'text-white' : 'text-gray-800'}
                  `}>
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
        <div className="w-[30%]">
          <PanTiltControl/>
        </div>
      </section>

      {/* Log Section */}
      <div
        ref={logContainerRef}
        className="bg-gray-800 p-4 hidden rounded-lg w-[40%] h-[400px] overflow-y-scroll shadow-lg"
      >
        <p className="text-sm text-gray-400 mb-2">Log:</p>
      </div>
    </div>
  );
};

export default RemoteControl;
