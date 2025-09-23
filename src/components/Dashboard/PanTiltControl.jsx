// src/components/PanTiltControl.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

// =================================================================
// 1. Pan Slider Component (Alignment Changed)
// =================================================================
const PanSlider = ({ value, onChange }) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(Math.round(value).toString());

  const size = 120;
  const radius = 50;
  const iconSize = 28;

  const handlePointClick = (e, val) => { e.stopPropagation(); onChange(val); };

  useEffect(() => {
    setInputValue(Math.round(value).toString());
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputSubmit = () => {
    let num = parseInt(inputValue, 10);
    if (isNaN(num)) {
      setInputValue(Math.round(value).toString());
      return;
    }
    const clampedNum = Math.max(0, Math.min(180, num));
    onChange(clampedNum);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
      e.target.blur();
    }
  };
  
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    let angleDeg = angleRad * (180 / Math.PI);
    angleDeg += 180;
    const finalValue = Math.max(0, Math.min(180, angleDeg));
    if (clientY < centerY) {
      onChange(Math.round(finalValue));
    }
  }, [isDragging, onChange]);

  const stopDragging = useCallback(() => setIsDragging(false), []);
  useEffect(() => { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('touchmove', handleMouseMove); window.addEventListener('mouseup', stopDragging); window.addEventListener('touchend', stopDragging); return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('touchmove', handleMouseMove); window.removeEventListener('mouseup', stopDragging); window.removeEventListener('touchend', stopDragging); }; }, [handleMouseMove, stopDragging]);
  const startDragging = (e) => { setIsDragging(true); handleMouseMove(e.nativeEvent); };
  const angleForHandle = (value - 180) * (Math.PI / 180);
  const handleX = (size / 2) + radius * Math.cos(angleForHandle);
  const handleY = (size / 2) + radius * Math.sin(angleForHandle);
  const arcPath = `M ${size/2 - radius},${size/2} A ${radius},${radius} 0 0 1 ${size/2 + radius},${size/2}`;
  const redLineRotation = value - 90;

  return (
    <div className="flex flex-col items-center">
      {/* --- JSX STRUCTURE CHANGED --- */}
      {/* The slider container now also holds the input box for correct positioning */}
      <div ref={sliderRef} className="relative flex flex-col items-center" style={{ width: `${size}px` }} onMouseDown={startDragging} onTouchStart={startDragging}>
        {/* Slider Arc and Handle */}
        <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute"><path d={arcPath} stroke="#E5E7EB" strokeWidth="3" fill="none" /></svg>
          <div onClick={(e) => handlePointClick(e, 0)} className="absolute w-1 h-1 bg-gray-200 hover:bg-cyan-600 rounded-full cursor-pointer z-10" style={{ top: '50%', left: `${(size / 2) - radius}px`, transform: 'translate(-50%, -50%)' }} />
          <div onClick={(e) => handlePointClick(e, 90)} className="absolute w-1 h-1 bg-gray-200 hover:bg-cyan-600 rounded-full cursor-pointer z-10" style={{ top: `${(size / 2) - radius}px`, left: '50%', transform: 'translate(-50%, -50%)' }} />
          <div onClick={(e) => handlePointClick(e, 180)} className="absolute w-1 h-1 bg-gray-200 hover:bg-cyan-600 rounded-full cursor-pointer z-10" style={{ top: '50%', left: `${(size / 2) + radius}px`, transform: 'translate(-50%, -50%)' }} />
          <div className="w-4 h-4 bg-cyan-500 rounded-full absolute cursor-pointer border border-white shadow-md z-20" style={{ left: `${handleX - 8}px`, top: `${handleY - 8}px` }} />
          
          {/* Icon Container */}
          <div className="absolute inset-0 h-[140px] flex items-end justify-center pointer-events-none">
            <div 
              className="absolute" 
              style={{ 
                top: '50%', 
                left: '50%', 
                transform: `translate(-50%, -100%) rotate(${redLineRotation}deg)`, 
                transformOrigin: '50% 100%', 
                transition: 'transform 100ms' 
              }}
            >
              <div className="relative">
                <Icon 
                  icon="ph:video-camera-light" 
                  width={iconSize}
                  height={iconSize}
                  className="text-gray-800 -rotate-90" 
                />
                <Icon 
                  className='text-red-500 absolute top-[-8px] left-1/2 -translate-x-1/2' 
                  icon="oi:arrow-top" 
                  width="8" 
                  height="8" 
                />
              </div>
            </div>
              <div className="flex flex-col items-center  ">
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputSubmit}
            onKeyDown={handleInputKeyDown}
            className="w-16 text-center text-black border border-gray-300 rounded-md py-1 pr-4"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">°</span>
        </div>
        <span className="text-sm text-black mt-1">Tilt</span>
      </div>
            
          </div>
          
        </div>

     x
      </div>
    </div>
  );
};

