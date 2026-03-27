'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore } from './store';
import { UploadCloud, X, ZoomIn, ZoomOut } from 'lucide-react';
import ReactCrop, { type PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; // Add this missing import for the UI to work

export default function CanvasView() {
  const { image, setImage, adjustments, rotation, activeTab, crop, setCrop, filterIntensity, cropAspectRatio, textLayers, selectedTextId } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleExport = () => {
      exportCanvasImage();
    };

    const handleApplyCrop = () => {
      if (!image || !crop || crop.width === 0 || crop.height === 0) return;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = image;
      img.onload = () => {
        const sourceX = (crop.x * img.width) / 100;
        const sourceY = (crop.y * img.height) / 100;
        const sourceW = (crop.width * img.width) / 100;
        const sourceH = (crop.height * img.height) / 100;
        canvas.width = sourceW;
        canvas.height = sourceH;
        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);
        setImage(canvas.toDataURL('image/png', 1.0));
        setCrop(null);
      };
    };

    window.addEventListener('export-image', handleExport);
    window.addEventListener('apply-crop', handleApplyCrop);
    return () => {
      window.removeEventListener('export-image', handleExport);
      window.removeEventListener('apply-crop', handleApplyCrop);
    };
  }, [image, adjustments, rotation, crop, filterIntensity]);

  useEffect(() => {
    if (cropAspectRatio && image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const imgAspect = img.width / img.height;
        let cropW = 100;
        let cropH = 100;
        
        if (imgAspect > cropAspectRatio) {
          cropH = 100;
          cropW = (cropAspectRatio / imgAspect) * 100;
        } else {
          cropW = 100;
          cropH = (imgAspect / cropAspectRatio) * 100;
        }
        
        // Aplica uma pequena margem pra não colar nas bordas
        const margin = 0.9;
        cropW *= margin;
        cropH *= margin;

        const x = (100 - cropW) / 2;
        const y = (100 - cropH) / 2;

        setCrop({
          unit: '%',
          x,
          y,
          width: cropW,
          height: cropH,
        });
      };
    } else if (cropAspectRatio === undefined) {
      setCrop(null);
    }
  }, [cropAspectRatio, image, setCrop]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setZoom(1);
        setCrop(null); // Reset crop on new picture
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const interpolate = (val: number, def: number) => {
    return def + (val - def) * (filterIntensity / 100);
  };

  const adj = {
    brightness: interpolate(adjustments.brightness, 100),
    contrast: interpolate(adjustments.contrast, 100),
    saturation: interpolate(adjustments.saturation, 100),
    hue: interpolate(adjustments.hue, 0),
    exposure: interpolate(adjustments.exposure, 0),
    temp: interpolate(adjustments.temp, 0),
    tint: interpolate(adjustments.tint, 0),
    vignette: interpolate(adjustments.vignette, 0),
    sharpness: interpolate(adjustments.sharpness, 0),
  };

  // Build hybrid CSS filters for realtime preview
  const filterString = `
    brightness(${adj.brightness}%)
    contrast(${adj.contrast}%)
    saturate(${adj.saturation}%)
    hue-rotate(${adj.hue}deg)
    brightness(${100 + adj.exposure}%)
    ${adj.sharpness > 0 ? 'url(#sharpness-filter)' : ''}
  `.trim();

  // Temperature overlay
  const tempColor = adj.temp > 0 
    ? `rgba(255, 140, 0, ${adj.temp / 200})` 
    : `rgba(0, 130, 255, ${Math.abs(adj.temp) / 200})`;

  // Tint overlay
  const tintColor = adj.tint > 0
    ? `rgba(255, 0, 255, ${adj.tint / 200})`
    : `rgba(0, 255, 0, ${Math.abs(adj.tint) / 200})`;

  const exportCanvasImage = () => {
    if (!image) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      
      let sourceX = 0;
      let sourceY = 0;
      let sourceW = img.width;
      let sourceH = img.height;

      // Ensure the crop box has actual area (not a tiny click artifact)
      if (crop && crop.width > 2 && crop.height > 2) {
        sourceX = (crop.x * img.width) / 100;
        sourceY = (crop.y * img.height) / 100;
        sourceW = (crop.width * img.width) / 100;
        sourceH = (crop.height * img.height) / 100;
      }

      // Handle rotation and basic transform for canvas sizing
      const isRotatedNode = Math.abs(rotation) % 180 === 90;
      canvas.width = isRotatedNode ? sourceH : sourceW;
      canvas.height = isRotatedNode ? sourceW : sourceH;

      // Apply CSS equivalent filters natively to Canvas
      ctx.filter = filterString;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      ctx.drawImage(
        img, 
        sourceX, sourceY, sourceW, sourceH,
        -sourceW / 2, -sourceH / 2, sourceW, sourceH
      );

      // Overlays
      if (adj.temp !== 0) {
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = tempColor;
        ctx.fillRect(-sourceW / 2, -sourceH / 2, sourceW, sourceH);
      }
      if (adj.tint !== 0) {
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = tintColor;
        ctx.fillRect(-sourceW / 2, -sourceH / 2, sourceW, sourceH);
      }

      // Vignette approximation on canvas
      if (adj.vignette > 0) {
        ctx.globalCompositeOperation = 'multiply';
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(sourceW, sourceH) / 1.5);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${adj.vignette / 100})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(-sourceW / 2, -sourceH / 2, sourceW, sourceH);
      }

      // Draw text layers
      if (textLayers && textLayers.length > 0) {
         ctx.globalCompositeOperation = 'source-over';
         textLayers.forEach(t => {
           // position relative to sourceW, sourceH (translated coords: center is 0,0)
           const tx = (t.x / 100) * sourceW - (sourceW / 2);
           const ty = (t.y / 100) * sourceH - (sourceH / 2);
           
           ctx.font = `${t.fontWeight} ${(t.fontSize / 100) * sourceW}px ${t.fontFamily}`;
           ctx.fillStyle = t.color;
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           
           if (t.shadow) {
             ctx.shadowColor = 'rgba(0,0,0,0.8)';
             ctx.shadowBlur = 10 * (sourceW / 800);
             ctx.shadowOffsetX = 0;
             ctx.shadowOffsetY = 2 * (sourceW / 800);
           } else {
             ctx.shadowColor = 'transparent';
           }
           
           // Handle multiline text
           const lines = t.text.split('\n');
           const lineHeight = ((t.fontSize / 100) * sourceW) * 1.2;
           const startY = ty - ((lines.length - 1) * lineHeight) / 2;
           
           lines.forEach((line, index) => {
             ctx.fillText(line, tx, startY + (index * lineHeight));
           });
         });
      }

      const exportedData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `edited-photo-${Date.now()}.png`;
      link.href = exportedData;
      link.click();
    };
  };

  const ImgElement = (
    <div className="relative inline-block max-w-full max-h-[85vh]" style={{ containerType: 'inline-size' } as React.CSSProperties}>
      <img 
        src={image!} 
        alt="Workspace" 
        className="max-w-full max-h-[85vh] object-contain transition-all duration-75 block select-none"
        style={{ filter: filterString }}
        draggable={false}
      />
      {textLayers && textLayers.map(t => (
        <div 
          key={t.id}
          className={`absolute whitespace-pre text-center select-none pointer-events-none transition-all duration-75 ${selectedTextId === t.id ? 'border border-[#ccff00] backdrop-blur-[2px]' : ''}`}
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            transform: 'translate(-50%, -50%)',
            color: t.color,
            fontSize: `${t.fontSize}cqw`,
            fontFamily: t.fontFamily,
            fontWeight: t.fontWeight,
            textShadow: t.shadow ? '0 2px 10px rgba(0,0,0,0.8)' : 'none',
            lineHeight: '1.2'
          }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );

  return (
    <main className="flex-1 bg-[#09090b] relative flex items-center justify-center overflow-hidden custom-grid-bg">
      <svg className="hidden">
        <defs>
          <filter id="sharpness-filter">
            <feConvolveMatrix 
              order="3 3" 
              preserveAlpha="true" 
              kernelMatrix={`
                0 -${adj.sharpness / 50} 0 
                -${adj.sharpness / 50} ${1 + 4 * (adj.sharpness / 50)} -${adj.sharpness / 50} 
                0 -${adj.sharpness / 50} 0
              `}
            />
          </filter>
        </defs>
      </svg>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        .ReactCrop__crop-selection {
          border: 2px solid #ccff00;
        }
      `}} />

      {!image ? (
        <div 
          className={`w-full max-w-lg aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging ? 'border-[#ccff00] bg-[#ccff00]/10' : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-600'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl text-[#ccff00]">
            <UploadCloud size={28} />
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-2 text-zinc-100">Drop your image here</h3>
          <p className="text-zinc-500 text-sm mb-6">High resolution PNG, JPG, or WebP</p>
          
          <label className="px-6 py-2.5 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest text-[10px] rounded-lg cursor-pointer hover:bg-white transition-colors">
            Browse Files
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center p-8 group overflow-hidden">
          {/* Zoom Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md rounded-lg p-1 border border-zinc-800/50 z-50">
             <button type="button" onClick={(e) => { e.preventDefault(); setZoom(z => Math.max(0.1, z - 0.2)); }} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"><ZoomOut size={16}/></button>
             <span className="text-xs font-mono text-zinc-300 w-12 text-center select-none">{Math.round(zoom * 100)}%</span>
             <button type="button" onClick={(e) => { e.preventDefault(); setZoom(z => Math.min(3, z + 0.2)); }} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"><ZoomIn size={16}/></button>
          </div>

          <button type="button" onClick={() => { setImage(null); setCrop(null); }} className="absolute top-6 left-6 p-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white z-50 transition-colors cursor-pointer">
            <X size={16} />
          </button>

          {/* Render Area */}
          <div 
            className="relative shadow-2xl max-w-full max-h-full transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
            onWheel={(e) => {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.1 : -0.1;
                setZoom(z => Math.max(0.1, Math.min(3, z + delta)));
              }
            }}
          >
            {activeTab === 'crop' ? (
              <ReactCrop
                crop={crop || undefined}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={cropAspectRatio}
              >
                {ImgElement}
              </ReactCrop>
            ) : (
              ImgElement
            )}
            
            {/* Real-time Overlays for colors */}
            <div className={`absolute inset-0 mix-blend-overlay pointer-events-none transition-colors duration-75 ${activeTab === 'crop' ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: tempColor }} />
            <div className={`absolute inset-0 mix-blend-overlay pointer-events-none transition-colors duration-75 ${activeTab === 'crop' ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: tintColor }} />
            {/* Vignette Overlay */}
            <div className={`absolute inset-0 pointer-events-none rounded-sm transition-all duration-75 ${activeTab === 'crop' ? 'opacity-0' : 'opacity-100'}`} style={{ boxShadow: `inset 0 0 ${adj.vignette * 3}px rgba(0,0,0,1)` }} />
          </div>
        </div>
      )}
    </main>
  );
}
