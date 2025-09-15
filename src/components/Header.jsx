import React from 'react';

export default function Header() {
  return (
    <header className='flex flex-row  justify-center items-center px-4 bg-white h-[80px] sticky top-0  '>
        <img src="logo.png" alt="Logo" className="h-40 w-40 absolute left-3" />
       
        <h1 className=' text-2xl font-semibold  '>Robo Dashboard</h1>
    </header>
  );
}
