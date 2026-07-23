import { motion } from "framer-motion";

import LoadingText from "./LoadingText";
import ProgressBar from "./ProgressBar";

interface Props {
  progress: number;
}

export default function LoaderOverlay({
  progress,
}: Props) {
  const message =
    progress < 25
      ? "Initializing World..."
      : progress < 50
      ? "Loading Archive..."
      : progress < 75
      ? "Preparing Dreams..."
      : progress < 100
      ? "Almost Ready..."
      : "Welcome";

  return (
    <motion.div
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      style={{
        position: "fixed",
        inset: 0,
        background:
          "linear-gradient(180deg,#050505 0%,#0a0b13 50%,#050505 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        animate={{
          opacity: [0.45, 0.7, 0.45],
          scale: [1, 1.03, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          background:
            "radial-gradient(circle, rgba(90,100,255,.08), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          width: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <h1
          style={{
            color: "white",
            fontWeight: 200,
            letterSpacing: "10px",
            fontSize: 52,
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          DREAM
          <br />
          ARCHIVE
        </h1>

        <p
          style={{
            color: "#bfbfbf",
            fontStyle: "italic",
            letterSpacing: "2px",
          }}
        >
          Every dream leaves behind a memory.
        </p>

        <LoadingText />

        <ProgressBar progress={progress} />

        <p
          style={{
            color: "#888",
            letterSpacing: "2px",
          }}
        >
          {message}
        </p>

        <p
          style={{
            color: "#DDD",
            letterSpacing: "4px",
          }}
        >
          {Math.floor(progress)}%
        </p>
      </div>
    </motion.div>
  );
}