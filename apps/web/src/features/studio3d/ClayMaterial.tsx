import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getClayMaterial } from '../../data/materials';
import type { MaterialId } from '../../types/studio';
import { getClayGrainTexture } from './proceduralTextures';

const CLAY_FRAGMENT_HEAD = `
  uniform sampler2D uGrainMap;
  uniform mat3 uViewNormalMatrix;
  uniform float uGrainScale;
  uniform float uMacroScale;
  uniform float uBumpStrength;
  uniform float uColorVariation;
  uniform float uRoughnessVariation;
  varying vec3 vClayPosition;
  varying vec3 vClayNormal;

  vec3 clayWeights(vec3 n) {
    vec3 w = pow(abs(n), vec3(4.0));
    return w / max(dot(w, vec3(1.0)), 0.0001);
  }
`;

export function ClayMaterial({ materialId }: { materialId: MaterialId }) {
  const clay = getClayMaterial(materialId);
  const grainMap = getClayGrainTexture();
  const viewNormalMatrix = useMemo(() => new THREE.Matrix3(), []);

  const material = useMemo(() => {
    const initialClay = getClayMaterial(materialId);
    const physical = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(initialClay.color),
      roughness: initialClay.roughness,
      metalness: 0,
      sheen: 0.14,
      sheenRoughness: 0.88,
      sheenColor: new THREE.Color(initialClay.accent),
      clearcoat: 0.035,
      clearcoatRoughness: 0.82,
      specularIntensity: 0.38,
      specularColor: new THREE.Color(initialClay.accent),
      envMapIntensity: 0.58,
    });
    physical.dithering = true;

    physical.onBeforeCompile = (shader) => {
      shader.uniforms.uGrainMap = { value: grainMap };
      shader.uniforms.uViewNormalMatrix = { value: viewNormalMatrix };
      shader.uniforms.uGrainScale = { value: 0.16 };
      shader.uniforms.uMacroScale = { value: 0.034 };
      shader.uniforms.uBumpStrength = { value: 0.11 };
      shader.uniforms.uColorVariation = { value: 0.1 };
      shader.uniforms.uRoughnessVariation = { value: 0.15 };

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
          varying vec3 vClayPosition;
          varying vec3 vClayNormal;`,
        )
        .replace(
          '#include <beginnormal_vertex>',
          `#include <beginnormal_vertex>
          vClayPosition = position;
          vClayNormal = objectNormal;`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>${CLAY_FRAGMENT_HEAD}`)
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          vec3 macroP = vClayPosition * uMacroScale;
          vec3 macroW = clayWeights(vClayNormal);
          float macro = texture2D(uGrainMap, macroP.zy).b * macroW.x
                      + texture2D(uGrainMap, macroP.xz).b * macroW.y
                      + texture2D(uGrainMap, macroP.xy).b * macroW.z;
          diffuseColor.rgb *= 1.0 - uColorVariation * 0.5 + macro * uColorVariation;`,
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>
          vec3 grainP = vClayPosition * uGrainScale;
          vec3 grainW = clayWeights(vClayNormal);
          float grain = texture2D(uGrainMap, grainP.zy).g * grainW.x
                      + texture2D(uGrainMap, grainP.xz).g * grainW.y
                      + texture2D(uGrainMap, grainP.xy).g * grainW.z;
          roughnessFactor = clamp(
            roughnessFactor + (grain - 0.5) * uRoughnessVariation,
            0.26,
            0.98
          );`,
        )
        .replace(
          '#include <normal_fragment_maps>',
          `#include <normal_fragment_maps>
          vec3 bumpP = vClayPosition * uGrainScale * 2.4;
          vec3 bumpW = clayWeights(vClayNormal);
          vec3 bumpSample = vec3(
            texture2D(uGrainMap, bumpP.zy + vec2(0.37, 0.0)).r,
            texture2D(uGrainMap, bumpP.xz + vec2(0.0, 0.41)).r,
            texture2D(uGrainMap, bumpP.xy + vec2(0.43, 0.11)).r
          );
          vec3 bumpObject = (bumpSample - 0.5) * bumpW;
          vec3 bumpView = uViewNormalMatrix * bumpObject;
          normal = normalize(normal + bumpView * uBumpStrength);`,
        );

      (physical.userData as { shader?: unknown }).shader = shader;
    };

    physical.customProgramCacheKey = () => 'wencraft-clay-grain-v1';
    return physical;
  }, [grainMap, viewNormalMatrix]);

  useLayoutEffect(() => {
    material.color.set(clay.color);
    material.roughness = clay.roughness;
    material.sheenColor.set(clay.accent);
    material.specularColor.set(clay.accent);
  }, [clay, material]);

  useFrame(({ camera }) => {
    viewNormalMatrix.setFromMatrix4(camera.matrixWorldInverse);
  });

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return <primitive object={material} attach="material" />;
}
