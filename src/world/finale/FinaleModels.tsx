import { useGLTF, Float, useScroll } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FinaleModels() {
  // Main Memories
  const dream1Tree = useGLTF("/models/dream1/Final_Dream1_AllIsland_RocksTrees.glb"); 
  const dream2Crystal = useGLTF("/models/dream2/Dream2_Crystal.glb");
  const dream3Crystal = useGLTF("/models/dream3/Dream3_Crystal_withCover.glb");
  
  // NEW: Filler Models for the empty gaps
  const runes = useGLTF("/models/dream3/Dream3_Data_Runes.glb");
  const laserBase = useGLTF("/models/dream3/Dream3_LazerBeam_and_EventHorizon.glb");

  const scroll = useScroll();
  const dream1Ref = useRef<THREE.Group>(null);
  const dream2Ref = useRef<THREE.Group>(null);
  const dream3Ref = useRef<THREE.Group>(null);
  
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  // Refs for the new fillers
  const runesRef = useRef<THREE.Group>(null);
  const laserBaseRef = useRef<THREE.Group>(null);
  
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

    // Make the filler runes glow purple and wireframe for a cool data effect!
    runes.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#c084fc", emissive: "#9333ea", emissiveIntensity: 1.5, wireframe: true
        });
      }
    });

    // Make the laser base glow blue
    laserBase.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#60a5fa", emissive: "#3b82f6", emissiveIntensity: 2
        });
      }
    });
  }, [dream2Crystal.scene, dream3Crystal.scene, runes.scene, laserBase.scene]);

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
    
    // Rotate fillers
    if (runesRef.current) runesRef.current.rotation.y += delta * 0.5;
    if (laserBaseRef.current) laserBaseRef.current.rotation.y -= delta * 0.3;

    if (ring1Ref.current) ring1Ref.current.rotation.z -= delta * 0.2;
    if (ring2Ref.current) ring2Ref.current.rotation.z += delta * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.z -= delta * 0.4;

    if (starsRef.current) {
      starsRef.current.position.z += (delta * 1.5) + (scrollDelta * 50);
      if (starsRef.current.position.z > 80) starsRef.current.position.z = 0;
    }
  });

  return (
    <group>
      {/* ================= NEW: THE LASER HIGHWAY ================= */}
      {/* These massive glowing rails run under the entire scene to give it structure */}
      <mesh position={[-6, -4, -40]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 120, 8]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={3} />
      </mesh>
      <mesh position={[6, -4, -40]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 120, 8]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={3} />
      </mesh>


      {/* ================= DREAM 1 ================= */}
      <group position={[0, 0, -18]}>
        <mesh ref={ring1Ref}>
          <ringGeometry args={[6, 7, 32]} />
          <meshBasicMaterial color="#fca5a5" side={THREE.DoubleSide} transparent opacity={0.3} wireframe />
        </mesh>
      </group>
      <group position={[3, -2, -15]} ref={dream1Ref}>
        <Float speed={2} rotationIntensity={0} floatIntensity={1}>
          <primitive object={dream1Tree.scene} />
          <pointLight color="#fca5a5" intensity={5} distance={20} />
        </Float>
      </group>


      {/* ================= NEW: GAP FILLER 1 (Z: -28) ================= */}
      {/* Fills the empty space you see in the screenshot! */}
      <group position={[0, -5, -28]} ref={runesRef}>
        <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
          <primitive object={runes.scene} scale={1.5} />
          <pointLight color="#c084fc" intensity={3} distance={15} />
        </Float>
      </group>


      {/* ================= DREAM 2 ================= */}
      <group position={[0, 0, -45]}>
        <mesh ref={ring2Ref}>
          <ringGeometry args={[8, 9, 32]} />
          <meshBasicMaterial color="#86efac" side={THREE.DoubleSide} transparent opacity={0.3} wireframe />
        </mesh>
      </group>
      <group position={[-3, 0, -40]} ref={dream2Ref}>
        <Float speed={2} rotationIntensity={0} floatIntensity={2}>
          <primitive object={dream2Crystal.scene} scale={2} />
          <pointLight color="#86efac" intensity={10} distance={20} />
        </Float>
      </group>


      {/* ================= NEW: GAP FILLER 2 (Z: -54) ================= */}
      {/* Fills the gap between Dream 2 and Dream 3 */}
      <group position={[0, -8, -54]} ref={laserBaseRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <primitive object={laserBase.scene} scale={2.5} />
          <pointLight color="#3b82f6" intensity={4} distance={20} />
        </Float>
      </group>


      {/* ================= DREAM 3 ================= */}
      <group position={[0, 0, -70]}>
        <mesh ref={ring3Ref}>
          <ringGeometry args={[10, 11, 32]} />
          <meshBasicMaterial color="#93c5fd" side={THREE.DoubleSide} transparent opacity={0.4} wireframe />
        </mesh>
      </group>
      <group position={[3, 0, -65]} ref={dream3Ref}>
        <Float speed={1.5} rotationIntensity={0} floatIntensity={1}>
          <primitive object={dream3Crystal.scene} scale={1.5} />
          <pointLight color="#93c5fd" intensity={10} distance={30} />
        </Float>
      </group>


      {/* ================= THE STARS ================= */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.6} sizeAttenuation={true} />
      </points>
    </group>
  );
}

// Preload the new models just to be safe!
useGLTF.preload("/models/dream3/Dream3_Data_Runes.glb");
useGLTF.preload("/models/dream3/Dream3_LazerBeam_and_EventHorizon.glb");