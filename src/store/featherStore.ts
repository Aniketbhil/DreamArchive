import { create } from "zustand";

interface FeatherState {
  collectedCount: number;
  totalFeathers: number;
  collectFeather: () => void;
  setTotalFeathers: (total: number) => void;
  reset: () => void;
}

export const useFeatherStore = create<FeatherState>((set) => ({
  collectedCount: 0,
  // 1. Hardcode the exact number of feathers required to unlock the portal
  totalFeathers: 7,
  collectFeather: () =>
    set((state) => ({ collectedCount: state.collectedCount + 1 })),
  setTotalFeathers: (total) => set({ totalFeathers: total }),
  reset: () => set({ collectedCount: 0 }),
}));
