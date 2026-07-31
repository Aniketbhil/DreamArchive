import { create } from "zustand";

import {
  SCENES,
  type Scene,
} from "../constants/scenes";

interface AppStore {
  currentScene: Scene;

  setScene: (scene: Scene) => void;
}

export const useAppStore =
  create<AppStore>((set) => ({
    currentScene: SCENES.LOADER,

    setScene(scene) {
      set({
        currentScene: scene,
      });
    },
  }));