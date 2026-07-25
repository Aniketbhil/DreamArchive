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
}

export default function Player({
  spawn,
  target,
}: Props) {
  const [started, setStarted] = useState(false);

  const activateCrystal = useCrystalStore((s) => s.activate);
  const resetCrystal = useCrystalStore((s) => s.reset);
  
  const fadeIn = useFadeStore((s) => s.fadeIn);
  const fadeOut = useFadeStore((s) => s.fadeOut);
  
  const setScene = useAppStore((s) => s.setScene);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <FirstPersonCamera
      spawn={spawn}
      target={target}
      started={started}
      onReachedCrystal={() => {
        // 1. Crystal starts glowing and floating
        activateCrystal();

        setTimeout(() => {
          // 2. Screen starts fading to black
          fadeIn();
          
          // 3. Wait 1.8 seconds for the fade animation to completely finish
          setTimeout(() => {
            setScene(SCENES.DREAM1); // Swap to the new scene
            resetCrystal();          // Reset crystal state for next time
            fadeOut();               // Fade the screen back to transparent
          }, 1800); 

        }, 1800); // Wait 1.8s after reaching crystal before fading
      }}
    />
  );
}