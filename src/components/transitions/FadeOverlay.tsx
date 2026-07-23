import { motion, AnimatePresence } from "framer-motion";

import { useFadeStore } from "../../store/fadeStore";

export default function FadeOverlay() {
  const visible = useFadeStore(
    (s) => s.visible
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 1.8,
            ease: "easeInOut",
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
    </AnimatePresence>
  );
}