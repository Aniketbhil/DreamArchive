import { create } from "zustand";

interface Dream3State {
  mirrorsAligned: boolean[]; 
  isUnlocked: boolean;
  message: string;
  transitioning: boolean; // NEW: Tracks the final click
  toggleMirror: (index: number) => void;
  startTransition: () => void; // NEW: Triggers the fade out
  reset: () => void;
}

export const useDream3Store = create<Dream3State>((set, get) => ({
  mirrorsAligned: [false, false, false, false],
  isUnlocked: false,
  message: "Objective: Align the 4 mirrors to unlock the crystal",
  transitioning: false,
  
  toggleMirror: (index) => {
    const currentAlignments = [...get().mirrorsAligned];
    currentAlignments[index] = !currentAlignments[index]; 
    
    const allAligned = currentAlignments.every((isAligned) => isAligned === true);
    
    set({
      mirrorsAligned: currentAlignments,
      isUnlocked: allAligned,
      message: allAligned 
        ? "Crystal Unlocked! Interact with it to finish." 
        : `Mirrors Aligned: ${currentAlignments.filter(Boolean).length} / 4`
    });
  },

  startTransition: () => set({ transitioning: true }),

  reset: () => set({
    mirrorsAligned: [false, false, false, false],
    isUnlocked: false,
    message: "Objective: Align the 4 mirrors to unlock the crystal",
    transitioning: false
  })
}));