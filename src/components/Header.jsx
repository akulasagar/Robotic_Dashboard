import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isRobotsPage = location.pathname === "/";

  return (
    <header className="relative flex items-center px-4 bg-white h-[80px]  top-0 max-w-[1500px] ">
      {/* Logo - stays left */}
      <img src="logo.png" alt="Logo" className="h40 w-40 absolute left-3" />

      {/* Center Heading (Only on Robots page) */}
      {isRobotsPage && (
        <h1 className="text-2xl font-semibold mx-auto">Robots</h1>
      )}

      {/* Navigation - Only on other pages */}
      {!isRobotsPage && (
        <nav className="absolute right-[10%] flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-[12px] border ${
                isActive
                  ? "bg-[#1E9AB0] text-white border-[#1E9AB0]"
                  : "border-[#1E9AB0] hover:bg-gray-100 text-black"
              }`
            }
          >
            Robots
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-[12px] border ${
                isActive
                  ? "bg-[#1E9AB0] text-white border-[#1E9AB0]"
                  : "border-[#1E9AB0] hover:bg-gray-100 text-black"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              `px-4 py-2 rounded-[12px] border ${
                isActive
                  ? "bg-[#1E9AB0] text-white border-[#1E9AB0]"
                  : "border-[#1E9AB0] hover:bg-gray-100 text-black"
              }`
            }
          >
            Events
          </NavLink>
        </nav>
      )}
    </header>
  );
}
