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

  const keys = useRef({ w: false, a: false, s: false, d: false });
  const velocity = useRef(new THREE.Vector3());

  const mouseState = useRef({ yaw: 0, pitch: 0 });

  const WALK_SPEED = 95;

  useEffect(() => {
    camera.position.copy(spawn);

    camera.lookAt(target);
    const initialEuler = new THREE.Euler().setFromQuaternion(
      camera.quaternion,
      "YXZ",
    );

    mouseLook.targetYaw = initialEuler.y;
    mouseLook.targetPitch = initialEuler.x;
    mouseState.current.yaw = initialEuler.y;
    mouseState.current.pitch = initialEuler.x;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key))
        keys.current[key as keyof typeof keys.current] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key))
        keys.current[key as keyof typeof keys.current] = false;
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

    const safeDelta = Math.min(delta, 0.1);

    const currentForward = new THREE.Vector3(0, 0, -1).applyEuler(
      new THREE.Euler(0, mouseState.current.yaw, 0),
    );
    const currentRight = new THREE.Vector3(1, 0, 0).applyEuler(
      new THREE.Euler(0, mouseState.current.yaw, 0),
    );

    const moveDir = new THREE.Vector3();
    if (keys.current.w) moveDir.add(currentForward);
    if (keys.current.s) moveDir.sub(currentForward);
    if (keys.current.a) moveDir.sub(currentRight);
    if (keys.current.d) moveDir.add(currentRight);

    if (moveDir.lengthSq() > 0) moveDir.normalize();

    const targetVelocity = moveDir.multiplyScalar(WALK_SPEED);

    const moveLerpFactor = 1 - Math.exp(-7 * safeDelta);
    velocity.current.lerp(targetVelocity, moveLerpFactor);

    camera.position.addScaledVector(velocity.current, safeDelta);
    camera.position.y = spawn.y;

    mouseLook.update(mouseState.current, safeDelta);

    camera.rotation.set(
      mouseState.current.pitch,
      mouseState.current.yaw,
      0,
      "YXZ",
    );

    const isWalking = velocity.current.lengthSq() > 1;
    const bob = headBob.getOffset(state.clock.elapsedTime, isWalking);

    camera.rotateZ(bob.roll);

    const flatCamera = new THREE.Vector2(camera.position.x, camera.position.z);
    const flatTarget = new THREE.Vector2(target.x, target.z);

    if (flatCamera.distanceTo(flatTarget) < 18 && !reached.current) {
      reached.current = true;
      onReachedCrystal?.();
    }
  });

  return null;
}
