import { type PercentCrop } from 'react-image-crop';

export interface ImageAdjustments {
  brightness: number; // 0 to 200, default 100
  contrast: number; // 0 to 200, default 100
  saturation: number; // 0 to 200, default 100
  hue: number; // -180 to +180, default 0
  exposure: number; // -100 to +100, default 0
  temp: number; // -100 to +100, default 0 (blue to amber)
  tint: number; // -100 to +100, default 0 (green to magenta)
  vignette: number; // 0 to 100, default 0
  sharpness: number; // 0 to 100, default 0
}

export interface PresetFilter {
  id: string;
  name: string;
  adjustments: Partial<ImageAdjustments>;
}

export type EditorTab = 'adjust' | 'crop' | 'filters' | 'elements';

export interface EditorState {
  image: string | null;
  adjustments: ImageAdjustments;
  rotation: number;
  crop: PercentCrop | null;
  cropAspectRatio: number | undefined;
  activeTab: EditorTab;
  filterIntensity: number; // 0 to 100, default 100
  
  // Actions
  setImage: (url: string | null) => void;
  updateAdjustment: (key: keyof ImageAdjustments, value: number) => void;
  setAdjustments: (adjustments: Partial<ImageAdjustments>) => void;
  setRotation: (deg: number) => void;
  setActiveTab: (tab: EditorTab) => void;
  setCrop: (crop: PercentCrop | null) => void;
  setCropAspect: (aspect: number | undefined) => void;
  resetAdjustments: () => void;
  setFilterIntensity: (val: number) => void;
  exportImage: () => Promise<void>;
}

export const defaultAdjustments: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  exposure: 0,
  temp: 0,
  tint: 0,
  vignette: 0,
  sharpness: 0,
};
