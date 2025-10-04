import React, { useContext, useState, useMemo } from 'react';
import { RobotContext } from "../context/RobotContext";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconsData from '../components/IconsData';
import VideoStreaming from '../components/Dashboard/VideoStreaming';

// Configuration object to style each event card
const eventConfig = {
    "Person Detection": { icon: IconsData.profile, color: "bg-blue-600" },
    "Face Recognition": { icon: IconsData.face, color: "bg-purple-600" },
    "Car Detection": { icon: IconsData.car, color: "bg-green-600" },
    "Number Plate Recognition": { icon: IconsData.plate, color: "bg-[#F59E0B]" },   
};

// Helper function to format the date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour12: false
    }).replace(',', '');
};

// A new, reusable component for a single event category card
function EventCard({ eventName, allEvents }) {
    
    // Sort events to find the latest and the rest
    const sortedEvents = useMemo(() => {
        if (!allEvents || allEvents.length === 0) return [];
        return [...allEvents].sort((a, b) => new Date(b.time_date) - new Date(a.time_date));
    }, [allEvents]);

    if (sortedEvents.length === 0) {
        return null; // Don't render a card if there are no events for this category
    }

    const latestEvent = sortedEvents[0];
    console.log("Latest Event:", latestEvent);
    const recentEvents = sortedEvents.slice(1);
    const config = eventConfig[eventName] || eventConfig.default;

    return (
        <div className='w-full max-h-[420px] bg-white rounded-[14px] shadow-sm overflow-hidden'>
           <div className=' flex items-center h-[64px] px-[10px]'>
                    <span className={`p-2 w-[36px] h-[36px] rounded-full aspect-square ${config.color} text-white flex items-center justify-center`}>
                        {config.icon}
                    </span>
                    <h1 className='p-2 text-[14px] font-semibold  bg-opacity-40 rounded-r-lg'>{eventName}</h1>
                </div>
            <div className='relative h-[190px] w-full'>
                {/* Main image is the latest event */}
                <img src={latestEvent.image} alt="Latest Event" className='h-full w-full object-cover' />
                <div className='absolute bottom-2 left-2 bg-opacity-50  text-xs px-2 py-1 rounded'>
                    Latest Capture: {formatDate(latestEvent.time_date)}
                </div>
               
            </div>
            <div className='h-[150px] w-full p-[12px] flex flex-col'>
                <h1 className='text-[12px] font-semibold mb-2'>Recent Events</h1>
                {/* Horizontal scroll for recent events */}
                <div className='grid grid-cols-6 overflow-y-auto whitespace-nowrap custom-scroll-horizontal gap-[4px]'>
                    {recentEvents.map((event, index) => (
                        <div key={index} className='flex  flex-col items-center'>
                            <img className='max-h-[80px] max-w-[80px] object-cover rounded-md' src={event.image} alt={`Event ${index + 1}`} />
                            <p className='text-[8px] m-auto mt-1'>{formatDate(event.time_date)}</p>
                        </div>
                    ))}
                    {recentEvents.length === 0 && (
                        <p className='text-sm text-gray-400'>No other recent events.</p>
                    )}
                </div>
            </div>
        </div>
    );
}


export default function Events() {
    const { robots, selectedRobot, setSelectedRobot } = useContext(RobotContext);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const handleRobotChange = (e) => {
        const selectedName = e.target.value;
        const foundRobot = robots.find((robot) => robot.name === selectedName);
        setSelectedRobot(foundRobot);
    };

    // Get the event categories from the selected robot
    const eventCategories = selectedRobot?.events ? Object.entries(selectedRobot.events) : [];

    return (
        <>
            <Header />
            <main className="flex flex-col w-full gap-[10px]">
                <section className="flex h-[calc(100vh-80px)] w-full overflow-y-auto overflow-x-hidden custom-scroll pt-[18px] relative">
                    <Sidebar />
                    <section className="w-[calc(100%-96px)] min-h-[calc(100vh-80px)] overflow-y-auto ml-[96px] px-[10px] pb-[20px] custom-scroll">
                        <div className='p-[12px] bg-[#F9FAFB] border border-[#1E9AB0] rounded-[12px]'>
                            <div className='sticky top-0 z-10 bg-[#F9FAFB] flex justify-between items-center px-[20px] py-[10px] mb-4'>
                                <select
                                    className="border rounded-md p-2 bg-white text-sm cursor-pointer shadow-sm"
                                    value={selectedRobot?.name || ""}
                                    onChange={handleRobotChange}
                                >
                                    {robots.map((robot, index) => (
                                        <option key={index} value={robot.name}>
                                            {robot.name}
                                        </option>
                                    ))}
                                </select>
                                <div className='flex gap-4'>
                                    <div className="m-auto text-start flex items-center">
                                        <label className="block text-sm">From:</label>
                                        <DatePicker
                                            selected={fromDate}
                                            onChange={(date) => setFromDate(date)}
                                            className="border rounded-[6px] p-2 ml-2 w-[160px]"
                                            placeholderText="Select date"
                                            maxDate={new Date()}
                                        />
                                    </div>
                                    <div className="m-auto text-start flex items-center">
                                        <label className="block text-sm">To:</label>
                                        <DatePicker
                                            selected={toDate}
                                            onChange={(date) => setToDate(date)}
                                            className="border rounded-[6px] ml-2 p-2 w-[160px]"
                                            placeholderText="Select date"
                                            maxDate={new Date()}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Main grid for event cards */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                                {!selectedRobot ? (
                                    <p className='col-span-full text-center text-gray-500'>Please select a robot to view events.</p>
                                ) : eventCategories.length === 0 ? (
                                    <p className='col-span-full text-center text-gray-500'>No events found for {selectedRobot.name}.</p>
                                ) : (
                                    eventCategories.map(([eventName, eventsList]) => (
                                        <EventCard key={eventName} eventName={eventName} allEvents={eventsList} />
                                    ))
                                )}
                            </div>
                        </div>
                        <VideoStreaming />
                    </section>

                </section>
            </main>
        </>
    );
}