import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDream2Store } from "../../store/dream2Store";

export default function GreenParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const crystalActivated = useDream2Store((s) => s.crystalActivated);

  const particlesCount = 100;

  // Generate the 100 random starting positions around the crystal
  const particlesData = useMemo(() => {
    const data = [];
    for (let i = 0; i < particlesCount; i++) {
      // Spawn within a localized radius around the crystal
      const radius = 1 + Math.random() * 2; 
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);

      const offsetX = radius * Math.sin(phi) * Math.cos(theta);
      const offsetY = radius * Math.sin(phi) * Math.sin(theta);
      const offsetZ = radius * Math.cos(phi);

      data.push({
        offset: new THREE.Vector3(offsetX, offsetY, offsetZ),
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * 100,
        currentPos: new THREE.Vector3()
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    particlesData.forEach((particle, i) => {
      if (!crystalActivated) {
        // Idle State: Float smoothly around the crystal
        particle.currentPos.copy(particle.offset);
        particle.currentPos.y += Math.sin(time * particle.speed + particle.phase) * 0.3;
        particle.currentPos.x += Math.cos(time * particle.speed + particle.phase) * 0.3;
      } else {
        // Activated State: Smoothly suck all particles into the center
        particle.currentPos.lerp(new THREE.Vector3(0, 0, 0), delta * 2.5);
      }

      dummy.position.copy(particle.currentPos);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particlesCount]}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color="#4ade80" transparent opacity={0.8} />
    </instancedMesh>
  );
}