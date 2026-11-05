import {
  Bloom,
  EffectComposer,
  N8AO,
  Vignette,
} from '@react-three/postprocessing';

export default function DesktopEffects() {
  return (
    <EffectComposer multisampling={2}>
      <N8AO
        aoRadius={9}
        distanceFalloff={1.1}
        intensity={2.1}
        quality="medium"
        halfRes
        depthAwareUpsampling
        color="#3e2c20"
      />
      <Bloom
        intensity={0.1}
        luminanceThreshold={1.05}
        luminanceSmoothing={0.45}
        mipmapBlur
      />
      <Vignette offset={0.24} darkness={0.32} />
    </EffectComposer>
  );
}
