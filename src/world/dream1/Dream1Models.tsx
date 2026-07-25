import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useFeatherStore } from "../../store/featherStore";

export default function Dream1Models() {
  const clouds = useGLTF("/models/dream1/Final_Dream1_AllClouds.glb");
  const feathers = useGLTF("/models/dream1/Final_Dream1_AllFeathers.glb");
  const islands = useGLTF(
    "/models/dream1/Final_Dream1_AllIsland_RocksTrees.glb",
  );
  const whales = useGLTF("/models/dream1/Final_Dream1_AllWhales.glb");
  const backgroundBox = useGLTF(
    "/models/dream1/Final_Dream1_SpaceBackgroundBox.glb",
  );

  const whalesRef = useRef<THREE.Group>(null);
  const collectFeather = useFeatherStore((s) => s.collectFeather);

  // We use the 3D object's internal ID to track collections safely
  const [collectedIds, setCollectedIds] = useState<number[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (whalesRef.current) {
      whalesRef.current.position.y = Math.sin(time * 0.5) * 2;
    }
  });

  return (
    <group>
      <primitive object={backgroundBox.scene} />
      <primitive object={clouds.scene} />
      <primitive object={islands.scene} />

      {/* Feathers Container */}
      <group>
        <primitive
          object={feathers.scene}
          onClick={(e: any) => {
            e.stopPropagation();
            const clickedObject = e.object;

            // Check if this specific mesh ID has already been collected
            if (!collectedIds.includes(clickedObject.id)) {
              setCollectedIds((prev) => [...prev, clickedObject.id]);
              clickedObject.visible = false; // Hide the collected feather
              collectFeather(); // Add +1 to the global store
            }
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />
      </group>

      <group ref={whalesRef}>
        <primitive object={whales.scene} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/dream1/Final_Dream1_AllClouds.glb");
useGLTF.preload("/models/dream1/Final_Dream1_AllFeathers.glb");
useGLTF.preload("/models/dream1/Final_Dream1_AllIsland_RocksTrees.glb");
useGLTF.preload("/models/dream1/Final_Dream1_AllWhales.glb");
useGLTF.preload("/models/dream1/Final_Dream1_SpaceBackgroundBox.glb");
