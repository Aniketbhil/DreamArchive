import { Environment } from "@react-three/drei";

export default function ArchiveEnvironment() {
  return (
    <>
      <Environment
        preset="warehouse"
        background={false}
        blur={0.75}
      />

      <fog
        attach="fog"
        args={[
          "#07070b",
          180,
          900,
        ]}
      />
    </>
  );
}