import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { MouseLook } from "./MouseLook";
import { HeadBob } from "./HeadBob";

interface Props {
  spawn: THREE.Vector3;
  target: THREE.Vector3;
  started: boolean;
  walkSpeed?: number; // NEW: Custom speed for each level
  constrainBounds?: (pos: THREE.Vector3) => void; // NEW: Invisible walls function
}

export default function FirstPersonCamera({
  spawn,
  target,
  started,
  walkSpeed = 95, // Default fallback
  constrainBounds,
}: Props) {
  const { camera } = useThree();

  const headBob = useMemo(() => new HeadBob(), []);
  const mouseLookRef = useRef<MouseLook | null>(null);
  const spawnRef = useRef(spawn);
  const targetRef = useRef(target);

  const keys = useRef({ w: false, a: false, s: false, d: false });
  const velocity = useRef(new THREE.Vector3());
  const mouseState = useRef({ yaw: 0, pitch: 0 });

  useEffect(() => {
    spawnRef.current = spawn;
    targetRef.current = target;
  }, [spawn, target]);

  useEffect(() => {
    const mouseLook = new MouseLook();
    mouseLookRef.current = mouseLook;

    camera.position.copy(spawnRef.current);
    camera.lookAt(targetRef.current);
    const initialEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");

    mouseLook.targetYaw = initialEuler.y;
    mouseLook.targetPitch = initialEuler.x;
    mouseState.current.yaw = initialEuler.y;
    mouseState.current.pitch = initialEuler.x;

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
  }, [camera]);

  useFrame((state, delta) => {
    if (!started) return;

    const safeDelta = Math.min(delta, 0.1);

    const currentForward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, mouseState.current.yaw, 0));
    const currentRight = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, mouseState.current.yaw, 0));

    const moveDir = new THREE.Vector3();
    if (keys.current.w) moveDir.add(currentForward);
    if (keys.current.s) moveDir.sub(currentForward);
    if (keys.current.a) moveDir.sub(currentRight);
    if (keys.current.d) moveDir.add(currentRight);

    if (moveDir.lengthSq() > 0) moveDir.normalize();

    // 1. Use the custom speed
    const targetVelocity = moveDir.multiplyScalar(walkSpeed);
    const moveLerpFactor = 1 - Math.exp(-7 * safeDelta);
    velocity.current.lerp(targetVelocity, moveLerpFactor);

    camera.position.addScaledVector(velocity.current, safeDelta);
    camera.position.y = spawn.y;

    // 2. Apply Invisible Walls if the level provides them
    if (constrainBounds) {
      constrainBounds(camera.position);
    }

    if (mouseLookRef.current) {
      mouseLookRef.current.update(mouseState.current, safeDelta);
    }

    camera.rotation.set(mouseState.current.pitch, mouseState.current.yaw, 0, "YXZ");

    const isWalking = velocity.current.lengthSq() > 1;
    const bob = headBob.getOffset(state.clock.elapsedTime, isWalking);

    camera.rotateZ(bob.roll);
  });

  return null;
}