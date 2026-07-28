import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDream2Store } from "../../store/dream2Store";
import GreenParticles from "./GreenParticles";

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

  // Grab the new startTransition function
  const { hasKey, collectKey, showMessage, crystalActivated, activateCrystal, startTransition } = useDream2Store();

  const crystalGroupRef = useRef<THREE.Group>(null);
  const keyRef = useRef<THREE.Group>(null);

  const crystalCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(crystal.scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return center;
  }, [crystal.scene]);

  useEffect(() => {
    // FIX: Using a reliable StandardMaterial for the water so it always renders
    water.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#0284c7", // Deep river blue
          transparent: true,
          opacity: 0.75,
          roughness: 0.1,
          metalness: 0.2,
          depthWrite: false, // Helps prevent glitching with the ground
        });
      }
    });

    crystal.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color("#4ade80");
        mat.emissiveIntensity = 2; 
      }
    });
  }, [water.scene, crystal.scene]);

  useFrame((state, delta) => {
    if (crystalGroupRef.current) {
      if (crystalActivated) {
        crystalGroupRef.current.rotation.y += delta * 2;
        if (crystalGroupRef.current.position.y < crystalCenter.y + 1.5) {
          crystalGroupRef.current.position.y += delta * 0.3;
        }
      } else {
        crystalGroupRef.current.position.y = crystalCenter.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  const handleKeyClick = (e: any) => {
    e.stopPropagation();
    if (!hasKey) {
      collectKey();
      if (keyRef.current) keyRef.current.visible = false; 
    }
  };

  // FIX: The two-step click logic!
  const handleCrystalClick = (e: any) => {
    e.stopPropagation();
    
    if (!hasKey) {
      // Don't have the key yet
      showMessage("Find the key first!");
      setTimeout(() => showMessage("Objective: Find the key for go to the next dream"), 3000);
    } else if (!crystalActivated) {
      // FIRST CLICK: Trigger the animation
      activateCrystal();
    } else {
      // SECOND CLICK: Trigger the fade out to Dream 3
      startTransition();
    }
  };

  return (
    <group>
      <primitive object={floor.scene} />
      <primitive object={path.scene} />
      <primitive object={water.scene} position={[0, 0.05, 0]} />
      <primitive object={bridge.scene} />
      <primitive object={tree.scene} />
      <primitive object={rocks.scene} />
      <primitive object={shrine.scene} />
      <primitive object={well.scene} />
      <primitive object={lanterns.scene} />

      <group ref={keyRef}>
        <primitive 
          object={key.scene} 
          onClick={handleKeyClick}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />
      </group>

      <group ref={crystalGroupRef} position={crystalCenter}>
        <group position={[-crystalCenter.x, -crystalCenter.y, -crystalCenter.z]}>
          <primitive 
            object={crystal.scene} 
            onClick={handleCrystalClick}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          />
        </group>
        <pointLight color="#4ade80" intensity={8} distance={15} />
        <GreenParticles />
      </group>
    </group>
  );
}