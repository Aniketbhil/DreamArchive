import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useCrystalStore } from "../../store/crystalStore";

const COUNT = 500;

export default function DustParticles() {
  const points = useRef<THREE.Points>(null);

  const progress = useCrystalStore(
    (s) => s.activationProgress
  );

  const positions = useMemo(() => {
    const array = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      array[i * 3] = (Math.random() - 0.5) * 500;
      array[i * 3 + 1] = Math.random() * 120;
      array[i * 3 + 2] = (Math.random() - 0.5) * 500;
    }

    return array;
  }, []);

  useFrame((state) => {
    if (!points.current) return;

    points.current.rotation.y =
      state.clock.elapsedTime * 0.01;

    if (progress <= 0) return;

    const pos =
      points.current.geometry.attributes.position;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;

      pos.array[ix] *= 1 - progress * 0.002;
      pos.array[ix + 2] *= 1 - progress * 0.002;
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={1.4}
        sizeAttenuation
        color="#cfcfff"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}