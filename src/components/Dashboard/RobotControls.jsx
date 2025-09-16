import React from 'react';
import { FaPause, FaMicrophoneSlash, FaPowerOff, FaCamera } from "react-icons/fa";


export default function RobotControls() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {/* Header */}
      <div className="bg-[#1AA3AD] text-white text-xl font-semibold px-6 py-3 rounded-lg mb-8">
        Video feed mode
      </div>

      <div className="flex items-center gap-10">
        {/* Left controls */}
        <div className="flex flex-col items-center gap-10">
          {/* Horizontal slider */}
          <input
            type="range"
            className="w-28 accent-[#1AA3AD] h-2 rounded-full bg-gray-300 appearance-none"
          />

          {/* Tilt slider */}
          <div className="flex flex-col items-center">
            <input
              type="range"
              orient="vertical"
              className="h-32 accent-[#1AA3AD] [writing-mode:bt-lr] rotate-180 bg-gray-300 rounded-full appearance-none"
            />
            <span className="text-sm mt-2 text-gray-600">Tilt</span>
          </div>
        </div>

        {/* Main D-Pad */}
        <div className="relative">
          {/* Big circle */}
          <div className="bg-[#1AA3AD] w-64 h-64 rounded-full flex items-center justify-center relative shadow-md">
            {/* Directional arrows */}
            <button className="absolute top-6 text-white text-3xl leading-none">▲</button>
            <button className="absolute bottom-6 text-white text-3xl leading-none">▼</button>
            <button className="absolute left-6 text-white text-3xl leading-none">◀</button>
            <button className="absolute right-6 text-white text-3xl leading-none">▶</button>

            {/* Pause button */}
            <button className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow">
              <FaPause className="text-gray-500 text-3xl" />
            </button>
          </div>

          {/* Zoom control (left) */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 bg-black text-white flex flex-col items-center justify-between rounded-full h-32 w-10 py-2 shadow">
            <button className="text-xl">−</button>
            <span className="text-xs">Zm</span>
            <button className="text-xl">+</button>
          </div>

          {/* VI control (right) */}
          <div className="absolute -right-16 top-1/2 -translate-y-1/2 bg-black text-white flex flex-col items-center justify-between rounded-full h-32 w-10 py-2 shadow">
            <button className="text-xl">−</button>
            <span className="text-xs">VI</span>
            <button className="text-xl">+</button>
          </div>
        </div>
      </div>

      {/* Bottom control buttons */}
      <div className="flex gap-8 mt-10">
        <button className="bg-[#1AA3AD] p-4 rounded-2xl shadow">
          <FaMicrophoneSlash className="text-white text-xl" />
        </button>
        <button className="bg-[#1AA3AD] p-4 rounded-2xl shadow">
          <FaPowerOff className="text-white text-xl" />
        </button>
        <button className="bg-[#1AA3AD] p-4 rounded-2xl shadow">
          <FaCamera className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
}
