import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

import FadeOverlay from "../components/transitions/FadeOverlay";
import Dream2Models from "../world/dream2/Dream2Models";
import PostProcessing from "../components/effects/PostProcessing";
import FirstPersonCamera from "../components/player/FirstPersonCamera";

import { useDream2Store } from "../store/dream2Store";
import { useFadeStore } from "../store/fadeStore";
import { useAppStore } from "../store/appStore";
import { SCENES } from "../constants/scenes";

export default function Dream2Scene() {
  const [started, setStarted] = useState(false);
  
  const uiMessage = useDream2Store((s) => s.message);
  
  // FIX: Watch the new transitioning state instead of crystalActivated
  const transitioning = useDream2Store((s) => s.transitioning);
  const resetDream2 = useDream2Store((s) => s.reset);

  const fadeIn = useFadeStore((s) => s.fadeIn);
  const fadeOut = useFadeStore((s) => s.fadeOut);
  const setScene = useAppStore((s) => s.setScene);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // FIX: Immediately trigger fade when second click happens
  useEffect(() => {
    if (transitioning) {
      fadeIn(); // Fade screen to black
      
      const timer = setTimeout(() => {
        setScene(SCENES.DREAM3);
        resetDream2();
        fadeOut(); // Bring screen back up
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [transitioning, fadeIn, fadeOut, resetDream2, setScene]);

  const spawn = useMemo(() => new THREE.Vector3(0, 1.5, 12), []);
  const target = useMemo(() => new THREE.Vector3(0, 1.5, 0), []);

  const constrainDream2 = (pos: THREE.Vector3) => {
    const farSouthZ = 14;         
    const riverSouthBankZ = 2;    
    const riverNorthBankZ = -2;   
    const farNorthZ = -14;        

    const wideLeftX = -12;        
    const wideRightX = 12;        
    const bridgeLeftX = -1.5;     
    const bridgeRightX = 1.5;     

    pos.z = THREE.MathUtils.clamp(pos.z, farNorthZ, farSouthZ);

    if (pos.z < riverSouthBankZ && pos.z > riverNorthBankZ) {
      pos.x = THREE.MathUtils.clamp(pos.x, bridgeLeftX, bridgeRightX);
    } else {
      pos.x = THREE.MathUtils.clamp(pos.x, wideLeftX, wideRightX);
    }
  };

  return (
    <>
      {/* Hide the UI during the fade transition */}
      {!transitioning && (
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
          {uiMessage}
        </div>
      )}

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