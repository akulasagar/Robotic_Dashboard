import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useRobot } from "../../context/RobotContext";

const position = [17.457065, 78.370719];

const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Dashboard2() {
  const { selectedRobot } = useRobot();

  const MapResizeHandler = () => {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
    }, [map]);
    return null;
    };

  if (!selectedRobot) {
    return (
      <section className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500 text-lg">No Robot Selected</p>
      </section>
    );
  }

  const maxSpeed = 100; // fixed max speed
  const avgSpeed = Number(selectedRobot.avg_speed) || 0;
  const currentSpeed = Number(selectedRobot.current_speed) || 0;

  // Outer circle (Average speed relative to max)
  const outerRadius = 100;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerPercentage = Math.min(avgSpeed / maxSpeed, 1);
  const outerOffset = outerCircumference * (1 - outerPercentage);

  // Inner circle (Current speed relative to max)
  const innerRadius = 60;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerPercentage = Math.min(currentSpeed / maxSpeed, 1);
  const innerOffset = innerCircumference * (1 - innerPercentage);

  return (
    <section className="flex mt-[20px] gap-5">
      {/* Left Column */}
      <div className="flex flex-col max-w-[340px] w-full gap-[20px] mb-10">
        {/* Robot Status Card */}
        <div className="w-full h-[270px] rounded-[32px] bg-white p-3">
          <p className="text-[22px] font-semibold">Status</p>
          <p className="text-[22px] mt-[20px] text-[#1E9AB0]">
            Currently {selectedRobot.status} . . . !
          </p>
        </div>

        {/* Robot Speed Card */}
        <div className="w-full h-[376px] rounded-[32px] bg-white p-3 flex flex-col">
          <p className="text-[22px] font-semibold">Speed Statistics</p>

          <div className="flex gap-4 mt-2 mb-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#0097A7]"></span>
              <span className="text-sm text-gray-700">Average Speed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-black"></span>
              <span className="text-sm text-gray-700">Current Speed</span>
            </div>
          </div>

          {/* Circular Chart */}
          <div className="relative flex items-center justify-center w-full max-w-[260px] h-[260px]">
            {/* Outer Circle */}
            <svg className="absolute w-full max-w-[260px] h-[260px] -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="100"
                stroke="#E5E7EB"
                strokeWidth="20"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="100"
                stroke="#0097A7"
                strokeWidth="20"
                fill="transparent"
                strokeDasharray={outerCircumference}
                strokeDashoffset={outerOffset}
              />
            </svg>

            {/* Inner Circle */}
            <svg className="absolute w-full max-w-[180px] h-[180px] -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="60"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="60"
                stroke="black"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={innerCircumference}
                strokeDashoffset={innerOffset}
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
              />
            </svg>

            {/* Center Text */}
            <div className="absolute text-center">
              <p className="text-[18px] font-semibold">
                {selectedRobot.current_speed}
              </p>
              <p className="text-[18px] text-md">kmph</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
       {/* Recent ALerts Card */}
            <div className='flex flex-col max-w-[550px] w-full gap-[10px]'>
                <div className=' w-full h-[380px]  bg-white rounded-[16px] p-3 flex flex-col gap-[26px]' >
                    <span className='flex justify-between px-2 text-[22px] font-semibold'><p>Recent Alerts</p> <img src='' /></span>
                    <div className='w-full max-w-[508px] h-[292px] flex flex-col gap-[18px]'>
                        <div className='w-full max-w-5408px]  h-[86px] bg-gray-50 rounded-[10px] flex flex-row  p-[18px] gap-[12px] items-center '>
                            <span className='h-[52px] w-[52px] rounded-[50%] bg-red-200 flex items-center justify-center aspect-1/1 '>
                                <img className='h-[14px] w-[12px]' src='/warning-icon.png' />
                            </span>
                            <span className='flex flex-col w-full'>
                                <p className='text-[15px] font-semibold '> Motion detected</p>
                                <p className='text-[12px] text-gray-500'>Unauthorized moment in sector.... </p>
                            </span>
                            <span className=''>
                                <Link to=""> <img className='h-[26px] w-[26px] cursor-pointer' src='/arrow-icon.png' /></Link>

                            </span>
                        </div>
                        <div className=' w-full h-[86px] bg-gray-50 rounded-[10px] flex flex-row  p-[18px] gap-[12px] items-center '>
                            <span className='h-[52px] w-[52px] rounded-[50%] bg-orange-200 flex items-center justify-center aspect-1/1 '>
                                <img className='h-[8px] w-[16px]' src='/Battery-icon.png' />
                            </span>
                            <span className='flex flex-col w-full '>
                                <p className='text-[15px] font-semibold '> Motion detected</p>
                                <p className='text-[12px] text-gray-500'>Unauthorized moment in sector.... </p>
                            </span>
                            <span className=''>
                                <Link to="/alerts"> <img className='h-[26px] w-[26px] cursor-pointer' src='/arrow-icon.png' /></Link>

                            </span>
                        </div>
                        <div className=' w-full h-[86px] bg-gray-50 rounded-[10px] flex flex-row  p-[18px] gap-[12px] items-center '>
                            <span className='h-[52px] w-[52px] rounded-[50%] bg-red-200 flex items-center justify-center aspect-1/1 '>
                                <img className='h-[14px] w-[12px]' src='/warning-icon.png' />
                            </span>
                            <span className='flex flex-col w-full '>
                                <p className='text-[15px] font-semibold '> Motion detected</p>
                                <p className='text-[12px] text-gray-500'>Unauthorized moment in sector.... </p>
                            </span>
                            <span className=''>
                                <Link to="/alerts"> <img className='h-[26px] w-[26px] cursor-pointer' src='/arrow-icon.png' /></Link>

                            </span>
                        </div>
                    </div>
                    </div>

     

        {/* Robot Info */}
        <div className="w-full h-[275px] bg-gradient-to-r from-white from-40% to-[#5BB9C5] rounded-[32px] border-b-5 border-[#5BB9C5] flex p-3">
          <div className="w-[60%] p-3 flex flex-col gap-4">
            <div className="pl-5">
              <p className="text-[22px] font-semibold">{selectedRobot.type}</p>
              <p className="text-[12px]">{selectedRobot.roboid}</p>
            </div>
            <div className="grid grid-cols-2 gap-y-5 text-[12px]">
              <span>
                <p className="pl-4 text-gray-400">Status</p>
                <span className="flex items-center text-[12px]">
                  <p className="h-2.5 w-2.5 bg-amber-200 rounded-[50%] mr-2"></p>
                  <p>{selectedRobot.status}</p>
                </span>
              </span>
              <span className="justify-center items-center flex flex-col">
                <p className="text-gray-400">Battery Level</p>
                <span className="flex items-center text-[12px]">
                  <img className="h-[8px] w-[14px]" src="/Battery-icon.png" />{" "}
                  <p>{selectedRobot.battery}%</p>
                </span>
              </span>

              <span>
                <p className="pl-4 text-gray-400">Location</p>
                <span className="flex items-center text-[12px]">
                  <p className="h-2.5 w-2.5 bg-amber-200 rounded-[50%] mr-2 "></p>
                  <p>{selectedRobot.location}</p>
                </span>
              </span>
              <span className="justify-center items-center flex flex-col">
                <p className="text-gray-400 ">Signal Strength</p>
                <span className="flex items-center text-[12px]">
                  <img className="h-[8px] w-[14px]" src="/Battery-icon.png" />{" "}
                  <p>{selectedRobot.signal_strength}</p>
                </span>
              </span>
            </div>
          </div>
          <div className="w-[40%] flex justify-center items-center">
            <img src={selectedRobot.image} alt="Robot" />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-[435px] gap-[10px] w-full">
        <div className="w-full h-[665px] bg-gray-200 rounded-[32px] overflow-hidden">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full rounded-[32px]"
          >
            <MapResizeHandler />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={customIcon}>
              <Popup>{selectedRobot.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
