import React from 'react';
import { SlidersHorizontal, Crop, Wand2, Type, Download } from 'lucide-react';
import { useEditorStore } from './store';
import { EditorTab } from './types';

export default function Sidebar() {
  const { activeTab, setActiveTab, image, exportImage } = useEditorStore();

  const tabs = [
    { id: 'adjust' as EditorTab, icon: SlidersHorizontal, label: 'Adjust' },
    { id: 'crop' as EditorTab, icon: Crop, label: 'Crop' },
    { id: 'filters' as EditorTab, icon: Wand2, label: 'Filters' },
    { id: 'elements' as EditorTab, icon: Type, label: 'Elements' },
  ];

  return (
    <aside className="w-20 md:w-24 h-full bg-zinc-950 border-r border-zinc-800/50 flex flex-col items-center py-6 shrink-0 z-10">
      <div className="mb-10 text-[#ccff00] font-bold text-xl tracking-tighter cursor-default select-none">
        FX
      </div>
      
      <nav className="flex-1 w-full gap-2 flex flex-col items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all duration-300 ease-spring ${
                isActive 
                  ? 'bg-zinc-800/50 text-[#ccff00]' 
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30'
              }`}
            >
              <Icon size={20} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                {tab.label}
              </span>
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ccff00] rounded-r-full shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto w-full px-2">
        <button
          onClick={exportImage}
          disabled={!image}
          className={`flex flex-col items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300 
            ${!image 
              ? 'opacity-30 cursor-not-allowed text-zinc-500' 
              : 'bg-[#ccff00] text-zinc-950 hover:bg-[#b3ff00] shadow-[0_4px_20px_rgba(204,255,0,0.15)] hover:shadow-[0_4px_25px_rgba(204,255,0,0.25)] hover:-translate-y-0.5'
            }`}
        >
          <Download size={20} className="mb-1" strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Export</span>
        </button>
      </div>
    </aside>
  );
}
