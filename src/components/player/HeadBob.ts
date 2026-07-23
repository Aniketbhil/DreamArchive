export class HeadBob {
  getOffset(
    elapsed: number,
    walking: boolean
  ) {
    if (!walking) {
      return {
        x: 0,
        y: 0,
        roll: 0,
      };
    }

    return {
      // Almost unnoticeable side sway
      x: Math.sin(elapsed * 2.5) * 0.003,

      // Very subtle vertical movement
      y: Math.sin(elapsed * 5) * 0.006,

      // Almost no roll
      roll: Math.sin(elapsed * 2.5) * 0.0003,
    };
  }
}