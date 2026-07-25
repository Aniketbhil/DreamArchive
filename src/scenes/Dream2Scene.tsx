import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import FadeOverlay from "../components/transitions/FadeOverlay";

export default function Dream2Scene() {
  return (
    <>
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
        <color attach="background" args={["#2a0a14"]} /> {/* Dark red background */}
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Text fontSize={1.5} color="#fca5a5" position={[0, 2, 0]} letterSpacing={0.2}>
          WELCOME TO DREAM 2
        </Text>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1a050a" />
        </mesh>
      </Canvas>

      <FadeOverlay />
    </>
  );
}