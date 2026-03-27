import { create } from 'zustand';
import { EditorState, defaultAdjustments } from './types';

export const useEditorStore = create<EditorState>((set) => ({
  image: null,
  adjustments: { ...defaultAdjustments },
  rotation: 0,
  crop: null,
  activeTab: 'adjust',

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
    }
  })),

  setRotation: (deg) => set({ rotation: deg }),
  
  setCrop: (crop) => set({ crop }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  resetAdjustments: () => set({ adjustments: { ...defaultAdjustments }, rotation: 0 }),

  exportImage: async () => {
    // Canvas export implementation will be handled via an event or ref.
    const event = new CustomEvent('export-image');
    window.dispatchEvent(event);
  }
}));
