import { create } from "zustand";

interface FadeStore {
  visible: boolean;

  fadeIn: () => void;

  fadeOut: () => void;
}

export const useFadeStore = create<FadeStore>((set) => ({
  visible: false,

  fadeIn: () =>
    set({
      visible: true,
    }),

  fadeOut: () =>
    set({
      visible: false,
    }),
}));