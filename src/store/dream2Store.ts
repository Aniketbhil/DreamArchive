import { create } from "zustand";

interface Dream2State {
  hasKey: boolean;
  message: string;
  crystalActivated: boolean;
  transitioning: boolean; // NEW: Tracks the second click
  collectKey: () => void;
  showMessage: (msg: string) => void;
  activateCrystal: () => void;
  startTransition: () => void; // NEW: Triggers the fade out
  reset: () => void;
}

export const useDream2Store = create<Dream2State>((set) => ({
  hasKey: false,
  message: "Objective: Find the key for go to the next dream",
  crystalActivated: false,
  transitioning: false,
  collectKey: () => set({ 
    hasKey: true, 
    message: "Key found! Now interact with the crystal." 
  }),
  showMessage: (msg) => set({ message: msg }),
  activateCrystal: () => set({ 
    crystalActivated: true,
    // Update the UI so they know to click it again!
    message: "Crystal awakened! Click it again to enter Dream 3." 
  }),
  startTransition: () => set({ transitioning: true }),
  reset: () => set({ 
    hasKey: false, 
    message: "Objective: Find the key for go to the next dream", 
    crystalActivated: false,
    transitioning: false
  }),
}));