import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  onReset?: () => void;
  defaultValue?: number;
}

export function SliderControl({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onChange, 
  onReset,
  defaultValue = 0 
}: SliderControlProps) {
  
  // Custom tracking logic for the fill color
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="flex flex-col gap-2 w-full mb-6">
      <div className="flex justify-between items-center text-xs font-semibold tracking-wide">
        <span className="text-zinc-300 uppercase">{label}</span>
        <button 
          onClick={() => onReset && onReset()}
          className="text-[#ccff00] bg-zinc-900/50 hover:bg-zinc-800 px-2 py-0.5 rounded cursor-pointer transition-colors"
        >
          {value}
        </button>
      </div>
      
      <div className="relative h-5 flex items-center group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-zinc-800 rounded-full appearance-none outline-none cursor-ew-resize z-10"
          style={{
            background: `linear-gradient(to right, #ccff00 ${percentage}%, #27272a ${percentage}%)`,
          }}
        />
        {/* Custom thumb style injected via global CSS or Tailwind arbitrary values */}
        <style dangerouslySetInnerHTML={{__html: `
          input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #ccff00;
            cursor: ew-resize;
            box-shadow: 0 0 10px rgba(204, 255, 0, 0.4);
            border: 2px solid #18181b;
            transition: transform 0.1s;
          }
          input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
        `}} />
      </div>
      
      {/* Visual ticks overlay (optional center tick) */}
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[9px] text-zinc-600 block">{min}</span>
        <span className="text-[9px] text-zinc-600 block">{max}</span>
      </div>
    </div>
  );
}
