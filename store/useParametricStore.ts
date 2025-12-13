import { create } from 'zustand';

export interface ParametricState {
  creativity: number;
  logic: number;
  business: number;
  setCreativity: (value: number) => void;
  setLogic: (value: number) => void;
  setBusiness: (value: number) => void;
  setMode: (mode: 'investor' | 'dev' | 'design') => void;
  reset: () => void;
}

export const useParametricStore = create<ParametricState>((set) => ({
  creativity: 33,
  logic: 33,
  business: 33,

  setCreativity: (value: number) => set({ creativity: value }),
  setLogic: (value: number) => set({ logic: value }),
  setBusiness: (value: number) => set({ business: value }),

  setMode: (mode: 'investor' | 'dev' | 'design') => {
    switch (mode) {
      case 'investor':
        set({ creativity: 0, logic: 0, business: 100 });
        break;
      case 'dev':
        set({ creativity: 0, logic: 100, business: 0 });
        break;
      case 'design':
        set({ creativity: 100, logic: 0, business: 0 });
        break;
    }
  },

  reset: () => set({ creativity: 33, logic: 33, business: 33 }),
}));

// Helper hook to get dominant mode
export const useDominantMode = () => {
  const { creativity, logic, business } = useParametricStore();

  if (creativity > logic && creativity > business) return 'creativity';
  if (logic > creativity && logic > business) return 'logic';
  if (business > creativity && business > logic) return 'business';
  return 'balanced';
};
