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
  // FIX: We need 'scene' to shoot our raycaster against your 3D models
  const { camera, scene } = useThree();

  const headBob = useMemo(() => new HeadBob(), []);
  const mouseLookRef = useRef<MouseLook | null>(null);

  // Raycaster tools
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const downVector = useMemo(() => new THREE.Vector3(0, -1, 0), []);

  const keys = useRef({ w: false, a: false, s: false, d: false, space: false });
  const velocity = useRef(new THREE.Vector3());
  const mouseState = useRef({ yaw: 0, pitch: 0 });

  const yVelocity = useRef(0);
  const isGrounded = useRef(true);
  const playerHeight = spawn.y; // Standard height based on your spawn point

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
      if (key === " ") keys.current.space = true; 
      if (keys.current.hasOwnProperty(key)) keys.current[key as keyof typeof keys.current] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === " ") keys.current.space = false; 
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

    // 2. DYNAMIC RAYCAST COLLISION
    // Shoot an invisible laser down from the camera to detect the physical models
    raycaster.set(camera.position, downVector);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Default floor is WAY down there (so you fall into the void if you miss a jump)
    let groundY = -1000; 
    if (intersects.length > 0) {
      groundY = intersects[0].point.y; 
    }
    const targetY = groundY + playerHeight;

    // 3. Apply Jump Trigger
    if (keys.current.space && isGrounded.current) {
      yVelocity.current = 10; 
      isGrounded.current = false;
    }

    // 4. Apply Gravity
    yVelocity.current -= 25 * safeDelta; 
    camera.position.y += yVelocity.current * safeDelta;

    // 5. Landing Logic
    if (camera.position.y <= targetY && yVelocity.current <= 0) {
      // Only snap to the floor if the floor is close beneath us (prevents snapping to ceilings)
      if (targetY - camera.position.y < 2) {
        camera.position.y = targetY; 
        yVelocity.current = 0;                
        isGrounded.current = true;
      }
    } else {
      isGrounded.current = false;
    }

    // 6. Void Respawn (If you fall off the platforms)
    if (camera.position.y < -15) {
      camera.position.copy(spawn);
      yVelocity.current = 0;
    }

    if (constrainBounds) {
      constrainBounds(camera.position);
    }

    if (mouseLookRef.current) {
      mouseLookRef.current.update(mouseState.current, safeDelta);
    }

    camera.rotation.set(mouseState.current.pitch, mouseState.current.yaw, 0, "YXZ");

    const isWalking = velocity.current.lengthSq() > 1 && isGrounded.current;
    const bob = headBob.getOffset(state.clock.elapsedTime, isWalking);

    camera.rotateZ(bob.roll);
  });

  return null;
}