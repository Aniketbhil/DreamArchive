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
    set({
      progress: 100,
      finished: true,
    });
  },

  reset() {
    set({
      progress: 0,
      finished: false,
    });
  },
}));