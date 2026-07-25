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
    const margin = Math.min(size.x, size.z) * 0.08;

    const edgeX = THREE.MathUtils.clamp(
      world.crystal.x,
      world.bounds.min.x + margin,
      world.bounds.max.x - margin,
    );
    const edgeZ = world.bounds.min.z + margin;

    return new THREE.Vector3(edgeX, 30, edgeZ);
  }, [world]);

  const target = useMemo(() => {
    if (!world) return new THREE.Vector3();
    return new THREE.Vector3(world.crystal.x, 30, world.crystal.z);
  }, [world]);

  const constrainArchive = (pos: THREE.Vector3) => {
    if (!world) return;

    const margin = 1.5;
    pos.x = THREE.MathUtils.clamp(
      pos.x,
      world.bounds.min.x + margin,
      world.bounds.max.x - margin,
    );
    pos.z = THREE.MathUtils.clamp(
      pos.z,
      world.bounds.min.z + margin,
      world.bounds.max.z - margin,
    );
  };

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
          {world && (
            <Player
              spawn={spawn}
              target={target}
              constrainBounds={constrainArchive}
            />
          )}
          <PostProcessing />
        </Suspense>
      </Canvas>

      <FadeOverlay />
    </>
  );
}
