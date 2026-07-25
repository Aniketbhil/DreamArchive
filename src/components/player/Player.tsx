import { useEffect, useState } from "react";
import * as THREE from "three";

import { useFadeStore } from "../../store/fadeStore";
import { useCrystalStore } from "../../store/crystalStore";
import { useAppStore } from "../../store/appStore";
import { SCENES } from "../../constants/scenes";

import FirstPersonCamera from "./FirstPersonCamera";

interface Props {
  spawn: THREE.Vector3;
  target: THREE.Vector3;
  constrainBounds?: (pos: THREE.Vector3) => void;
}

export default function Player({ spawn, target, constrainBounds }: Props) {
  const [started, setStarted] = useState(false);

  // We are now listening for the crystal's global state
  const activated = useCrystalStore((s) => s.activated);
  const resetCrystal = useCrystalStore((s) => s.reset);

  const fadeIn = useFadeStore((s) => s.fadeIn);
  const fadeOut = useFadeStore((s) => s.fadeOut);
  const setScene = useAppStore((s) => s.setScene);

  // 1. Initial spawn delay
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // 2. The Cinematic Ending Sequence Trigger
  useEffect(() => {
    if (activated) {
      // Wait 1.8 seconds for the crystal's glowing animation to build up
      const timer1 = setTimeout(() => {
        fadeIn(); // Fade to black

        // Wait another 1.8 seconds for the screen to go completely dark
        const timer2 = setTimeout(() => {
          setScene(SCENES.DREAM1);
          resetCrystal();
          fadeOut(); // Bring the screen back up
        }, 1800);

        return () => clearTimeout(timer2);
      }, 1800);

      return () => clearTimeout(timer1);
    }
  }, [activated, fadeIn, fadeOut, resetCrystal, setScene]);

  return (
    <FirstPersonCamera
      spawn={spawn}
      target={target}
      started={started}
      constrainBounds={constrainBounds}
    />
  );
}
