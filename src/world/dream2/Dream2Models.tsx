import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function Dream2Models() {
  const lanterns = useGLTF("/models/dream2/Dream2_AllLanterns.glb");
  const crystal = useGLTF("/models/dream2/Dream2_Crystal.glb");
  const floor = useGLTF("/models/dream2/Dream2_Floor.glb");
  const path = useGLTF("/models/dream2/Dream2_Floor_Path.glb");
  const tree = useGLTF("/models/dream2/Dream2_Main_Tree.glb");
  const water = useGLTF("/models/dream2/Dream2_River_Water.glb");
  const rocks = useGLTF("/models/dream2/Dream2_Rocks.glb");
  const shrine = useGLTF("/models/dream2/Dream2_Stone_Shrine.glb");
  const key = useGLTF("/models/dream2/Dream2_Unlock_Key.glb");
  const well = useGLTF("/models/dream2/Dream2_Well.glb");
  const bridge = useGLTF("/models/dream2/Dream2_Wooden_Bridge.glb");

  // Fix the invisible water material
  useEffect(() => {
    water.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Apply a custom, web-safe transparent water material
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#0ea5e9", // Nice river blue
          transparent: true,
          opacity: 0.8,
          roughness: 0.1,
          transmission: 0.5,
          thickness: 1,
        });
      }
    });
  }, [water.scene]);

  return (
    <group>
      <primitive object={floor.scene} />
      <primitive object={path.scene} />
      
      {/* Lift the water slightly (0.05 on the Y axis) to prevent it from glitching through the dirt */}
      <primitive object={water.scene} position={[0, 0.05, 0]} />
      
      <primitive object={bridge.scene} />
      <primitive object={tree.scene} />
      <primitive object={rocks.scene} />
      <primitive object={shrine.scene} />
      <primitive object={well.scene} />
      <primitive object={lanterns.scene} />
      <primitive object={key.scene} />
      <primitive object={crystal.scene} />
    </group>
  );
}

useGLTF.preload("/models/dream2/Dream2_AllLanterns.glb");
useGLTF.preload("/models/dream2/Dream2_Crystal.glb");
useGLTF.preload("/models/dream2/Dream2_Floor.glb");
useGLTF.preload("/models/dream2/Dream2_Floor_Path.glb");
useGLTF.preload("/models/dream2/Dream2_Main_Tree.glb");
useGLTF.preload("/models/dream2/Dream2_River_Water.glb");
useGLTF.preload("/models/dream2/Dream2_Rocks.glb");
useGLTF.preload("/models/dream2/Dream2_Stone_Shrine.glb");
useGLTF.preload("/models/dream2/Dream2_Unlock_Key.glb");
useGLTF.preload("/models/dream2/Dream2_Well.glb");
useGLTF.preload("/models/dream2/Dream2_Wooden_Bridge.glb");