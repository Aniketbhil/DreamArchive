import * as THREE from "three";

export interface MouseState {
  yaw: number;
  pitch: number;
}

export class MouseLook {
  private isDragging = false;

  public targetYaw = 0;
  public targetPitch = 0;

  private previousMouse = {
    x: 0,
    y: 0,
  };

  constructor() {
    document.addEventListener("pointerdown", this.onPointerDown);
    document.addEventListener("pointerup", this.onPointerUp);
    document.addEventListener("pointermove", this.onPointerMove);

    document.addEventListener("contextmenu", this.onContextMenu);

    // If the browser loses focus while dragging
    window.addEventListener("blur", this.onPointerUp);
  }

  dispose() {
    document.removeEventListener("pointerdown", this.onPointerDown);
    document.removeEventListener("pointerup", this.onPointerUp);
    document.removeEventListener("pointermove", this.onPointerMove);

    document.removeEventListener("contextmenu", this.onContextMenu);

    window.removeEventListener("blur", this.onPointerUp);
  }

  private onContextMenu = (e: Event) => {
    e.preventDefault();
  };

  private onPointerDown = (e: PointerEvent) => {
    // Only Left or Right Mouse Button
    if (e.button !== 0 && e.button !== 2) return;

    this.isDragging = true;

    this.previousMouse.x = e.clientX;
    this.previousMouse.y = e.clientY;
  };

  private onPointerUp = () => {
    this.isDragging = false;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;

    let movementX = e.movementX;
    let movementY = e.movementY;

    // Browser fallback
    if (movementX === 0 && movementY === 0) {
      movementX = e.clientX - this.previousMouse.x;
      movementY = e.clientY - this.previousMouse.y;
    }

    this.previousMouse.x = e.clientX;
    this.previousMouse.y = e.clientY;

    const sensitivity = 0.003;

    this.targetYaw -= movementX * sensitivity;
    this.targetPitch -= movementY * sensitivity;

    const limit = Math.PI / 2 - 0.05;

    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch, -limit, limit);
  };

  update(state: MouseState, delta: number) {
    state.yaw = THREE.MathUtils.damp(state.yaw, this.targetYaw, 20, delta);

    state.pitch = THREE.MathUtils.damp(
      state.pitch,
      this.targetPitch,
      20,
      delta,
    );
  }
}
