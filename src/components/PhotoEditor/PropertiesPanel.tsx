import React from 'react';
import { useEditorStore } from './store';
import { SliderControl } from './SliderControl';
import { defaultAdjustments } from './types';
import { RotateCcw, RotateCw, RefreshCcw, Type, Trash } from 'lucide-react';

export default function PropertiesPanel() {
  const { activeTab, adjustments, updateAdjustment, rotation, setRotation, resetAdjustments, filterIntensity, setFilterIntensity, cropAspectRatio, setCropAspect, textLayers, selectedTextId, addText, updateText, removeText, setSelectedTextId } = useEditorStore();

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
    <div className="flex flex-col w-full h-full animate-fade-in">
      <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-6 shrink-0">Recortar & Girar</h2>
      
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-4 pb-20">
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <p className="text-xs text-zinc-400 uppercase tracking-wider mb-4 font-semibold">Girar Imagem</p>
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
        
        <div className="bg-zinc-900 rounded-xl p-4 border border-[#ccff00]/20">
          <p className="text-xs text-[#ccff00] uppercase tracking-wider mb-4 font-bold">Formatos de Recorte</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => setCropAspect(undefined)} className={`p-2 text-xs rounded-lg border ${!cropAspectRatio ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}>Livre</button>
            <button onClick={() => setCropAspect(1)} className={`p-2 text-xs rounded-lg border ${cropAspectRatio === 1 ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}>1:1 (Instagram)</button>
            <button onClick={() => setCropAspect(4/5)} className={`p-2 text-xs rounded-lg border ${cropAspectRatio === 4/5 ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}>4:5 (Post)</button>
            <button onClick={() => setCropAspect(9/16)} className={`p-2 text-xs rounded-lg border ${cropAspectRatio === 9/16 ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}>9:16 (Stories)</button>
            <button onClick={() => setCropAspect(16/9)} className={`p-2 text-xs col-span-2 rounded-lg border ${cropAspectRatio === 16/9 ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}>16:9 (YouTube / Capa)</button>
          </div>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('apply-crop'))}
            className="w-full py-3 bg-[#ccff00] text-black font-bold flex justify-center items-center rounded-lg hover:bg-[#b3e600] transition-colors uppercase tracking-widest text-[10px]"
          >
            Aplicar Corte
          </button>
          <p className="text-[10px] text-zinc-500 mt-4 text-center border-t border-zinc-800 pt-3">Arraste pela tela para selecionar a área e clique acima para cortar a imagem definitivamente.</p>
        </div>
      </div>
    </div>
  );

  // Filters predefined functionality
  const renderFilters = () => {
    const filters = [
      { id: 'none', name: 'Original', adjustments: defaultAdjustments },
      { id: 'vintage', name: 'Vintage', adjustments: { ...defaultAdjustments, contrast: 120, brightness: 90, temp: 30, saturation: 70 } },
      { id: 'bw', name: 'B&W Drama', adjustments: { ...defaultAdjustments, saturation: 0, contrast: 150, exposure: -10 } },
      { id: 'cold', name: 'Cold Mute', adjustments: { ...defaultAdjustments, saturation: 80, temp: -30, brightness: 105 } },
      { id: 'vivid', name: 'Vivid Pop', adjustments: { ...defaultAdjustments, saturation: 140, contrast: 110 } },
      { id: 'cinematic', name: 'Cinematic', adjustments: { ...defaultAdjustments, saturation: 85, contrast: 130, temp: -10, tint: 10, vignette: 20 } },
      { id: 'golden', name: 'Golden Hour', adjustments: { ...defaultAdjustments, temp: 40, saturation: 120, brightness: 110, hue: -5 } },
      { id: 'cyberpunk', name: 'Cyberpunk', adjustments: { ...defaultAdjustments, temp: -40, tint: 50, saturation: 150, contrast: 140 } },
      { id: 'matte', name: 'Matte Film', adjustments: { ...defaultAdjustments, contrast: 80, brightness: 115, saturation: 80, vignette: 10 } },
      { id: 'noir', name: 'Noir Crime', adjustments: { ...defaultAdjustments, saturation: 0, contrast: 180, exposure: -20, vignette: 40 } },
      { id: 'pastel', name: 'Pastel Dream', adjustments: { ...defaultAdjustments, brightness: 120, contrast: 90, saturation: 85, temp: -10 } },
      { id: 'autumn', name: 'Autumn', adjustments: { ...defaultAdjustments, temp: 50, saturation: 110, tint: 10, contrast: 110 } },
      { id: 'polaroid', name: 'Polaroid', adjustments: { ...defaultAdjustments, contrast: 90, saturation: 75, temp: 20, tint: -10, brightness: 110 } },
      { id: 'cyber', name: 'Neon Green', adjustments: { ...defaultAdjustments, tint: -50, temp: -20, saturation: 130, contrast: 120 } },
      { id: 'desert', name: 'Desert Heat', adjustments: { ...defaultAdjustments, temp: 60, contrast: 130, exposure: 10, saturation: 90 } },
      { id: 'arctic', name: 'Arctic Ice', adjustments: { ...defaultAdjustments, temp: -60, brightness: 120, contrast: 110, saturation: 90 } },
      { id: 'urban', name: 'Urban Grit', adjustments: { ...defaultAdjustments, saturation: 60, contrast: 140, sharpness: 50, vignette: 30 } },
      { id: 'retro', name: 'Retro 80s', adjustments: { ...defaultAdjustments, tint: 40, temp: 20, saturation: 120, contrast: 110 } },
      { id: 'fade', name: 'Faded Black', adjustments: { ...defaultAdjustments, exposure: 30, contrast: 70, saturation: 80 } },
      { id: 'sharp', name: 'Ultra Sharp', adjustments: { ...defaultAdjustments, sharpness: 100, contrast: 120, saturation: 110 } },
    ];

    const previewUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=250&fit=crop";

    return (
      <div className="flex flex-col w-full h-full animate-fade-in">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-6 shrink-0">Filtros (20)</h2>
        
        <div className="shrink-0 mb-6">
          <SliderControl 
            label="Intensidade" min={0} max={100} value={filterIntensity} 
            onChange={setFilterIntensity} 
            onReset={() => setFilterIntensity(100)}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 gap-3 pb-8">
            {filters.map(filter => {
              const adj = filter.adjustments;
              const cssFilter = `brightness(${adj.brightness}%) contrast(${adj.contrast}%) saturate(${adj.saturation}%) hue-rotate(${adj.hue}deg) brightness(${100 + adj.exposure}%)`;
              
              const tempOverlay = adj.temp !== 0 ? (adj.temp > 0 ? `rgba(255, 140, 0, ${adj.temp / 200})` : `rgba(0, 130, 255, ${Math.abs(adj.temp) / 200})`) : 'transparent';
              const tintOverlay = adj.tint !== 0 ? (adj.tint > 0 ? `rgba(255, 0, 255, ${adj.tint / 200})` : `rgba(0, 255, 0, ${Math.abs(adj.tint) / 200})`) : 'transparent';
              
              return (
                <button
                  key={filter.id}
                  onClick={() => useEditorStore.getState().setAdjustments(filter.adjustments)}
                  className="aspect-[4/3] bg-zinc-900 border border-zinc-800 hover:border-[#ccff00] transition-all rounded-xl flex items-end p-3 relative overflow-hidden group"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ 
                      backgroundImage: `url('${previewUrl}')`,
                      filter: cssFilter
                    }} 
                  />
                  <div className="absolute inset-0 mix-blend-overlay pointer-events-none" style={{ backgroundColor: tempOverlay }} />
                  <div className="absolute inset-0 mix-blend-overlay pointer-events-none" style={{ backgroundColor: tintOverlay }} />
                  {adj.vignette > 0 && (
                    <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 ${adj.vignette}px rgba(0,0,0,1)` }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />
                  <span className="text-[11px] leading-tight font-bold relative z-10 text-zinc-200 group-hover:text-[#ccff00] transition-colors text-left">{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderElements = () => {
    const selectedText = textLayers.find(t => t.id === selectedTextId);
    
    return (
      <div className="flex flex-col w-full h-full animate-fade-in">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-6 shrink-0">Textos</h2>
        
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-4 pb-20">
          <button 
            onClick={() => {
              addText({
                id: Date.now().toString(),
                text: 'NOVO TEXTO',
                x: 50,
                y: 50,
                fontSize: 10,
                color: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 'bold',
                shadow: true
              });
            }}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex justify-center items-center gap-2 rounded-lg transition-colors border border-zinc-700"
          >
            <Type size={18} /> Adicionar Texto
          </button>

          {textLayers.length > 0 && (
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-2">
              <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2 font-semibold">Camadas de Texto</p>
              {textLayers.map(t => (
                <div 
                  key={t.id} 
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${selectedTextId === t.id ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}
                  onClick={() => setSelectedTextId(t.id)}
                >
                  <span className="truncate text-sm font-bold">{t.text}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeText(t.id); }} className="text-zinc-500 hover:text-red-500 transition-colors p-1"><Trash size={14}/></button>
                </div>
              ))}
            </div>
          )}

          {selectedText && (
            <div className="bg-zinc-900 rounded-xl p-4 border border-[#ccff00]/20 space-y-4">
               <div>
                 <label className="text-xs text-[#ccff00] font-bold uppercase block mb-2">Conteúdo</label>
                 <textarea 
                   value={selectedText.text}
                   onChange={e => updateText(selectedText.id, { text: e.target.value })}
                   className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white resize-none text-sm outline-none focus:border-[#ccff00]/50"
                   rows={2}
                 />
               </div>
               
               <SliderControl label="Tamanho da Fonte" min={1} max={50} value={selectedText.fontSize} onChange={v => updateText(selectedText.id, { fontSize: v })} />
               
               <div>
                  <label className="text-xs text-zinc-400 font-bold uppercase block mb-2">Cor do Texto</label>
                  <input type="color" value={selectedText.color} onChange={e => updateText(selectedText.id, { color: e.target.value })} className="w-full h-10 bg-zinc-950 rounded cursor-pointer border-0" />
               </div>

               <div className="pt-2 border-t border-zinc-800">
                 <p className="text-xs text-zinc-400 font-bold uppercase block mb-4 mt-2">Posição</p>
                 <div className="space-y-4">
                   <SliderControl label="Horizontal (X)" min={0} max={100} value={selectedText.x} onChange={v => updateText(selectedText.id, { x: v })} />
                   <SliderControl label="Vertical (Y)" min={0} max={100} value={selectedText.y} onChange={v => updateText(selectedText.id, { y: v })} />
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-[320px] h-full bg-zinc-950 border-l border-zinc-800/50 p-6 flex flex-col shrink-0 z-10 relative shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
      {activeTab === 'adjust' && renderAdjustments()}
      {activeTab === 'crop' && renderCrop()}
      {activeTab === 'filters' && renderFilters()}
      {activeTab === 'elements' && renderElements()}
    </aside>
  );
}
