import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useStudioStore } from '../../store/studioStore';
import { assetUrl } from '../../lib/assetUrl';
import { InscriptionDecal, OrnamentDecal } from './Decals';
import { ClayMaterial } from './ClayMaterial';

const MODEL_URL = assetUrl('/assets/models/teapot.glb');

export function TeapotModel() {
  const gltf = useGLTF(MODEL_URL);
  const materialId = useStudioStore((state) => state.design.materialId);

  const geometry = useMemo(() => {
    let found: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((object) => {
      if (!found && (object as THREE.Mesh).isMesh) {
        found = (object as THREE.Mesh).geometry;
      }
    });
    if (!found) {
      throw new Error('teapot.glb 中没有可用的网格');
    }
    const cloned = (found as THREE.BufferGeometry).clone();
    cloned.computeBoundingBox();
    return cloned;
  }, [gltf.scene]);

  const height = useMemo(() => {
    const box = geometry.boundingBox;
    return box ? box.max.y - box.min.y : 47.56;
  }, [geometry]);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <ClayMaterial materialId={materialId} />
      </mesh>
      <InscriptionDecal geometry={geometry} height={height} />
      <OrnamentDecal geometry={geometry} height={height} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
