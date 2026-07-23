import { useEffect, useState } from "react";

const dots = ["", ".", "..", "..."];

export default function LoadingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % dots.length);
    }, 450);

    return () => clearInterval(timer);
  }, []);

  return (
    <p
      style={{
        color: "#CFCFCF",
        letterSpacing: "4px",
        fontSize: "14px",
      }}
    >
      Loading{dots[index]}
    </p>
  );
}