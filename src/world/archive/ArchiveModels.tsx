import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useCrystalStore } from "../../store/crystalStore";

export interface ArchiveModelsProps {
  onReady: (crystal: THREE.Vector3, bounds: THREE.Box3) => void;
}

export default function ArchiveModels({ onReady }: ArchiveModelsProps) {
  const floor = useGLTF("/models/archive/PillarsAndFloor.glb");

  const rocks = useGLTF("/models/archive/Rocks.glb");

  const pedestal = useGLTF("/models/archive/PedestalAndCenterMid.glb");

  const crystal = useGLTF("/models/archive/Crystal.glb");

  const activated = useCrystalStore((state) => state.activated);

  const progress = useCrystalStore((state) => state.activationProgress);

  const setProgress = useCrystalStore((state) => state.setActivationProgress);

  const root = useRef<THREE.Group>(null);

  const crystalGroup = useRef<THREE.Group>(null);

  const crystalLight = useRef<THREE.PointLight>(null);

  const materials = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    if (!root.current || !crystalGroup.current) return;

    root.current.updateWorldMatrix(true, true);

    root.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;
    });

    crystal.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const material = child.material as THREE.MeshStandardMaterial;

      material.emissive = new THREE.Color("#8b5cf6");
      material.emissiveIntensity = 2;

      materials.current.push(material);
    });

    const bounds = new THREE.Box3().setFromObject(root.current);

    const crystalPosition = new THREE.Vector3();

    crystalGroup.current.getWorldPosition(crystalPosition);

    onReady(crystalPosition, bounds);
  }, []);

  useFrame((state, delta) => {
    if (!crystalGroup.current) return;

    const t = state.clock.elapsedTime;

    let rotationSpeed = 0.003;
    let floatAmount = 2;
    let lightIntensity = 12;
    let emissive = 2;

    if (activated) {
      const next = THREE.MathUtils.damp(progress, 1, 2, delta);

      setProgress(next);

      rotationSpeed = THREE.MathUtils.lerp(0.003, 0.03, next);

      floatAmount = THREE.MathUtils.lerp(2, 6, next);

      lightIntensity = THREE.MathUtils.lerp(12, 40, next);

      emissive = THREE.MathUtils.lerp(2, 8, next);
    }

    crystalGroup.current.rotation.y += rotationSpeed;

    crystalGroup.current.position.y = Math.sin(t * 1.8) * floatAmount;

    materials.current.forEach((material) => {
      material.emissiveIntensity = emissive + Math.sin(t * 5) * 0.4;
    });

    if (crystalLight.current) {
      crystalLight.current.intensity = lightIntensity + Math.sin(t * 5) * 2;
    }
  });

  return (
    <group ref={root}>
      <primitive object={floor.scene} />

      <primitive object={rocks.scene} />

      <primitive object={pedestal.scene} />

      <group ref={crystalGroup}>
        <primitive
          object={crystal.scene}
          // 1. Add the click event to trigger the global state
          onClick={(e: any) => {
            e.stopPropagation(); // Prevent clicking through the object
            if (!activated) {
              useCrystalStore.getState().activate();
            }
          }}
          // 2. Change the cursor to a pointer when hovering over the crystal
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />

        <pointLight
          ref={crystalLight}
          color="#8b5cf6"
          intensity={12}
          distance={260}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/archive/PillarsAndFloor.glb");

useGLTF.preload("/models/archive/Rocks.glb");

useGLTF.preload("/models/archive/PedestalAndCenterMid.glb");

useGLTF.preload("/models/archive/Crystal.glb");
