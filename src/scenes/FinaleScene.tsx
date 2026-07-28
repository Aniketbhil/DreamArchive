import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import FadeOverlay from "../components/transitions/FadeOverlay";
import PostProcessing from "../components/effects/PostProcessing";

export default function FinaleScene() {
  return (
    <>
      <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 45, near: 0.1, far: 5000, position: [0, 2, 10] }}>
        <color attach="background" args={["#000000"]} />
        
        <ambientLight intensity={1} />
        <directionalLight intensity={2} position={[10, 20, 10]} />

        <ScrollControls pages={4} damping={0.2}>
          
          {/* SECTION 1: The 3D World */}
          <Scroll>
            {/* We will add models here next */}
          </Scroll>

          {/* SECTION 2: The HTML Overlay */}
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

            <div style={{ position: "absolute", top: "320vh", width: "100vw", textAlign: "center", color: "white" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "300", color: "#93c5fd" }}>DREAM 3: THE ALIGNMENT</h2>
              <p style={{ fontSize: "1rem", color: "#9ca3af", marginTop: "1rem", marginBottom: "4rem" }}>The cosmic puzzle solved.</p>
              
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Created by Aniket</h3>
              <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "1rem" }}>Thank you for playing.</p>
            </div>

          </Scroll>
        </ScrollControls>

        <PostProcessing />
      </Canvas>

      <FadeOverlay />
    </>
  );
}