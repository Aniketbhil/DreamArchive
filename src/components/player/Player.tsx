import { useEffect, useState } from "react";
import * as THREE from "three";

import { useFadeStore } from "../../store/fadeStore";
import { useCrystalStore } from "../../store/crystalStore";

import FirstPersonCamera from "./FirstPersonCamera";

interface Props {
  spawn: THREE.Vector3;
  target: THREE.Vector3;
}

export default function Player({
  spawn,
  target,
}: Props) {
  const [started, setStarted] =
    useState(false);

  const activateCrystal =
    useCrystalStore(
      (s) => s.activate
    );

  const fadeIn =
    useFadeStore(
      (s) => s.fadeIn
    );

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
        activateCrystal();

        setTimeout(() => {
          fadeIn();
        }, 1800);
      }}
    />
  );
}