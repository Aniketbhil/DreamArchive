import { create } from "zustand";

interface CrystalStore {
  activated: boolean;
  activationProgress: number;

  activate: () => void;
  setActivationProgress: (progress: number) => void;
  reset: () => void;
}

export const useCrystalStore = create<CrystalStore>((set) => ({
  activated: false,

  activationProgress: 0,

  activate: () =>
    set({
      activated: true,
    }),

  setActivationProgress: (progress) =>
    set({
      activationProgress: Math.min(
        Math.max(progress, 0),
        1
      ),
    }),

  reset: () =>
    set({
      activated: false,
      activationProgress: 0,
    }),
}));