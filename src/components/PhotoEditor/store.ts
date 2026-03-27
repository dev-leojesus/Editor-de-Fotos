import { create } from 'zustand';
import { EditorState, defaultAdjustments } from './types';

export const useEditorStore = create<EditorState>((set) => ({
  image: null,
  adjustments: { ...defaultAdjustments },
  rotation: 0,
  crop: null,
  cropAspectRatio: undefined,
  activeTab: 'adjust',
  filterIntensity: 100,
  textLayers: [],
  selectedTextId: null,

  setImage: (url) => set({ image: url, textLayers: [], selectedTextId: null, crop: null }),
  
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

  setCropAspect: (aspect) => set({ cropAspectRatio: aspect }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  resetAdjustments: () => set({ adjustments: { ...defaultAdjustments }, rotation: 0, filterIntensity: 100 }),

  setFilterIntensity: (val) => set({ filterIntensity: val }),
  
  addText: (text) => set((state) => ({ textLayers: [...state.textLayers, text], selectedTextId: text.id })),
  updateText: (id, updates) => set((state) => ({
    textLayers: state.textLayers.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  removeText: (id) => set((state) => ({
    textLayers: state.textLayers.filter(t => t.id !== id),
    selectedTextId: state.selectedTextId === id ? null : state.selectedTextId
  })),
  setSelectedTextId: (id) => set({ selectedTextId: id }),

  exportImage: async () => {
    // Canvas export implementation will be handled via an event or ref.
    const event = new CustomEvent('export-image');
    window.dispatchEvent(event);
  }
}));
