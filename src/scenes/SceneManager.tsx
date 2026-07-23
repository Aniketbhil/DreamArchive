import Loader from "../components/loader/Loader";

import ArchiveScene from "./ArchiveScene";

import { SCENES } from "../constants/scenes";

import { useAppStore } from "../store/appStore";

export default function SceneManager() {
  const scene = useAppStore(
    (s) => s.currentScene
  );

  switch (scene) {
    case SCENES.LOADER:
      return <Loader />;

    case SCENES.ARCHIVE:
      return <ArchiveScene />;

    default:
      return null;
  }
}