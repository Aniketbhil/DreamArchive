import { useGLTF } from "@react-three/drei";

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

  return (
    <group>
      <primitive object={backgroundBox.scene} />
      <primitive object={clouds.scene} />
      <primitive object={feathers.scene} />
      <primitive object={islands.scene} />
      <primitive object={whales.scene} />
    </group>
  );
}

// Preloading ensures the loader screen doesn't finish until these massive files are downloaded
useGLTF.preload("/models/dream1/Final_Dream1_AllClouds.glb");
useGLTF.preload("/models/dream1/Final_Dream1_AllFeathers.glb");
useGLTF.preload("/models/dream1/Final_Dream1_AllIsland_RocksTrees.glb");
useGLTF.preload("/models/dream1/Final_Dream1_AllWhales.glb");
useGLTF.preload("/models/dream1/Final_Dream1_SpaceBackgroundBox.glb");
