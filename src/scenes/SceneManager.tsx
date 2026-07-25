import Loader from "../components/loader/Loader";
import ArchiveScene from "./ArchiveScene";
import Dream1Scene from "./Dream1Scene";
import Dream2Scene from "./Dream2Scene";

import { SCENES } from "../constants/scenes";
import { useAppStore } from "../store/appStore";

export default function SceneManager() {
  const scene = useAppStore((s) => s.currentScene);

  switch (scene) {
    case SCENES.LOADER:
      return <Loader />;
    case SCENES.ARCHIVE:
      return <ArchiveScene />;
    case SCENES.DREAM1:
      return <Dream1Scene />;
    case SCENES.DREAM2:
      return <Dream2Scene />;
    default:
      return null;
  }
}
