import * as THREE from "three";

export interface AutoWalkState {
  speed: number;
  stopped: boolean;
}

export class AutoWalk {
  private walkSpeed: number;
  private stopDistance: number;

  constructor(
    walkSpeed = 18,
    stopDistance = 18
  ) {
    this.walkSpeed = walkSpeed;
    this.stopDistance = stopDistance;
  }

  update(
    cameraPosition: THREE.Vector3,
    target: THREE.Vector3,
    delta: number,
    state: AutoWalkState
  ) {
    const flatCamera = new THREE.Vector2(
      cameraPosition.x,
      cameraPosition.z
    );

    const flatTarget = new THREE.Vector2(
      target.x,
      target.z
    );

    const distance = flatCamera.distanceTo(flatTarget);

    const targetSpeed =
      distance > this.stopDistance
        ? this.walkSpeed
        : 0;

    state.speed = THREE.MathUtils.damp(
      state.speed,
      targetSpeed,
      4,
      delta
    );

    if (distance <= this.stopDistance + 0.5) {
      state.stopped = true;
    }

    const direction = new THREE.Vector3(
      target.x - cameraPosition.x,
      0,
      target.z - cameraPosition.z
    ).normalize();

    cameraPosition.addScaledVector(
      direction,
      state.speed * delta
    );

    return direction;
  }
}