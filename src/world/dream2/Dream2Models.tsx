import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
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

  const { hasKey, collectKey, showMessage, crystalActivated, activateCrystal } = useDream2Store();

  const crystalGroupRef = useRef<THREE.Group>(null);
  const keyRef = useRef<THREE.Group>(null);

  // FIX: Setup Water and Crystal Pivot
  useEffect(() => {
    // 1. Water Material
    water.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#0ea5e9",
          transparent: true,
          opacity: 0.8,
          roughness: 0.1,
          transmission: 0.5,
          thickness: 1,
        });
      }
    });

    // 2. Crystal Pivot Hack (Stops the crazy orbiting)
    const box = new THREE.Box3().setFromObject(crystal.scene);
    const center = new THREE.Vector3();
    box.getCenter(center);

    if (crystalGroupRef.current) {
      // Move the wrapper exact to the crystal's visual center
      crystalGroupRef.current.position.copy(center);
      // Move the model backwards so it stays visually in the same spot
      crystal.scene.position.set(-center.x, -center.y, -center.z);
    }
  }, [water.scene, crystal.scene]);

  useFrame((state, delta) => {
    if (crystalGroupRef.current) {
      if (crystalActivated) {
        // Activated: Spin perfectly in place and move slightly upward
        crystalGroupRef.current.rotation.y += delta * 2;
        if (crystalGroupRef.current.position.y < 3.5) {
          crystalGroupRef.current.position.y += delta * 0.3;
        }
      } else {
        // Idle: JUST bob up and down smoothly. No rotation.
        // We use an offset so it bobs relative to its starting height
        crystalGroupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
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

  const handleCrystalClick = (e: any) => {
    e.stopPropagation();
    if (crystalActivated) return; 
    
    if (!hasKey) {
      showMessage("Find the key first!");
      setTimeout(() => showMessage("Objective: Find the key for go to the next dream"), 3000);
    } else {
      activateCrystal();
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

      {/* Crystal and Particles are grouped together so the particles spawn AT the crystal's exact center */}
      <group ref={crystalGroupRef}>
        <primitive 
          object={crystal.scene} 
          onClick={handleCrystalClick}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />
        <GreenParticles />
      </group>
    </group>
  );
}