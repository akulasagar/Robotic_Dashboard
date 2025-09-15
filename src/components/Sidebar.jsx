import React from 'react';
import { SidebarData } from "../utils/SidebarData.js"
import { Link } from 'react-router-dom';


export default function Sidebar() {
    return (
        <div className='sidebar h-full w-[80px] mx-[10px] z-100 absolute   '>
            <div className=' h-full w-full hover:w-[210px] bg-white flex flex-col gap-6 p-4    rounded-2xl overflow-hidden '>
            <div className='flex flex-col justify-center items-center mt-10'>
                <span className='w-20 bg-gray-300 rounded-[50%] h-20'></span>
                <p>{SidebarData.Profilebox.user_name}</p>
            </div>
            <div>
                <h1 className='mb-5 mt-5'>MAIN MENU</h1>
                {SidebarData.Mainmenu.map(each => (
                    <Link className=' ' to={each.link}>
                        <span className='flex hover:bg-[#1E9AB0] hover:text-white hover:rounded-md  flex-row p-2 '>
                            <img className='mr-3 px-2 ' src={each.icon} />{each.label}</span>
                    </Link>
                ))}
            </div>

            <div>
                <h1 className='mb-5 mt-5'>Settings</h1>
                {SidebarData.Settings.map(each => (
                    <Link to={each.link}>
                        <span className='flex hover:bg-[#1E9AB0] hover:text-white hover:rounded-md  flex-row p-2 '>
                            <img className='mr-3 px-2 ' src={each.icon} />{each.label}</span>
                    </Link>
                ))}
            </div>
            </div>
        </div>
    );
}
