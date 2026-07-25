import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

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

  // Create refs to control the 3D groups directly
  const whalesRef = useRef<THREE.Group>(null);
  const feathersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // 1. Make the whales float up and down gently in the sky
    if (whalesRef.current) {
      whalesRef.current.position.y = Math.sin(time * 0.5) * 2;
    }

    // 2. Make the feathers spin and bob to look like collectible items
    if (feathersRef.current) {
      feathersRef.current.position.y = Math.sin(time * 1.5) * 0.5;
      // Note: If this spins them off-center, we will adjust it, but usually, it looks magical!
    }
  });

  return (
    <group>
      <primitive object={backgroundBox.scene} />
      <primitive object={clouds.scene} />
      <primitive object={islands.scene} />

      {/* Wrap the animated models in our refs */}
      <group ref={feathersRef}>
        <primitive object={feathers.scene} />
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