// ==================================================================
// 2. Tilt Slider Component (Alignment Changed)
// ==================================================================
const TiltSlider = ({ value, onChange }) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(Math.round(value).toString());

  const size = 120;
  const radius = 50;
  const iconSize = 28;

  const handlePointClick = (e, val) => { e.stopPropagation(); onChange(val); };

  useEffect(() => {
    setInputValue(Math.round(value).toString());
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputSubmit = () => {
    let num = parseInt(inputValue, 10);
    if (isNaN(num)) {
      setInputValue(Math.round(value).toString());
      return;
    }
    const clampedNum = Math.max(-90, Math.min(90, num));
    onChange(clampedNum);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
      e.target.blur();
    }
  };

  const handleMouseMove = useCallback((e) => { if (!isDragging || !sliderRef.current) return; const rect = sliderRef.current.getBoundingClientRect(); const centerX = rect.left + rect.width / 2; const centerY = rect.top + rect.height / 2; const clientX = e.clientX || e.touches[0].clientX; const clientY = e.clientY || e.touches[0].clientY; const angleRad = Math.atan2(clientY - centerY, clientX - centerX); let angleDeg = angleRad * (180 / Math.PI); if (angleDeg < 0) { angleDeg += 360; } const finalValue = angleDeg - 180; const clampedValue = Math.max(-90, Math.min(90, finalValue)); if (clientX < centerX) { onChange(Math.round(clampedValue)); } }, [isDragging, onChange]);
  const stopDragging = useCallback(() => setIsDragging(false), []);
  useEffect(() => { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('touchmove', handleMouseMove); window.addEventListener('mouseup', stopDragging); window.addEventListener('touchend', stopDragging); return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('touchmove', handleMouseMove); window.removeEventListener('mouseup', stopDragging); window.removeEventListener('touchend', stopDragging); }; }, [handleMouseMove, stopDragging]);
  const startDragging = (e) => { setIsDragging(true); handleMouseMove(e.nativeEvent); };
  const angleForHandle = (value + 180) * (Math.PI / 180);
  const handleX = (size / 2) + radius * Math.cos(angleForHandle);
  const handleY = (size / 2) + radius * Math.sin(angleForHandle);
  const arcPath = `M ${size/2},${size/2 - radius} A ${radius},${radius} 0 0 0 ${size/2},${size/2 + radius}`;
  const redLineRotation = value;

  return (
    // --- JSX STRUCTURE CHANGED ---
    // The main container is now a flex-row to place the input beside the slider
    <div className="flex items-center gap-2">
      {/* Slider Container */}
      <div ref={sliderRef} className="relative" style={{ width: `${size}px`, height: `${size}px` }} onMouseDown={startDragging} onTouchStart={startDragging}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute"><path d={arcPath} stroke="#E5E7EB" strokeWidth="3" fill="none" /></svg>
        <div onClick={(e) => handlePointClick(e, 90)} className="absolute w-1 h-1 bg-gray-200 hover:bg-cyan-600 rounded-full cursor-pointer z-10" style={{ top: `${(size / 2) - radius}px`, left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div onClick={(e) => handlePointClick(e, 0)} className="absolute w-1 h-1 bg-gray-200 hover:bg-cyan-600 rounded-full cursor-pointer z-10" style={{ top: '50%', left: `${(size / 2) - radius}px`, transform: 'translate(-50%, -50%)' }} />
        <div onClick={(e) => handlePointClick(e, -90)} className="absolute w-1 h-1 bg-gray-200 hover:bg-cyan-600 rounded-full cursor-pointer z-10" style={{ top: `${(size / 2) + radius}px`, left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div className="w-4 h-4 bg-cyan-500 rounded-full absolute cursor-pointer border border-white shadow-md z-20" style={{ left: `${handleX - 8}px`, top: `${handleY - 8}px` }} />
        
        {/* Icon Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="absolute flex items-center" 
            style={{ 
              left: '50%', 
              top: '50%', 
              transform: `translate(-100%, -50%) rotate(${redLineRotation}deg)`, 
              transformOrigin: '100% 50%', 
              transition: 'transform 100ms' 
            }}
          >
            <div className="relative">
              <Icon 
                icon="ph:video-camera-light" 
                width={iconSize} 
                height={iconSize}
                className="text-gray-800 rotate-180" 
              />
              <Icon 
                className='text-red-500 absolute -left-3 top-1/2 -translate-y-1 -rotate-90 ml-[4px]' 
                icon="oi:arrow-top" 
                width="8" 
                height="8" 
              />
            </div>
          </div>
            <div className="flex flex-col items-center ml-[128px] ">
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputSubmit}
            onKeyDown={handleInputKeyDown}
            className="w-16 text-center text-black border border-gray-300 rounded-md py-1 pr-4"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">°</span>
        </div>
        <span className="text-sm text-black mt-1">Tilt</span>
      </div>
        </div>
       
      </div>

      {/* Input Box Container (now next to the slider) */}
     
    </div>
  );
};


// =================================================================
// 3. Main Component (No changes needed)
// =================================================================
const PanTiltControl = () => {
  const [pan, setPan] = useState(90);
  const [tilt, setTilt] = useState(0);

  return (
  
      <div className="flex items-center justify-center gap-4 ">
        <PanSlider value={pan} onChange={setPan} />
        <TiltSlider value={tilt} onChange={setTilt} />
      </div>
   
  );
};

export default PanTiltControl;