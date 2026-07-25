import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";

import FadeOverlay from "../components/transitions/FadeOverlay";
import Dream1Models from "../world/dream1/Dream1Models";
import PostProcessing from "../components/effects/PostProcessing";
import FirstPersonCamera from "../components/player/FirstPersonCamera";

export default function Dream1Scene() {
  const [started, setStarted] = useState(false);

  // Wait 800ms for the black screen to start fading before allowing movement
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Adjust these coordinates to place the player perfectly on your island
  const spawn = new THREE.Vector3(0, 5, 20);
  const target = new THREE.Vector3(0, 5, 0); // Look towards the center

  return (
    <>
      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 45, near: 0.1, far: 3000 }}>
        <color attach="background" args={["#020204"]} />

        <ambientLight intensity={0.4} />
        <hemisphereLight
          intensity={0.6}
          color="#a68bfa"
          groundColor="#0f172a"
        />
        <directionalLight
          castShadow
          intensity={3.5}
          position={[100, 200, 50]}
          color="#e0e7ff"
        />

        <Suspense fallback={null}>
          <Dream1Models />

          <FirstPersonCamera spawn={spawn} target={target} started={started} />

          <PostProcessing />
        </Suspense>
      </Canvas>

      <FadeOverlay />
    </>
  );
}
