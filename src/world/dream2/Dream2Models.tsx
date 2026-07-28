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

  const { hasKey, collectKey, showMessage, crystalActivated, activateCrystal } = useDream2Store();

  const crystalGroupRef = useRef<THREE.Group>(null);
  const keyRef = useRef<THREE.Group>(null);

  // FIX 1: Safely calculate the exact center ONCE using useMemo instead of useEffect
  const crystalCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(crystal.scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return center;
  }, [crystal.scene]);

  useEffect(() => {
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
  }, [water.scene]);

  useFrame((state, delta) => {
    if (crystalGroupRef.current) {
      if (crystalActivated) {
        // Spin perfectly in place
        crystalGroupRef.current.rotation.y += delta * 2;
        // Rise smoothly up to 1.5 units above its actual starting point
        if (crystalGroupRef.current.position.y < crystalCenter.y + 1.5) {
          crystalGroupRef.current.position.y += delta * 0.3;
        }
      } else {
        // FIX 2: Gentle hover effect perfectly calculated from its true starting height
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

      {/* FIX 3: Nested Groups Hack. We move the parent group TO the crystal's center, 
          then mathematically move the crystal mesh backward so they cancel out perfectly! */}
      <group ref={crystalGroupRef} position={crystalCenter}>
        
        {/* The inner offset perfectly cancels out the Blender coordinates */}
        <group position={[-crystalCenter.x, -crystalCenter.y, -crystalCenter.z]}>
          <primitive 
            object={crystal.scene} 
            onClick={handleCrystalClick}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          />
        </group>
        
        {/* Because the parent group is fixed, the particles will now wrap the crystal perfectly! */}
        <GreenParticles />
        
      </group>
    </group>
  );
}