import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import FadeOverlay from "../components/transitions/FadeOverlay";
import Dream1Models from "../world/dream1/Dream1Models";
import PostProcessing from "../components/effects/PostProcessing";

export default function Dream1Scene() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        // We set the camera a bit further back initially so you can see the whole island
        camera={{ position: [0, 20, 60], fov: 45, near: 0.1, far: 3000 }}
      >
        <color attach="background" args={["#020204"]} />

        {/* Basic Dream 1 Lighting Setup */}
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
          <PostProcessing />
        </Suspense>
      </Canvas>

      <FadeOverlay />
    </>
  );
}
