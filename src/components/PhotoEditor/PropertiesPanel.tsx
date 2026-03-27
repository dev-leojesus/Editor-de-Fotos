import React from 'react';
import { useEditorStore } from './store';
import { SliderControl } from './SliderControl';
import { defaultAdjustments } from './types';
import { RotateCcw, RotateCw, RefreshCcw } from 'lucide-react';

export default function PropertiesPanel() {
  const { activeTab, adjustments, updateAdjustment, rotation, setRotation, resetAdjustments } = useEditorStore();

  const handleReset = (key: keyof typeof defaultAdjustments) => {
    updateAdjustment(key, defaultAdjustments[key]);
  };

  const renderAdjustments = () => (
    <div className="flex flex-col w-full h-full animate-fade-in">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100">Ajustes</h2>
        <button 
          onClick={resetAdjustments}
          className="text-xs flex items-center gap-1 text-zinc-400 hover:text-[#ccff00] transition-colors"
        >
          <RefreshCcw size={12} /> Redefinir tudo
        </button>
      </div>

      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pb-20 custom-scrollbar pr-2">
        <SliderControl 
          label="Brilho" min={0} max={200} value={adjustments.brightness} 
          onChange={(val) => updateAdjustment('brightness', val)} 
          onReset={() => handleReset('brightness')}
        />
        <SliderControl 
          label="Contraste" min={0} max={200} value={adjustments.contrast} 
          onChange={(val) => updateAdjustment('contrast', val)} 
          onReset={() => handleReset('contrast')}
        />
        <SliderControl 
          label="Saturação" min={0} max={200} value={adjustments.saturation} 
          onChange={(val) => updateAdjustment('saturation', val)} 
          onReset={() => handleReset('saturation')}
        />
        <SliderControl 
          label="Exposição" min={-100} max={100} value={adjustments.exposure} 
          onChange={(val) => updateAdjustment('exposure', val)} 
          onReset={() => handleReset('exposure')}
        />
        
        <div className="border-t border-zinc-800/50 my-6 pt-6"></div>
        
        <SliderControl 
          label="Temperatura" min={-100} max={100} value={adjustments.temp} 
          onChange={(val) => updateAdjustment('temp', val)} 
          onReset={() => handleReset('temp')}
        />
        <SliderControl 
          label="Tonalidade" min={-100} max={100} value={adjustments.tint} 
          onChange={(val) => updateAdjustment('tint', val)} 
          onReset={() => handleReset('tint')}
        />
        <SliderControl 
          label="Matiz" min={-180} max={180} value={adjustments.hue} 
          onChange={(val) => updateAdjustment('hue', val)} 
          onReset={() => handleReset('hue')}
        />
        
        <div className="border-t border-zinc-800/50 my-6 pt-6"></div>

        <SliderControl 
          label="Vinheta" min={0} max={100} value={adjustments.vignette} 
          onChange={(val) => updateAdjustment('vignette', val)} 
          onReset={() => handleReset('vignette')}
        />
        
        <div className="border-t border-zinc-800/50 my-6 pt-6"></div>

        <SliderControl 
          label="Nitidez" min={0} max={100} value={adjustments.sharpness} 
          onChange={(val) => updateAdjustment('sharpness', val)} 
          onReset={() => handleReset('sharpness')}
        />
      </div>
    </div>
  );

  const renderCrop = () => (
    <div className="flex flex-col w-full animate-fade-in">
      <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-6">Transform & Crop</h2>
      
      <div className="mb-6 bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <p className="text-xs text-zinc-400 uppercase tracking-wider mb-4 font-semibold">Rotate</p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setRotation(rotation - 90)}
            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex justify-center text-zinc-100 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
          <div className="w-16 text-center font-mono text-[#ccff00] text-sm bg-zinc-950 py-2.5 rounded-lg border border-zinc-800">
            {rotation}°
          </div>
          <button 
            onClick={() => setRotation(rotation + 90)}
            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex justify-center text-zinc-100 transition-colors"
          >
            <RotateCw size={18} />
          </button>
        </div>
      </div>
      
      {/* Crop Info */}
      <div className="bg-zinc-900 rounded-xl p-4 border border-[#ccff00]/20 mt-4">
        <p className="text-xs text-[#ccff00] uppercase tracking-wider mb-2 font-bold">Free Crop Active</p>
        <p className="text-[11px] text-zinc-400">Drag the handles over the image in the canvas area to define your crop boundaries.</p>
        <p className="text-[10px] text-zinc-500 mt-3 pt-3 border-t border-zinc-800">The crop will be applied automatically when you hit Export.</p>
      </div>
    </div>
  );

  // Filters predefined functionality
  const renderFilters = () => {
    const filters = [
      { id: 'none', name: 'Original', adjustments: defaultAdjustments },
      { id: 'vintage', name: 'Vintage', adjustments: { ...defaultAdjustments, sepia: 50, contrast: 120, brightness: 90, temp: 20 } },
      { id: 'bw', name: 'B&W Drama', adjustments: { ...defaultAdjustments, saturation: 0, contrast: 150, exposure: -10 } },
      { id: 'cold', name: 'Cold Mute', adjustments: { ...defaultAdjustments, saturation: 80, temp: -30, brightness: 105 } },
      { id: 'vivid', name: 'Vivid Pop', adjustments: { ...defaultAdjustments, saturation: 140, contrast: 110 } },
    ];
    
    return (
      <div className="flex flex-col w-full animate-fade-in">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-6">Presets</h2>
        <div className="grid grid-cols-2 gap-3">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => useEditorStore.getState().setAdjustments(filter.adjustments)}
              className="aspect-[4/3] bg-zinc-900 border border-zinc-800 hover:border-[#ccff00] transition-colors rounded-xl flex items-end p-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-80" />
              <span className="text-xs font-bold relative z-10 group-hover:text-[#ccff00] transition-colors">{filter.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderElements = () => (
    <div className="flex flex-col w-full animate-fade-in">
      <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-6">Graphics</h2>
      {/* Placeholder for elements panel */}
      <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-950/50">
        <div className="w-10 h-10 bg-zinc-900 rounded-full mx-auto mb-3 flex items-center justify-center text-zinc-500">
           T
        </div>
        <p className="text-xs text-zinc-500">Text & Shapes overlays available in full version.</p>
      </div>
    </div>
  );

  return (
    <aside className="w-[320px] h-full bg-zinc-950 border-l border-zinc-800/50 p-6 flex flex-col shrink-0 z-10 relative shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
      {activeTab === 'adjust' && renderAdjustments()}
      {activeTab === 'crop' && renderCrop()}
      {activeTab === 'filters' && renderFilters()}
      {activeTab === 'elements' && renderElements()}
    </aside>
  );
}
