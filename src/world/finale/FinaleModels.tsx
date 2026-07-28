import { useGLTF, Float } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function FinaleModels() {
  // FIX: Updated to match the exact file name from your screenshot!
  const dream1Tree = useGLTF("/models/dream1/Final_Dream1_AllIsland_RocksTrees.glb"); 
  
  // Note: If you get the same error for Dream 2 or 3, double-check their folder names too!
  const dream2Crystal = useGLTF("/models/dream2/Dream2_Crystal.glb");
  const dream3Crystal = useGLTF("/models/dream3/Dream3_Crystal_withCover.glb");

  useEffect(() => {
    dream2Crystal.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#4ade80", emissive: "#22c55e", emissiveIntensity: 2,
        });
      }
    });

    dream3Crystal.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#38bdf8", emissive: "#0ea5e9", emissiveIntensity: 2, transparent: true, opacity: 0.8,
        });
      }
    });
  }, [dream2Crystal.scene, dream3Crystal.scene]);

  return (
    <group>
      {/* DREAM 1 MEMORY */}
      <group position={[3, -2, -15]}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <primitive object={dream1Tree.scene} />
          <pointLight color="#fca5a5" intensity={5} distance={20} />
        </Float>
      </group>

      {/* DREAM 2 MEMORY */}
      <group position={[-3, 0, -40]}>
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <primitive object={dream2Crystal.scene} scale={2} />
          <pointLight color="#86efac" intensity={10} distance={20} />
        </Float>
      </group>

      {/* DREAM 3 MEMORY */}
      <group position={[3, 0, -65]}>
        <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1}>
          <primitive object={dream3Crystal.scene} scale={1.5} />
          <pointLight color="#93c5fd" intensity={10} distance={30} />
        </Float>
      </group>

      <instancedMesh args={[undefined, undefined, 200]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </instancedMesh>
    </group>
  );
}