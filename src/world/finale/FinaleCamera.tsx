import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

export default function FinaleCamera() {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    // scroll.offset is 0 at the top of the page, and 1 at the bottom.
    // We smoothly move the camera from Z: 5 (start) all the way to Z: -80 (past the final crystal)
    const targetZ = THREE.MathUtils.lerp(5, -80, scroll.offset);
    
    // Move the camera
    camera.position.z = targetZ;

    // Keep the camera looking straight ahead down the tunnel
    camera.lookAt(0, 2, targetZ - 10);
  });

  return null;
}