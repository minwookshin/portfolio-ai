import { create } from 'zustand';

interface ThemeState {
  activeThemeColor: string | null;
  setActiveThemeColor: (color: string | null) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  activeThemeColor: null,
  setActiveThemeColor: (color) => set({ activeThemeColor: color }),
}));
