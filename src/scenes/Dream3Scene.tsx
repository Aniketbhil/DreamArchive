import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

import FadeOverlay from "../components/transitions/FadeOverlay";
import Dream3Models from "../world/dream3/Dream3Models";
import PostProcessing from "../components/effects/PostProcessing";
import FirstPersonCamera from "../components/player/FirstPersonCamera";

export default function Dream3Scene() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // FIX: Moved spawn much closer (Z changed from 30 down to 8)
  const spawn = useMemo(() => new THREE.Vector3(0, 1.5, 8), []);
  const target = useMemo(() => new THREE.Vector3(0, 1.5, 0), []);

  const constrainDream3 = (pos: THREE.Vector3) => {
    // BOUNDARIES TEMPORARILY DISABLED FOR TESTING
    // pos.x = THREE.MathUtils.clamp(pos.x, -3, 3);
     pos.z = THREE.MathUtils.clamp(pos.z, -50, 3);
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#a78bfa',
        fontFamily: 'sans-serif',
        fontSize: '20px',
        letterSpacing: '1px',
        zIndex: 10,
        pointerEvents: 'none',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
        textAlign: 'center'
      }}>
        Objective: Align the mirrors to unlock the crystal
      </div>

      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 45, near: 0.1, far: 5000 }}>
        <color attach="background" args={["#02040a"]} />

        <ambientLight intensity={0.2} />
        <hemisphereLight intensity={0.5} color="#c4b5fd" groundColor="#000000" />
        <directionalLight castShadow intensity={2} position={[0, 50, 0]} color="#e0e7ff" />
        <pointLight position={[0, 2, 0]} intensity={10} color="#3b82f6" distance={50} />

        <Suspense fallback={null}>
          <Dream3Models />

          <FirstPersonCamera
            spawn={spawn}
            target={target}
            started={started}
            walkSpeed={14} 
            constrainBounds={constrainDream3}
          />

          <PostProcessing />
        </Suspense>
      </Canvas>

      <FadeOverlay />
    </>
  );
}