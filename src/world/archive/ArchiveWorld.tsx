import { useState } from "react";
import * as THREE from "three";

import ArchiveEnvironment from "./ArchiveEnvironment";
import ArchiveLights from "./ArchiveLights";
import ArchiveModels from "./ArchiveModels";

export interface ArchiveWorldData {
  crystal: THREE.Vector3;
  bounds: THREE.Box3;
}

interface Props {
  onReady(data: ArchiveWorldData): void;
}

export default function ArchiveWorld({
  onReady,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <ArchiveEnvironment />

      <ArchiveLights />

      <ArchiveModels
        onReady={(crystal, bounds) => {
          if (loaded) return;

          setLoaded(true);

          onReady({
            crystal,
            bounds,
          });
        }}
      />
    </>
  );
}