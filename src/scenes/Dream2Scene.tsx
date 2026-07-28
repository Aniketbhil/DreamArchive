import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

import FadeOverlay from "../components/transitions/FadeOverlay";
import Dream2Models from "../world/dream2/Dream2Models";
import PostProcessing from "../components/effects/PostProcessing";
import FirstPersonCamera from "../components/player/FirstPersonCamera";

export default function Dream2Scene() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // FIX 1: Lowered Y to 1.5 (human height) and moved Z closer to the bridge (12)
  const spawn = useMemo(() => new THREE.Vector3(0, 1.5, 12), []);
  const target = useMemo(() => new THREE.Vector3(0, 1.5, 0), []);

  const constrainDream2 = (pos: THREE.Vector3) => {
    // FIX 2: Tighter bounds for the grass areas
    const farSouthZ = 14;         // Back wall near spawn Point A
    const riverSouthBankZ = 2;    // Where the bottom grass ends
    const riverNorthBankZ = -2;   // Where the top grass starts
    const farNorthZ = -14;        // Back wall near the tree

    // FIX 3: Tighter horizontal limits
    const wideLeftX = -12;        // Left edge of the grass
    const wideRightX = 12;        // Right edge of the grass
    
    // FIX 4: Strict squeeze for the wooden bridge
    const bridgeLeftX = -1.5;     
    const bridgeRightX = 1.5;     

    pos.z = THREE.MathUtils.clamp(pos.z, farNorthZ, farSouthZ);

    if (pos.z < riverSouthBankZ && pos.z > riverNorthBankZ) {
      // Lock onto the narrow bridge
      pos.x = THREE.MathUtils.clamp(pos.x, bridgeLeftX, bridgeRightX);
    } else {
      // Open up for the grass
      pos.x = THREE.MathUtils.clamp(pos.x, wideLeftX, wideRightX);
    }
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        fontSize: '20px',
        letterSpacing: '1px',
        zIndex: 10,
        pointerEvents: 'none',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
        textAlign: 'center'
      }}>
        Objective: Find the key for go to the next dream
      </div>

      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 45, near: 0.1, far: 3000 }}>
        <color attach="background" args={["#0a0f14"]} />

        <ambientLight intensity={0.5} />
        <hemisphereLight intensity={0.4} color="#fbcfe8" groundColor="#0f172a" />
        <directionalLight castShadow intensity={2} position={[50, 100, 50]} color="#fff1f2" />

        <Suspense fallback={null}>
          <Dream2Models />

          <FirstPersonCamera
            spawn={spawn}
            target={target}
            started={started}
            walkSpeed={12} 
            constrainBounds={constrainDream2}
          />

          <PostProcessing />
        </Suspense>
      </Canvas>

      <FadeOverlay />
    </>
  );
}