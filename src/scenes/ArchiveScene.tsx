import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";

import Player from "../components/player/Player";

import DustParticles from "../components/effects/DustParticles";
import PostProcessing from "../components/effects/PostProcessing";

import FadeOverlay from "../components/transitions/FadeOverlay";

import ArchiveWorld, {
  type ArchiveWorldData,
} from "../world/archive/ArchiveWorld";

export default function ArchiveScene() {
  const [world, setWorld] =
    useState<ArchiveWorldData | null>(null);

  const spawn = useMemo(() => {
    if (!world) return new THREE.Vector3();

    const size = new THREE.Vector3();
    world.bounds.getSize(size);

    return new THREE.Vector3(
      world.crystal.x,
      30,
      world.crystal.z - size.z * 0.8
    );
  }, [world]);

  const target = useMemo(() => {
    if (!world) return new THREE.Vector3();

    return new THREE.Vector3(
      world.crystal.x,
      30,
      world.crystal.z
    );
  }, [world]);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]} // Lowered max DPR from 2 to 1.5 to fix lag
        camera={{
          fov: 45,
          near: 0.1,
          far: 3000,
        }}
      >
        <color
          attach="background"
          args={["#040404"]}
        />

        <Suspense fallback={null}>
          <ArchiveWorld
            onReady={setWorld}
          />

          <DustParticles />

          {world && (
            <Player
              spawn={spawn}
              target={target}
            />
          )}

          <PostProcessing />
        </Suspense>
      </Canvas>

      <FadeOverlay />
    </>
  );
}