import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import FadeOverlay from "../components/transitions/FadeOverlay";
import PostProcessing from "../components/effects/PostProcessing";

import FinaleModels from "../world/finale/FinaleModels"; 
import FinaleCamera from "../world/finale/FinaleCamera"; 

export default function FinaleScene() {
  
  // NEW: A function to completely restart the game experience
  const handleWakeUp = () => {
    // Fades out and hard reloads the window to guarantee a clean slate
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 2s ease-in-out";
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 45, near: 0.1, far: 5000, position: [0, 2, 5] }}>
        <color attach="background" args={["#030712"]} /> 
        
        <ambientLight intensity={0.2} />
        <directionalLight intensity={1} position={[10, 20, 10]} />

        <ScrollControls pages={4} damping={0.2}>
          <FinaleCamera />

          <Scroll>
            <FinaleModels />
          </Scroll>

          <Scroll html style={{ width: "100%", height: "100%" }}>
            
            <div style={{ position: "absolute", top: "20vh", width: "100vw", textAlign: "center", color: "white" }}>
              <h1 style={{ fontSize: "4rem", letterSpacing: "4px", fontWeight: "300", marginBottom: "1rem" }}>THE DREAM ARCHIVE</h1>
              <p style={{ fontSize: "1.2rem", color: "#9ca3af" }}>A journey through the subconscious</p>
            </div>

            <div style={{ position: "absolute", top: "120vh", width: "100vw", textAlign: "center", color: "white" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "300", color: "#fca5a5" }}>DREAM 1: THE AWAKENING</h2>
              <p style={{ fontSize: "1rem", color: "#9ca3af", marginTop: "1rem" }}>Where the feathers fell...</p>
            </div>

            <div style={{ position: "absolute", top: "220vh", width: "100vw", textAlign: "center", color: "white" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "300", color: "#86efac" }}>DREAM 2: THE REFLECTION</h2>
              <p style={{ fontSize: "1rem", color: "#9ca3af", marginTop: "1rem" }}>The key hidden in the waters...</p>
            </div>

            <div style={{ position: "absolute", top: "320vh", width: "100vw", textAlign: "center", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "300", color: "#93c5fd" }}>DREAM 3: THE ALIGNMENT</h2>
              <p style={{ fontSize: "1rem", color: "#9ca3af", marginTop: "1rem", marginBottom: "4rem" }}>The cosmic puzzle solved.</p>
              
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Created by Aniket & Krehant</h3>
              <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "1rem", marginBottom: "3rem" }}>Thank you for playing.</p>

              {/* NEW: Interactive Wake Up Button */}
              <button 
                onClick={handleWakeUp}
                style={{
                  padding: "12px 32px",
                  fontSize: "1.2rem",
                  letterSpacing: "2px",
                  color: "#ffffff",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.8)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
              >
                Wake Up
              </button>
            </div>

          </Scroll>
        </ScrollControls>

        <PostProcessing />
      </Canvas>

      <FadeOverlay />
    </>
  );
}