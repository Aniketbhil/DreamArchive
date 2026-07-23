import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { AutoWalk } from "./AutoWalk";
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

  const autoWalk = useMemo(() => new AutoWalk(18, 18), []);
  const mouseLook = useMemo(() => new MouseLook(), []);
  const headBob = useMemo(() => new HeadBob(), []);

  const reached = useRef(false);

  const walkState = useRef({
    speed: 0,
    stopped: false,
  });

  const mouseState = useRef({
    yaw: 0,
    pitch: 0,
  });

  const direction = useRef(new THREE.Vector3());

  const lookTarget = useRef(new THREE.Vector3());

  const LOOK_DISTANCE = 100;

  useEffect(() => {
    camera.position.copy(spawn);

    direction.current
      .subVectors(target, spawn)
      .setY(0)
      .normalize();

    lookTarget.current
      .copy(camera.position)
      .add(
        direction.current
          .clone()
          .multiplyScalar(LOOK_DISTANCE)
      );

    camera.lookAt(lookTarget.current);

    return () => {
      mouseLook.dispose();
    };
  }, [camera, spawn, target, mouseLook]);

  useFrame((state, delta) => {
    if (!started) return;

    direction.current = autoWalk.update(
      camera.position,
      target,
      delta,
      walkState.current
    );

    // Keep camera at constant eye height
    camera.position.y = spawn.y;

    mouseLook.update(mouseState.current, delta);

    const bob = headBob.getOffset(
      state.clock.elapsedTime,
      walkState.current.speed > 0.5
    );

    const desiredLookTarget = camera.position
      .clone()
      .add(
        direction.current
          .clone()
          .multiplyScalar(LOOK_DISTANCE)
      );

    desiredLookTarget.x +=
      mouseState.current.yaw + bob.x;

    desiredLookTarget.y =
      spawn.y +
      mouseState.current.pitch +
      bob.y;

    lookTarget.current.lerp(
      desiredLookTarget,
      delta * 5
    );

    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      bob.roll,
      6,
      delta
    );

    camera.lookAt(lookTarget.current);

    if (
      walkState.current.stopped &&
      !reached.current
    ) {
      reached.current = true;
      onReachedCrystal?.();
    }
  });

  return null;
}