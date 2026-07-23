import { useEffect } from "react";
import { useProgress } from "@react-three/drei";

import { SCENES } from "../../constants/scenes";
import { useAppStore } from "../../store/appStore";
import { useLoaderStore } from "../../store/loaderStore";

import LoaderOverlay from "./LoaderOverlay";

export default function Loader() {
  const { progress } = useProgress();

  const setScene = useAppStore(
    (state) => state.setScene
  );

  const loader = useLoaderStore();

  useEffect(() => {
    loader.setProgress(progress);

    if (progress >= 100 && !loader.finished) {
      const timer = setTimeout(() => {
        loader.finish();

        setTimeout(() => {
          setScene(SCENES.ARCHIVE);
        }, 1200);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (loader.finished) return null;

  return (
    <LoaderOverlay
      progress={loader.progress}
    />
  );
}