import { useGLTF, Float, useScroll } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FinaleModels() {
  const dream1Tree = useGLTF("/models/dream1/Final_Dream1_AllIsland_RocksTrees.glb"); 
  const dream2Crystal = useGLTF("/models/dream2/Dream2_Crystal.glb");
  const dream3Crystal = useGLTF("/models/dream3/Dream3_Crystal_withCover.glb");

  const scroll = useScroll();
  const dream1Ref = useRef<THREE.Group>(null);
  const dream2Ref = useRef<THREE.Group>(null);
  const dream3Ref = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    dream2Crystal.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#4ade80", emissive: "#22c55e", emissiveIntensity: 2,
        });
      }
    });

    dream3Crystal.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#38bdf8", emissive: "#0ea5e9", emissiveIntensity: 2, transparent: true, opacity: 0.8,
        });
      }
    });
  }, [dream2Crystal.scene, dream3Crystal.scene]);

  const starPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 400; i++) {
      positions.push(
        (Math.random() - 0.5) * 60, 
        (Math.random() - 0.5) * 60, 
        Math.random() * -150        
      );
    }
    return new Float32Array(positions);
  }, []);

  // FIX 1: Replaced 'state' with '_'
  useFrame((_, delta) => {
    const scrollDelta = scroll.delta; 

    if (dream1Ref.current) {
      dream1Ref.current.rotation.y += delta * 0.1;           
      dream1Ref.current.rotation.y += scrollDelta * 1.5;     
    }
    if (dream2Ref.current) {
      dream2Ref.current.rotation.y -= delta * 0.15;          
      dream2Ref.current.rotation.y -= scrollDelta * 2;
    }
    if (dream3Ref.current) {
      dream3Ref.current.rotation.y += delta * 0.2;           
      dream3Ref.current.rotation.y += scrollDelta * 2.5;
    }

    if (starsRef.current) {
      starsRef.current.position.z += (delta * 1.5) + (scrollDelta * 50);

      if (starsRef.current.position.z > 80) {
        starsRef.current.position.z = 0;
      }
    }
  });

  return (
    <group>
      <group position={[3, -2, -15]} ref={dream1Ref}>
        <Float speed={2} rotationIntensity={0} floatIntensity={1}>
          <primitive object={dream1Tree.scene} />
          <pointLight color="#fca5a5" intensity={5} distance={20} />
        </Float>
      </group>

      <group position={[-3, 0, -40]} ref={dream2Ref}>
        <Float speed={2} rotationIntensity={0} floatIntensity={2}>
          <primitive object={dream2Crystal.scene} scale={2} />
          <pointLight color="#86efac" intensity={10} distance={20} />
        </Float>
      </group>

      <group position={[3, 0, -65]} ref={dream3Ref}>
        <Float speed={1.5} rotationIntensity={0} floatIntensity={1}>
          <primitive object={dream3Crystal.scene} scale={1.5} />
          <pointLight color="#93c5fd" intensity={10} distance={30} />
        </Float>
      </group>

      <points ref={starsRef}>
        <bufferGeometry>
          {/* FIX 2: Passed the array and itemSize through the args array */}
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.6} sizeAttenuation={true} />
      </points>
    </group>
  );
}