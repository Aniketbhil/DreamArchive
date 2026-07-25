import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

import Player from "../components/player/Player";
import DustParticles from "../components/effects/DustParticles";
import PostProcessing from "../components/effects/PostProcessing";
import FadeOverlay from "../components/transitions/FadeOverlay";
import ArchiveWorld, {
  type ArchiveWorldData,
} from "../world/archive/ArchiveWorld";

export default function ArchiveScene() {
  const [world, setWorld] = useState<ArchiveWorldData | null>(null);

  // FIX: Suppress internal R3F deprecation warnings to keep the console clean
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("THREE.Clock") ||
          args[0].includes("PCFSoftShadowMap"))
      )
        return;
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  const spawn = useMemo(() => {
    if (!world) return new THREE.Vector3();
    const size = new THREE.Vector3();
    world.bounds.getSize(size);
    return new THREE.Vector3(
      world.crystal.x,
      30,
      world.crystal.z - size.z * 0.8,
    );
  }, [world]);

  const target = useMemo(() => {
    if (!world) return new THREE.Vector3();
    return new THREE.Vector3(world.crystal.x, 30, world.crystal.z);
  }, [world]);

  return (
    <>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }} // FIX: Updated to the correct shadow map[cite: 2]
        dpr={[1, 1.5]}
        camera={{ fov: 45, near: 0.1, far: 3000 }}
      >
        <color attach="background" args={["#040404"]} />

        <Suspense fallback={null}>
          <ArchiveWorld onReady={setWorld} />
          <DustParticles />
          {world && <Player spawn={spawn} target={target} />}
          <PostProcessing />
        </Suspense>
      </Canvas>

      <FadeOverlay />
    </>
  );
}
