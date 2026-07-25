import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { MouseLook } from "./MouseLook";
import { HeadBob } from "./HeadBob";

interface Props {
  spawn: THREE.Vector3;
  target: THREE.Vector3;
  started: boolean;
  onReachedCrystal?: () => void;
}

export default function FirstPersonCamera({
  spawn,
  target,
  started,
  onReachedCrystal,
}: Props) {
  const { camera } = useThree();

  const mouseLook = useMemo(() => new MouseLook(), []);
  const headBob = useMemo(() => new HeadBob(), []);

  const reached = useRef(false);

  // 1. Track keyboard state for WASD
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const velocity = useRef(new THREE.Vector3());
  
  const mouseState = useRef({
    yaw: 0,
    pitch: 0,
  });

  const forwardDir = useRef(new THREE.Vector3());
  const rightDir = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  const LOOK_DISTANCE = 100;
  const WALK_SPEED = 20; // Adjust this to walk faster or slower

  useEffect(() => {
    camera.position.copy(spawn);

    // Calculate the base forward path to the crystal
    forwardDir.current.subVectors(target, spawn).setY(0).normalize();
    
    // Calculate the left/right strafe direction
    rightDir.current.copy(forwardDir.current).cross(new THREE.Vector3(0, 1, 0)).normalize();

    // Keyboard Event Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) keys.current[key as keyof typeof keys.current] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) keys.current[key as keyof typeof keys.current] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      mouseLook.dispose();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [camera, spawn, target, mouseLook]);

  useFrame((state, delta) => {
    if (!started || reached.current) return;

    // 2. Calculate Manual Movement Direction
    const moveDir = new THREE.Vector3();
    if (keys.current.w) moveDir.add(forwardDir.current);
    if (keys.current.s) moveDir.sub(forwardDir.current);
    if (keys.current.a) moveDir.add(rightDir.current);
    if (keys.current.d) moveDir.sub(rightDir.current);
    
    if (moveDir.lengthSq() > 0) moveDir.normalize();

    // Smooth acceleration and deceleration
    velocity.current.lerp(moveDir.multiplyScalar(WALK_SPEED), delta * 10);

    // Apply movement
    camera.position.addScaledVector(velocity.current, delta);
    camera.position.y = spawn.y; // Keep height locked to the ground

    // 3. Handle Mouse Sway and Head Bob
    mouseLook.update(mouseState.current, delta);
    
    const isWalking = velocity.current.lengthSq() > 1;
    const bob = headBob.getOffset(state.clock.elapsedTime, isWalking);

    // 4. Update Camera Look Target
    const desiredLookTarget = camera.position
      .clone()
      .add(forwardDir.current.clone().multiplyScalar(LOOK_DISTANCE));

    desiredLookTarget.x += mouseState.current.yaw + bob.x;
    desiredLookTarget.y = spawn.y + mouseState.current.pitch + bob.y;

    lookTarget.current.lerp(desiredLookTarget, delta * 5);

    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      bob.roll,
      6,
      delta
    );

    camera.lookAt(lookTarget.current);

    // 5. Check Manual Distance to Crystal (Trigger Ending)
    const flatCamera = new THREE.Vector2(camera.position.x, camera.position.z);
    const flatTarget = new THREE.Vector2(target.x, target.z);

    // If the player walks within 18 units of the crystal, trigger the transition
    if (flatCamera.distanceTo(flatTarget) < 18 && !reached.current) {
      reached.current = true;
      onReachedCrystal?.();
    }
  });

  return null;
}