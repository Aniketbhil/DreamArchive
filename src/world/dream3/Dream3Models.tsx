import { useGLTF } from "@react-three/drei";
import { useEffect, useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDream3Store } from "../../store/dream3Store";

export default function Dream3Models() {
  const bg = useGLTF("/models/dream3/Dream3_Background_Space.glb");
  const rings = useGLTF("/models/dream3/Dream3_Broken_Cosmic_Ring.glb");
  const path = useGLTF("/models/dream3/Dream3_Broken_GlassPath.glb");
  const crystal = useGLTF("/models/dream3/Dream3_Crystal_withCover.glb");
  const runes = useGLTF("/models/dream3/Dream3_Data_Runes.glb");
  const mirror = useGLTF("/models/dream3/Dream3_Floating_Mirror.glb");
  const laserBase = useGLTF("/models/dream3/Dream3_LazerBeam_and_EventHorizon.glb");
  const platforms = useGLTF("/models/dream3/Dream3_Plateforms.glb");
  const laserFocus = useGLTF("/models/dream3/Dream3_Six_LaserFocus.glb");
  const pillars = useGLTF("/models/dream3/Dream3_Stone_Pillers.glb");

  const toggleMirror = useDream3Store((s) => s.toggleMirror);
  const isUnlocked = useDream3Store((s) => s.isUnlocked);
  const startTransition = useDream3Store((s) => s.startTransition); 
  
  // FIX: Grab the ENTIRE array of alignments at the top level of the component.
  // This satisfies React's strict "Rules of Hooks"
  const mirrorsAligned = useDream3Store((s) => s.mirrorsAligned);

  const [mirrorMeshes, setMirrorMeshes] = useState<THREE.Mesh[]>([]);
  const [focusMeshes, setFocusMeshes] = useState<THREE.Mesh[]>([]);
  
  const originalPositions = useRef<THREE.Vector3[]>([]);

  const targetPositions = useMemo(() => [
    new THREE.Vector3(4, 2.5, 4),   
    new THREE.Vector3(-4, 2.5, 4),  
    new THREE.Vector3(-4, 2.5, -4), 
    new THREE.Vector3(4, 2.5, -4),  
  ], []);

  const crystalCenter = useMemo(() => new THREE.Vector3(0, 1.5, 0), []);
  
  const laserLength = useMemo(() => targetPositions[0].distanceTo(crystalCenter), [targetPositions, crystalCenter]);

  useEffect(() => {
    path.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#ffffff", transparent: true, opacity: 0.3, roughness: 0.05, transmission: 0.9, thickness: 0.5,
        });
      }
    });

    platforms.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#94a3b8", metalness: 0.9, roughness: 0.15,
        });
      }
    });

    rings.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#475569", metalness: 0.6, roughness: 0.4,
        });
      }
    });

    const extractedFocuses: THREE.Mesh[] = [];
    laserFocus.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#38bdf8", emissive: "#0ea5e9", emissiveIntensity: 0.2, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.5, transmission: 0.9, thickness: 0.5,
        });
        extractedFocuses.push(child);
      }
    });
    setFocusMeshes(extractedFocuses);

    const extractedMirrors: THREE.Mesh[] = [];
    const origPos: THREE.Vector3[] = [];
    mirror.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#d8b4fe", emissive: "#9333ea", emissiveIntensity: 1, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide, 
        });
        extractedMirrors.push(child);
        origPos.push(child.position.clone()); 
      }
    });
    setMirrorMeshes(extractedMirrors);
    originalPositions.current = origPos;

  }, [path.scene, platforms.scene, laserFocus.scene, rings.scene, mirror.scene]);

  useFrame((_, delta) => {
    rings.scene.rotation.y += delta * 0.2;
    rings.scene.rotation.z += delta * 0.1;
    
    mirrorMeshes.forEach((mesh, index) => {
      const isAligned = mirrorsAligned[index];
      const targetPos = isAligned ? targetPositions[index] : originalPositions.current[index];
      
      if (targetPos) {
        mesh.position.lerp(targetPos, delta * 2.5);
        if (isAligned) mesh.lookAt(crystalCenter);
      }
    });

    focusMeshes.forEach((mesh, index) => {
      const isActive = index < 4 ? mirrorsAligned[index] : isUnlocked;
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      const targetGlow = isActive ? 5 : 0.2;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetGlow, delta * 4);
    });
  });

  const handleMirrorClick = (e: any, index: number) => {
    e.stopPropagation();
    toggleMirror(index); 
  };

  const handleCrystalClick = (e: any) => {
    e.stopPropagation();
    if (isUnlocked) {
      startTransition();
    }
  };

  return (
    <group>
      <primitive object={bg.scene} />
      <primitive object={rings.scene} />
      <primitive object={platforms.scene} />
      <primitive object={path.scene} />
      <primitive object={pillars.scene} />
      <primitive object={runes.scene} />
      <primitive object={laserBase.scene} />
      
      <group>
        {focusMeshes.map((mesh, index) => (
          <primitive key={`focus-${index}`} object={mesh} />
        ))}
      </group>

      <group>
        {mirrorMeshes.map((mesh, index) => {
          // FIX: Safely read from the array we grabbed at the top level
          const isAligned = mirrorsAligned[index];
          return (
            <group key={`mirror-group-${index}`}>
              <primitive 
                object={mesh} 
                onClick={(e: any) => handleMirrorClick(e, index)}
                onPointerOver={() => (document.body.style.cursor = "pointer")}
                onPointerOut={() => (document.body.style.cursor = "auto")}
              >
                {isUnlocked && isAligned && (
                  <mesh position={[0, 0, -laserLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, laserLength, 16]} />
                    <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={5} />
                  </mesh>
                )}
              </primitive>
            </group>
          );
        })}
      </group>

      <group>
        <primitive 
          object={crystal.scene} 
          onClick={handleCrystalClick}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />
        <pointLight 
          position={[0, 2, 0]} 
          intensity={isUnlocked ? 20 : 5} 
          color={isUnlocked ? "#4ade80" : "#3b82f6"} 
          distance={50} 
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/dream3/Dream3_Background_Space.glb");
useGLTF.preload("/models/dream3/Dream3_Broken_Cosmic_Ring.glb");
useGLTF.preload("/models/dream3/Dream3_Broken_GlassPath.glb");
useGLTF.preload("/models/dream3/Dream3_Crystal_withCover.glb");
useGLTF.preload("/models/dream3/Dream3_Data_Runes.glb");
useGLTF.preload("/models/dream3/Dream3_Floating_Mirror.glb");
useGLTF.preload("/models/dream3/Dream3_LazerBeam_and_EventHorizon.glb");
useGLTF.preload("/models/dream3/Dream3_Plateforms.glb");
useGLTF.preload("/models/dream3/Dream3_Six_LaserFocus.glb");
useGLTF.preload("/models/dream3/Dream3_Stone_Pillers.glb");