import * as THREE from "three";

export interface MouseState {
  yaw: number;
  pitch: number;
}

export class MouseLook {
  private mouse = {
    x: 0,
    y: 0,
  };

  constructor() {
    window.addEventListener(
      "mousemove",
      this.onMouseMove
    );
  }

  dispose() {
    window.removeEventListener(
      "mousemove",
      this.onMouseMove
    );
  }

  private onMouseMove = (
    event: MouseEvent
  ) => {
    this.mouse.x =
      (event.clientX / window.innerWidth - 0.5) * 2;

    this.mouse.y =
      (event.clientY / window.innerHeight - 0.5) * 2;
  };

  update(
    state: MouseState,
    delta: number
  ) {
    state.yaw = THREE.MathUtils.damp(
      state.yaw,
      this.mouse.x * 0.18,
      6,
      delta
    );

    state.pitch = THREE.MathUtils.damp(
      state.pitch,
      this.mouse.y * 0.08,
      6,
      delta
    );
  }
}