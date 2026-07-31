import { create } from "zustand";

interface LoaderStore {
  progress: number;
  finished: boolean;

  setProgress: (progress: number) => void;
  finish: () => void;
  reset: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  progress: 0,
  finished: false,

  setProgress(progress) {
    set({ progress });
  },

  finish() {
    set({ progress: 100 });
    
    // The sweet spot: 1.5 seconds. 
    // Long enough to hide the black screen, short enough to feel fast!
    setTimeout(() => {
      set({ finished: true });
    }, 1500);
  },

  reset() {
    set({
      progress: 0,
      finished: false,
    });
  },
}));