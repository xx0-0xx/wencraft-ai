import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { useStudioStore } from '../../store/studioStore';
import { getOrnament } from '../../data/ornaments';
import { createInscriptionTexture, useOrnamentTexture } from './textures';

interface DecalProps {
  geometry: THREE.BufferGeometry;
  height: number;
}

const PROJECTOR_Z = 25;
const PROJECTOR_DEPTH = 20;

function useDecalHost(geometry: THREE.BufferGeometry): THREE.Mesh {
  return useMemo(() => {
    const mesh = new THREE.Mesh(geometry);
    mesh.updateMatrixWorld(true);
    return mesh;
  }, [geometry]);
}

function DecalMaterial({
  map,
  opacity = 1,
}: {
  map: THREE.Texture;
  opacity?: number;
}) {
  return (
    <meshStandardMaterial
      map={map}
      transparent
      opacity={opacity}
      alphaTest={0.012}
      roughness={0.88}
      metalness={0.01}
      polygonOffset
      polygonOffsetFactor={-4}
      polygonOffsetUnits={-4}
      depthWrite={false}
      toneMapped={false}
    />
  );
}

export function InscriptionDecal({ geometry, height }: DecalProps) {
  const inscription = useStudioStore((state) => state.design.inscription);
  const host = useDecalHost(geometry);

  const texture = useMemo(() => {
    if (!inscription.enabled) return null;
    return createInscriptionTexture(inscription);
  }, [
    inscription.enabled,
    inscription.text,
    inscription.fontId,
    inscription.color,
    inscription.direction,
  ]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  const decalGeometry = useMemo(() => {
    if (!inscription.enabled || !texture) return null;
    const image = texture.image as HTMLCanvasElement | undefined;
    if (!image?.width || !image?.height) return null;
    const aspect = image.width / image.height;
    const longSide = height * 0.315 * inscription.size;
    const horizontal = inscription.direction === 'horizontal';
    const width = horizontal ? longSide : longSide * aspect;
    const boxHeight = horizontal ? longSide / aspect : longSide;
    const centerY = height * (horizontal ? 0.61 : 0.58);
    const position = new THREE.Vector3(0, centerY, PROJECTOR_Z);
    const orientation = new THREE.Euler(0, 0, 0);
    const size = new THREE.Vector3(width, boxHeight, PROJECTOR_DEPTH);
    return new DecalGeometry(host, position, orientation, size);
  }, [
    host,
    height,
    inscription.enabled,
    inscription.size,
    inscription.direction,
    texture,
  ]);

  useEffect(() => {
    return () => {
      decalGeometry?.dispose();
    };
  }, [decalGeometry]);

  if (!decalGeometry || !texture) return null;

  return (
    <mesh
      key={texture.uuid}
      geometry={decalGeometry}
      renderOrder={4}
      frustumCulled={false}
    >
      <DecalMaterial map={texture} />
    </mesh>
  );
}

export function OrnamentDecal({ geometry, height }: DecalProps) {
  const ornament = useStudioStore((state) => state.design.ornament);
  const materialId = useStudioStore((state) => state.design.materialId);
  const item = getOrnament(ornament.id);
  const host = useDecalHost(geometry);
  const carvedTint = materialId === 'duanni' ? '#6B4A33' : '#E7C58B';
  const { texture } = useOrnamentTexture(
    item?.texture ?? '',
    ornament.style,
    carvedTint,
  );

  const decalGeometry = useMemo(() => {
    if (!item || !texture) return null;
    const centerY = height * 0.32 + ornament.y;
    const position = new THREE.Vector3(ornament.x, centerY, PROJECTOR_Z);
    const orientation = new THREE.Euler(
      0,
      0,
      THREE.MathUtils.degToRad(ornament.rotation),
    );
    const size = new THREE.Vector3(
      ornament.size,
      ornament.size,
      PROJECTOR_DEPTH,
    );
    return new DecalGeometry(host, position, orientation, size);
  }, [host, height, item, ornament.size, ornament.x, ornament.y, ornament.rotation, texture]);

  useEffect(() => {
    return () => {
      decalGeometry?.dispose();
    };
  }, [decalGeometry]);

  if (!item || !decalGeometry || !texture) return null;

  return (
    <mesh
      key={texture.uuid}
      geometry={decalGeometry}
      renderOrder={3}
      frustumCulled={false}
    >
      <DecalMaterial map={texture} opacity={0.98} />
    </mesh>
  );
}
