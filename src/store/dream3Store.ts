import { create } from "zustand";

interface Dream3State {
  mirrorsAligned: boolean[]; 
  isUnlocked: boolean;
  message: string;
  toggleMirror: (index: number) => void;
  reset: () => void;
}

export const useDream3Store = create<Dream3State>((set, get) => ({
  mirrorsAligned: [false, false, false, false],
  isUnlocked: false,
  message: "Objective: Align the 4 mirrors to unlock the crystal",
  
  toggleMirror: (index) => {
    const currentAlignments = [...get().mirrorsAligned];
    currentAlignments[index] = !currentAlignments[index]; 
    
    // Check if ALL 4 mirrors are now aligned
    const allAligned = currentAlignments.every((isAligned) => isAligned === true);
    
    set({
      mirrorsAligned: currentAlignments,
      isUnlocked: allAligned,
      message: allAligned 
        ? "Crystal Unlocked! Interact with it to finish." 
        : `Mirrors Aligned: ${currentAlignments.filter(Boolean).length} / 4`
    });
  },

  reset: () => set({
    mirrorsAligned: [false, false, false, false],
    isUnlocked: false,
    message: "Objective: Align the 4 mirrors to unlock the crystal"
  })
}));