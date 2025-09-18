import { useEffect, useState, useRef } from "react";
import IconsData from "../IconsData";

const RemoteControl = () => {
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
      <section className="flex flex-col gap-[40px] w-full">
        {/* Connection Status */}
        <div className="bg-gray-800 px-6 py-3 w-auto flex self-end rounded-lg text-center shadow-md">
          <p className="text-xs w-max">
            Remote Access Status:{" "}
            <span
              className={`font-bold ${
                status === "Connected!"
                  ? "text-green-400"
                  : status === "Already Connected"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {status}
            </span>
          </p>
        </div>

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
              {/* Up */}
              <button
                onClick={() => publishCommand("up")}
                className="text-white cursor-pointer"
              >
                <i className="-rotate-45">{IconsData.arrow}</i>
              </button>
              {/* Right */}
              <button
                onClick={() => publishCommand("right")}
                className="text-white cursor-pointer"
              >
                <i className="rotate-45">{IconsData.arrow}</i>
              </button>
              {/* Down */}
              <button
                onClick={() => publishCommand("left")}
                className="text-white cursor-pointer"
              >
                <i className="-rotate-135">{IconsData.arrow}</i>
              </button>
              {/* Left */}
              <button
                onClick={() => publishCommand("down")}
                className="text-white cursor-pointer"
              >
                <i className="rotate-135">{IconsData.arrow}</i>
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
