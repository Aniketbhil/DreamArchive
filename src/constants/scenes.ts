export const SCENES = {
  LOADER: "LOADER",
  ARCHIVE: "ARCHIVE",
  DREAM1: "DREAM1",
  DREAM2: "DREAM2",
  DREAM3: "DREAM3", // This tells the game that Dream 3 officially exists!
} as const;

export type Scene = (typeof SCENES)[keyof typeof SCENES];