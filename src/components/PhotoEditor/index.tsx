'use client';

import React, from 'react';
import Sidebar from './Sidebar';
import CanvasView from './CanvasView';
import PropertiesPanel from './PropertiesPanel';

export default function PhotoEditor() {
  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans antialiased selection:bg-[#ccff00] selection:text-zinc-950">
      <Sidebar />
      <CanvasView />
      <PropertiesPanel />
    </div>
  );
}
