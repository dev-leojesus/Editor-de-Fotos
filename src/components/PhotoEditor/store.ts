import { create } from 'zustand';
import { EditorState, defaultAdjustments } from './types';

export const useEditorStore = create<EditorState>((set) => ({
  image: null,
  adjustments: { ...defaultAdjustments },
  rotation: 0,
  crop: null,
  activeTab: 'adjust',
  filterIntensity: 100,

  setImage: (url) => set({ image: url }),
  
  updateAdjustment: (key, value) => set((state) => ({
    adjustments: {
      ...state.adjustments,
      [key]: value
    }
  })),

  setAdjustments: (newAdjustments) => set((state) => ({
    adjustments: {
      ...state.adjustments,
      ...newAdjustments
    },
    filterIntensity: 100
  })),

  setRotation: (deg) => set({ rotation: deg }),
  
  setCrop: (crop) => set({ crop }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  resetAdjustments: () => set({ adjustments: { ...defaultAdjustments }, rotation: 0, filterIntensity: 100 }),

  setFilterIntensity: (val) => set({ filterIntensity: val }),

  exportImage: async () => {
    // Canvas export implementation will be handled via an event or ref.
    const event = new CustomEvent('export-image');
    window.dispatchEvent(event);
  }
}));
