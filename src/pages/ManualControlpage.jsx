import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import RobotControls from "../components/Dashboard/RobotControls";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { RobotContext } from "../context/RobotContext";
import IconsData from "../components/IconsData";

const position = [17.457065, 78.370719];
const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function ManualControlpage() {
  const { selectedRobot } = useContext(RobotContext);
  const headerRef = React.useRef(0);

  const [hideHeader, setHideHeader] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [labels, setLabels] = useState([]); // stores saved labels
  const [currentInput, setCurrentInput] = useState(""); // input value
  const [editIndex, setEditIndex] = useState(null); // which label we are editing

  const MapResizeHandler = () => {
    const map = useMap();
    useEffect(() => {
      map.invalidateSize();
    }, [map]);
    return null;
  };

  const robotPosition = selectedRobot.position || position;

  // Save or update label
  const handleSave = () => {
    if (!currentInput.trim()) return;
    if (editIndex !== null) {
      const updated = [...labels];
      updated[editIndex] = currentInput.trim();
      setLabels(updated);
      setEditIndex(null);
    } else {
      setLabels([...labels, currentInput.trim()]);
    }
    setCurrentInput("");
  };

  // Edit existing label
  const handleEdit = (index) => {
    setCurrentInput(labels[index]);
    setEditIndex(index);
  };

  // Delete label
  const handleDelete = (index) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        // scrolling down
        setHideHeader(true);
      } else {
        // scrolling up
        setHideHeader(false);
      }

      lastScrollY = currentScrollY;
    };

    // console.log("Adding scroll listener");
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [window.scrollY]);

  return !selectedRobot ? (
    <>
      <Header />
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Sidebar />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">
            No Robot Selected
          </h1>
          <p className="text-gray-500">
            Please go back to the dashboard and select a robot to view its
            controls.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  ) : (
    <>
      {/* Toggle header visibility with CSS */}
      <div
        ref={headerRef}
        className={`${hideHeader ? "-translate-y-full hidden" : "translate-y-0"
          }`}
      >
        <Header />
      </div>

      <main className="flex w-full flex-col gap-[10px]">
        <section className="custom-scroll flex h-[calc(100vh-80px)] w-full overflow-y-auto overflow-x-hidden">
          <div className="mt-[18px]">
            <Sidebar />
          </div>

          <section className="ml-[96px] min-h-max w-[calc(100%-96px)] px-2 pb-[20px]">
            <div className="flex w-full flex-row gap-4">
              {/* Left Column */}
              <div className="flex flex-1 flex-col bg-white mt-[18px] rounded-[14px] p-[12px]">
                <div className="flex justify-center">
                  <div className="relative max-h-[440px] w-full rounded-[14px] bg-black p-3">
                    <div className="absolute flex items-center">
                      <p className="mr-2 h-2.5 w-2.5 rounded-[50%] bg-red-500"></p>
                      <p className="text-[14px] text-white">REC</p>
                    </div>
                    <video
                      src="/Robot_Camera_Video_Generation.mp4"
                      autoPlay
                      loop
                      muted
                      className="h-full w-full rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
                <RobotControls />
              </div>

              {/* Right Column */}
              <div className="mt-[18px] relative mr-auto w-full max-w-[445px] self-start">
                {/* Customize / Exit Button */}
                <button
                  onClick={() => setIsCustomizeOpen((prev) => !prev)}
                  className="absolute right-2 top-2 z-1300 border bg-white rounded-full px-3 py-1 shadow-md text-sm"
                >
                  {isCustomizeOpen ? (
                    "Exit"
                  ) : (
                    <>Customize map {IconsData.location}</>
                  )}
                </button>

                {/* Map */}
                <div
                  className="overflow-hidden rounded-[32px] bg-gray-200 transition-all duration-300  h-[calc(110vh-80px)]"
                    
                >
                  <MapContainer
                    center={robotPosition}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="h-full w-full rounded-[32px]"
                  >
                    <MapResizeHandler />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={robotPosition} icon={customIcon}>
                      <Popup>{selectedRobot.location}</Popup>
                    </Marker>
                  </MapContainer>
                </div>

               
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
