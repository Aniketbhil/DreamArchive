export const SCENES = {
  LOADER: "loader",

  ARCHIVE: "archive",

  DREAM1: "dream1",

  DREAM2: "dream2",

  DREAM3: "dream3",

  CREDITS: "credits",
} as const;

export type SceneName =
  (typeof SCENES)[keyof typeof SCENES];