import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

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

  useEffect(() => {
    // 1. Fix the Invisible Glass Path
    path.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#ffffff",
          transparent: true,
          opacity: 0.3,
          roughness: 0.05,
          transmission: 0.9, // This makes it act like real glass
          thickness: 0.5,
        });
      }
    });

    // 2. Fix the Blinding White Platforms (Make them properly shiny/metallic)
    platforms.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#94a3b8", // A sleek slate/silver color
          metalness: 0.9,   // High reflection (Shiny!)
          roughness: 0.15,  // Very smooth
        });
      }
    });
  }, [path.scene, platforms.scene]);

  return (
    <group>
      <primitive object={bg.scene} />
      <primitive object={rings.scene} />
      <primitive object={platforms.scene} />
      <primitive object={path.scene} />
      <primitive object={pillars.scene} />
      <primitive object={runes.scene} />
      
      <primitive object={mirror.scene} />
      <primitive object={laserBase.scene} />
      <primitive object={laserFocus.scene} />
      <primitive object={crystal.scene} />
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