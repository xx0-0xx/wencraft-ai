import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function StudioBackdrop() {
  const geometry = useMemo(() => {
    const profile: THREE.Vector2[] = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(140, 0),
      new THREE.Vector2(200, 0),
    ];
    const segments = 40;
    for (let index = 1; index <= segments; index += 1) {
      const t = index / segments;
      const angle = (t * Math.PI) / 2;
      profile.push(
        new THREE.Vector2(200 + Math.sin(angle) * 100, 120 - Math.cos(angle) * 100),
      );
    }
    profile.push(new THREE.Vector2(300, 320));

    const lathe = new THREE.LatheGeometry(profile, 160);
    const positions = lathe.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const floorColor = new THREE.Color('#6d5845');
    const wallColor = new THREE.Color('#3f2f24');
    const poolColor = new THREE.Color('#9c7f60');
    const color = new THREE.Color();

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const z = positions.getZ(index);
      const radius = Math.sqrt(x * x + z * z);
      const wallMix = smoothstep(0, 130, y);
      color.copy(floorColor).lerp(wallColor, wallMix);
      const pool = (1 - smoothstep(28, 165, radius)) * 0.35;
      color.lerp(poolColor, pool);
      color.toArray(colors, index * 3);
    }

    lathe.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    lathe.computeBoundingSphere();
    return lathe;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <>
      <color attach="background" args={['#2a211a']} />
      <fog attach="fog" args={['#4a382a', 260, 720]} />

      <mesh geometry={geometry} position={[0, -0.02, 0]} receiveShadow>
        <meshStandardMaterial
          vertexColors
          color="#ffffff"
          roughness={0.9}
          metalness={0}
          side={THREE.DoubleSide}
          emissive="#4a382a"
          emissiveIntensity={0.005}
          envMapIntensity={0.14}
        />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 0]}>
        <ringGeometry args={[45, 45.45, 180]} />
        <meshBasicMaterial
          color="#8f765c"
          transparent
          opacity={0.24}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
