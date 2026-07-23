import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";

import { ToneMappingMode } from "postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={1.15}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.85}
      />

      <ToneMapping
        mode={ToneMappingMode.ACES_FILMIC}
      />
    </EffectComposer>
  );
}