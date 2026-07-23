import { create } from "zustand";

import {
  SCENES,
  type SceneName,
} from "../constants/scenes";

interface AppStore {
  currentScene: SceneName;

  setScene: (scene: SceneName) => void;
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