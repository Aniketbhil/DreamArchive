import { create } from "zustand";

interface Dream2State {
  hasKey: boolean;
  message: string;
  crystalActivated: boolean;
  collectKey: () => void;
  showMessage: (msg: string) => void;
  activateCrystal: () => void;
  reset: () => void;
}

export const useDream2Store = create<Dream2State>((set) => ({
  hasKey: false,
  message: "Objective: Find the key for go to the next dream",
  crystalActivated: false,
  collectKey: () => set({ 
    hasKey: true, 
    message: "Key found! Now interact with the crystal." 
  }),
  showMessage: (msg) => set({ message: msg }),
  activateCrystal: () => set({ crystalActivated: true }),
  reset: () => set({ 
    hasKey: false, 
    message: "Objective: Find the key for go to the next dream", 
    crystalActivated: false 
  }),
}));