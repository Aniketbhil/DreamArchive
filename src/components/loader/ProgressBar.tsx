import { motion } from "framer-motion";

interface Props {
  progress: number;
}

export default function ProgressBar({
  progress,
}: Props) {
  return (
    <div
      style={{
        width: 340,
        height: 2,
        background: "#202020",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{
          width: `${progress}%`,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        style={{
          height: "100%",
          background: "white",
        }}
      />
    </div>
  );
}