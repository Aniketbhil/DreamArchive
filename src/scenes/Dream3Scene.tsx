import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

import FadeOverlay from "../components/transitions/FadeOverlay";
import Dream3Models from "../world/dream3/Dream3Models";
import PostProcessing from "../components/effects/PostProcessing";
import FirstPersonCamera from "../components/player/FirstPersonCamera";

import { useDream3Store } from "../store/dream3Store";
import { useFadeStore } from "../store/fadeStore";
import { useAppStore } from "../store/appStore";
import { SCENES } from "../constants/scenes";

export default function Dream3Scene() {
  const [started, setStarted] = useState(false);
  
  const uiMessage = useDream3Store((s) => s.message); 
  const transitioning = useDream3Store((s) => s.transitioning); // NEW
  const resetDream3 = useDream3Store((s) => s.reset);

  const fadeIn = useFadeStore((s) => s.fadeIn);
  const fadeOut = useFadeStore((s) => s.fadeOut);
  const setScene = useAppStore((s) => s.setScene);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // NEW: The cinematic ending transition
  useEffect(() => {
    if (transitioning) {
      fadeIn(); // Fade screen to black
      
      const timer = setTimeout(() => {
        // For now, let's return the player to the Archive Hub!
        setScene(SCENES.ARCHIVE);
        resetDream3();
        fadeOut(); 
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [transitioning, fadeIn, fadeOut, resetDream3, setScene]);

  const spawn = useMemo(() => new THREE.Vector3(0, 1.5, 8), []);
  const target = useMemo(() => new THREE.Vector3(0, 1.5, 0), []);

  const constrainDream3 = (pos: THREE.Vector3) => {
    // BOUNDARIES TEMPORARILY DISABLED FOR TESTING
    // pos.x = THREE.MathUtils.clamp(pos.x, -3, 3);
     pos.z = THREE.MathUtils.clamp(pos.z, -50, 1);
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
          color: '#a78bfa',
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

      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 45, near: 0.1, far: 5000 }}>
        <color attach="background" args={["#090e17"]} />
        <ambientLight intensity={1.5} />
        <hemisphereLight intensity={1.2} color="#c4b5fd" groundColor="#1e293b" />
        <directionalLight castShadow intensity={3} position={[20, 50, 20]} color="#e0e7ff" />
        
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