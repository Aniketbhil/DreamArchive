import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
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

  const [mirrorMeshes, setMirrorMeshes] = useState<THREE.Mesh[]>([]);

  useEffect(() => {
    // 1. Glass Path
    path.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#ffffff", transparent: true, opacity: 0.3, roughness: 0.05, transmission: 0.9, thickness: 0.5,
        });
      }
    });

    // 2. Metallic Platforms
    platforms.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#94a3b8", metalness: 0.9, roughness: 0.15,
        });
      }
    });

    // 3. Laser Focus points
    laserFocus.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#38bdf8", transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.5, transmission: 0.9, thickness: 0.5,
        });
      }
    });

    // 4. FIX: Double-Sided Floating Mirrors
    const extractedMirrors: THREE.Mesh[] = [];
    mirror.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#d8b4fe", 
          emissive: "#9333ea", 
          emissiveIntensity: 1,
          metalness: 0.8,
          roughness: 0.2,
          // THIS IS THE FIX: Forces the engine to render the back of the mirror too!
          side: THREE.DoubleSide, 
        });
        extractedMirrors.push(child);
      }
    });
    setMirrorMeshes(extractedMirrors);

  }, [path.scene, platforms.scene, laserFocus.scene, mirror.scene]);

  useFrame((_, delta) => {
    rings.scene.rotation.y += delta * 0.05;
    rings.scene.rotation.z += delta * 0.02;
  });

  const handleMirrorClick = (e: any, index: number) => {
    e.stopPropagation();
    e.object.rotation.y += Math.PI / 4; 
    toggleMirror(index);
  };

  const handleCrystalClick = (e: any) => {
    e.stopPropagation();
    if (isUnlocked) {
      alert("Congratulations! You have completed the Dream Archive!");
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
      <primitive object={laserFocus.scene} />

      <group>
        {mirrorMeshes.map((mesh, index) => (
          <primitive 
            key={index} 
            object={mesh} 
            onClick={(e: any) => handleMirrorClick(e, index)}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          />
        ))}
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