import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDream2Store } from "../../store/dream2Store";
import GreenParticles from "./GreenParticles";

export default function Dream2Models() {
  const lanterns = useGLTF("/models/dream2/Dream2_AllLanterns.glb");
  const crystal = useGLTF("/models/dream2/Dream2_Crystal.glb");
  const floor = useGLTF("/models/dream2/Dream2_Floor.glb");
  const path = useGLTF("/models/dream2/Dream2_Floor_Path.glb");
  const tree = useGLTF("/models/dream2/Dream2_Main_Tree.glb");
  const rocks = useGLTF("/models/dream2/Dream2_Rocks.glb");
  const shrine = useGLTF("/models/dream2/Dream2_Stone_Shrine.glb");
  const key = useGLTF("/models/dream2/Dream2_Unlock_Key.glb");
  const well = useGLTF("/models/dream2/Dream2_Well.glb");
  const bridge = useGLTF("/models/dream2/Dream2_Wooden_Bridge.glb");

  const { hasKey, collectKey, showMessage, crystalActivated, activateCrystal, startTransition } = useDream2Store();

  const crystalGroupRef = useRef<THREE.Group>(null);
  const keyRef = useRef<THREE.Group>(null);

  const crystalCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(crystal.scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return center;
  }, [crystal.scene]);

  const waterUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    crystal.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color("#4ade80");
        mat.emissiveIntensity = 2; 
      }
    });
  }, [crystal.scene]);

  useFrame((state, delta) => {
    waterUniforms.uTime.value = state.clock.elapsedTime;

    if (crystalGroupRef.current) {
      if (crystalActivated) {
        crystalGroupRef.current.rotation.y += delta * 2;
        if (crystalGroupRef.current.position.y < crystalCenter.y + 1.5) {
          crystalGroupRef.current.position.y += delta * 0.3;
        }
      } else {
        crystalGroupRef.current.position.y = crystalCenter.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  const handleKeyClick = (e: any) => {
    e.stopPropagation();
    if (!hasKey) {
      collectKey();
      if (keyRef.current) keyRef.current.visible = false; 
    }
  };

  const handleCrystalClick = (e: any) => {
    e.stopPropagation();
    
    if (!hasKey) {
      showMessage("Find the key first!");
      setTimeout(() => showMessage("Objective: Find the key for go to the next dream"), 3000);
    } else if (!crystalActivated) {
      activateCrystal();
    } else {
      startTransition();
    }
  };

  return (
    <group>
      <primitive object={floor.scene} />
      <primitive object={path.scene} />
      
      {/* ======================================================== */}
      {/* NATIVE R3F WATER - No Blender needed!                      */}
      {/* Adjust the 'position' Y value (-0.5) to raise/lower it   */}
      {/* ======================================================== */}
      <mesh position={[0, -0.7, -2.8]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* A massive 100x100 plane with 128 subdivisions for silky smooth waves */}
        <planeGeometry args={[42, 7, 128, 32]} />
        
        <meshPhysicalMaterial
          color={new THREE.Color(0.019, 0.488, 0.351)}
          metalness={0.1}
          roughness={0.05}
          transmission={0.8}
          ior={1.33}
          transparent={true}
          opacity={1}
          thickness={2.0}
          onBeforeCompile={(shader) => {
            shader.uniforms.uTime = waterUniforms.uTime;
            shader.vertexShader = `
              uniform float uTime;
              ${shader.vertexShader}
            `.replace(
              `#include <begin_vertex>`,
              `
              #include <begin_vertex>
              
              float waveSpeed = uTime * 1.5;
              float waveHeight = 0.15; 
              
              float wave = sin(position.x * 0.5 + waveSpeed) * waveHeight 
                         + cos(position.y * 0.5 + waveSpeed * 0.8) * waveHeight;
                         
              transformed.z += wave; 
              `
            );
          }}
        />
      </mesh>
      
      <primitive object={bridge.scene} />
      <primitive object={tree.scene} />
      <primitive object={rocks.scene} />
      <primitive object={shrine.scene} />
      <primitive object={well.scene} />
      <primitive object={lanterns.scene} />

      <group ref={keyRef}>
        <primitive 
          object={key.scene} 
          onClick={handleKeyClick}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />
      </group>

      <group ref={crystalGroupRef} position={crystalCenter}>
        <group position={[-crystalCenter.x, -crystalCenter.y, -crystalCenter.z]}>
          <primitive 
            object={crystal.scene} 
            onClick={handleCrystalClick}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          />
        </group>
        <pointLight color="#4ade80" intensity={8} distance={15} />
        <GreenParticles />
      </group>
    </group>
  );
}