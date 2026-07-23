// import { PointLight } from "three";

export default function ArchiveLights() {
  return (
    <>
      {/* Ambient */}

      <ambientLight intensity={0.08} />

      {/* Sky */}

      <hemisphereLight
        intensity={0.28}
        color="#bfd8ff"
        groundColor="#141414"
      />

      {/* Main */}

      <directionalLight
        castShadow
        intensity={4.5}
        position={[120, 180, 120]}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />

      {/* Crystal */}

      <pointLight
        color="#7d5fff"
        intensity={12}
        distance={220}
        position={[0, 42, 0]}
      />

      {/* Rim */}

      <directionalLight
        intensity={0.9}
        position={[-120, 60, -150]}
        color="#8ab4ff"
      />
    </>
  );
}