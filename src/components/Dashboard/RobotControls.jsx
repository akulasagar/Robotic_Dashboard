import IconsData from "../IconsData";

export default function RemoteControl() {
  return (
    <section className="flex flex-col mt-[20px]   gap-[40px] w-[40%]">  
    <div className=" flex items-center justify-start  ml-[70px]   bg-white">
      {/* Left control section */}
      <div className="flex items-center gap-6">
        {/* Circle Control */}
        <div className="relative">
          {/* Zoom Control (Left) */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col items-center bg-gray-800 rounded-full py-2 px-1 text-white">
            <button className="text-lg font-bold cursor-pointer px-1.5">+</button>
            <span className="text-xs my-1 p">Zm</span>
            <button className="text-lg font-bold cursor-pointer">-</button>
          </div>

          {/* Volume Control (Right) */}
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex flex-col items-center bg-gray-800 rounded-full py-2 px-1 text-white">
            <button className="text-lg font-bold cursor-pointer px-1.5">+</button>
            <span className="text-xs my-1">Vl</span>
            <button className="text-lg font-bold cursor-pointer">-</button>
          </div>

          {/* Main Circle */}
          <div className="bg-[#1F9AB0] rounded-full w-38 h-38 flex items-center justify-center relative">
            {/* Arrows */}
            <button className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-xl cursor-pointer">{IconsData.arrow}</button>
            <button className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xl rotate-180 cursor-pointer">{IconsData.arrow}</button>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-xl rotate-270 cursor-pointer">{IconsData.arrow}</button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl rotate-90 cursor-pointer">{IconsData.arrow}</button>

            {/* Center Button */}
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
              <span className="text-gray-500 text-[] cursor-pointer">{IconsData.pause}</span>
            </div>
          </div>
        </div>

        {/* Right buttons */}
        
      </div>
     
    </div>
     <div className="flex gap-4 h-full ml-[60px] ">
      
          <button className="bg-[#1F9AB0] p-3 rounded-xl text-white shadow-md cursor-pointer">
            {IconsData.mute}
          </button>
          <button className="bg-[#1F9AB0] p-3 rounded-xl text-white shadow-md cursor-pointer">
          {IconsData.power}
          </button>
          <button className="bg-[#1F9AB0] p-3 rounded-xl text-white shadow-md cursor-pointer">
            {IconsData.camera}
          </button>
          
        </div>
</section>
  );
}
