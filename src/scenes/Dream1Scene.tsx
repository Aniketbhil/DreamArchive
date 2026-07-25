import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

import FadeOverlay from "../components/transitions/FadeOverlay";
import Dream1Models from "../world/dream1/Dream1Models";
import PostProcessing from "../components/effects/PostProcessing";
import FirstPersonCamera from "../components/player/FirstPersonCamera";

import { useFadeStore } from "../store/fadeStore";
import { useAppStore } from "../store/appStore";
import { useFeatherStore } from "../store/featherStore";
import { SCENES } from "../constants/scenes";

export default function Dream1Scene() {
  const [started, setStarted] = useState(false);

  const fadeIn = useFadeStore((s) => s.fadeIn);
  const fadeOut = useFadeStore((s) => s.fadeOut);
  const setScene = useAppStore((s) => s.setScene);
  
  const collectedCount = useFeatherStore((s) => s.collectedCount);
  const totalFeathers = useFeatherStore((s) => s.totalFeathers);
  const isComplete = collectedCount >= totalFeathers;

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const spawn = useMemo(() => new THREE.Vector3(0, 5, 20), []);
  const target = useMemo(() => new THREE.Vector3(0, 5, 0), []);

  const handlePortalClick = (e: any) => {
    if (!isComplete) return;
    e.stopPropagation();
    fadeIn();
    
    setTimeout(() => {
      setScene(SCENES.DREAM2);
      fadeOut();
    }, 1800);
  };

  // INVISIBLE CIRCULAR WALL FOR THE ISLAND
  const constrainDream1 = (pos: THREE.Vector3) => {
    const islandRadius = 32;
    const distance = Math.hypot(pos.x, pos.z);

    if (distance > islandRadius) {
      const angle = Math.atan2(pos.z, pos.x);
      pos.x = Math.cos(angle) * islandRadius;
      pos.z = Math.sin(angle) * islandRadius;
    }
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#fde047',
        fontFamily: 'sans-serif',
        fontSize: '18px',
        letterSpacing: '2px',
        zIndex: 10,
        pointerEvents: 'none',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
      }}>
        Feathers Collected: {collectedCount} / {totalFeathers}
        {!isComplete && <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '4px' }}>Collect all feathers to unlock the portal</div>}
        {isComplete && <div style={{ fontSize: '14px', color: '#4ade80', textAlign: 'center', marginTop: '4px' }}>Portal Unlocked! Find it on the island.</div>}
      </div>

      <Canvas 
        shadows 
        dpr={[1, 1.5]}
        camera={{ fov: 45, near: 0.1, far: 3000 }}
      >
        <color attach="background" args={["#020204"]} />
        
        <ambientLight intensity={0.4} />
        <hemisphereLight intensity={0.6} color="#a68bfa" groundColor="#0f172a" />
        <directionalLight 
          castShadow 
          intensity={3.5} 
          position={[100, 200, 50]} 
          color="#e0e7ff"
        />

        <Suspense fallback={null}>
          <Dream1Models />
          
          {isComplete && (
            <group position={[0, 8, -30]}>
              <mesh 
                onClick={handlePortalClick}
                onPointerOver={() => (document.body.style.cursor = "pointer")}
                onPointerOut={() => (document.body.style.cursor = "auto")}
              >
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#4ade80" />
              </mesh>
              <pointLight color="#4ade80" intensity={15} distance={60} />
              <Text position={[0, 3.5, 0]} fontSize={0.6} color="#4ade80">
                Enter Dream 2
              </Text>
            </group>
          )}

          <FirstPersonCamera 
            spawn={spawn} 
            target={target} 
            started={started} 
            walkSpeed={20} // Half speed for a more relaxed dream environment
            constrainBounds={constrainDream1}
          />
          
          <PostProcessing />
        </Suspense>
      </Canvas>

      <FadeOverlay />
    </>
  );
}