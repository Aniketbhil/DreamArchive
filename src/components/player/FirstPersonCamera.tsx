import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { MouseLook } from "./MouseLook";
import { HeadBob } from "./HeadBob";

interface Props {
  spawn: THREE.Vector3;
  target: THREE.Vector3;
  started: boolean;
  walkSpeed?: number;
  constrainBounds?: (pos: THREE.Vector3) => void;
}

export default function FirstPersonCamera({
  spawn,
  target,
  started,
  walkSpeed = 95,
  constrainBounds,
}: Props) {
  const { camera } = useThree();

  const headBob = useMemo(() => new HeadBob(), []);
  const mouseLookRef = useRef<MouseLook | null>(null);

  // ADDED: "space" to our keyboard tracker
  const keys = useRef({ w: false, a: false, s: false, d: false, space: false });
  const velocity = useRef(new THREE.Vector3());
  const mouseState = useRef({ yaw: 0, pitch: 0 });

  // ADDED: Jump & Gravity variables
  const initialY = useRef(spawn.y);
  const yVelocity = useRef(0);
  const isGrounded = useRef(true);

  useEffect(() => {
    const mouseLook = new MouseLook();
    mouseLookRef.current = mouseLook;

    camera.position.copy(spawn);
    camera.lookAt(target);
    const initialEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");

    mouseLook.targetYaw = initialEuler.y;
    mouseLook.targetPitch = initialEuler.x;
    mouseState.current.yaw = initialEuler.y;
    mouseState.current.pitch = initialEuler.x;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === " ") keys.current.space = true; // Map Spacebar
      if (keys.current.hasOwnProperty(key)) keys.current[key as keyof typeof keys.current] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === " ") keys.current.space = false; // Map Spacebar
      if (keys.current.hasOwnProperty(key)) keys.current[key as keyof typeof keys.current] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      mouseLook.dispose();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    const targetVelocity = moveDir.multiplyScalar(walkSpeed);
    const moveLerpFactor = 1 - Math.exp(-7 * safeDelta);
    velocity.current.lerp(targetVelocity, moveLerpFactor);

    // 1. Apply X and Z walking movement
    camera.position.addScaledVector(velocity.current, safeDelta);

    // 2. Apply Jump Trigger
    if (keys.current.space && isGrounded.current) {
      yVelocity.current = 10; // Jump force (how high you go)
      isGrounded.current = false;
    }

    // 3. Apply Gravity
    yVelocity.current -= 25 * safeDelta; // Gravity strength (how fast you fall)
    camera.position.y += yVelocity.current * safeDelta;

    // 4. Ground Collision Check
    if (camera.position.y <= initialY.current) {
      camera.position.y = initialY.current; // Snap to the floor
      yVelocity.current = 0;                // Stop falling
      isGrounded.current = true;            // Allow jumping again
    }

    if (constrainBounds) {
      constrainBounds(camera.position);
    }

    if (mouseLookRef.current) {
      mouseLookRef.current.update(mouseState.current, safeDelta);
    }

    camera.rotation.set(mouseState.current.pitch, mouseState.current.yaw, 0, "YXZ");

    // Only apply head bobbing if we are actually walking on the ground
    const isWalking = velocity.current.lengthSq() > 1 && isGrounded.current;
    const bob = headBob.getOffset(state.clock.elapsedTime, isWalking);

    camera.rotateZ(bob.roll);
  });

  return null;
}