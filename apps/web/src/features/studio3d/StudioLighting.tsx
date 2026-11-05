import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

interface SoftboxProps {
  position: [number, number, number];
  width: number;
  height: number;
  intensity: number;
  color: string;
}

function Softbox({ position, width, height, intensity, color }: SoftboxProps) {
  const ref = useRef<THREE.RectAreaLight>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.lookAt(0, 22, 0);
    ref.current.updateMatrixWorld();
  }, []);

  return (
    <rectAreaLight
      ref={ref}
      position={position}
      width={width}
      height={height}
      intensity={intensity}
      color={color}
    />
  );
}

export function StudioLighting({ mobile = false }: { mobile?: boolean }) {
  useEffect(() => {
    if (!mobile) RectAreaLightUniformsLib.init();
  }, [mobile]);
  const shadowTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 24, 0);
    return target;
  }, []);
  if (mobile) {
    return (
      <>
        <hemisphereLight args={['#fff3e6', '#79604d', 1.45]} />
        <directionalLight position={[-90, 120, 80]} color="#fff0dc" intensity={2.5} />
        <directionalLight position={[35, 65, -95]} color="#ffd9a5" intensity={1} />
      </>
    );
  }

  return (
    <>
      <primitive object={shadowTarget} />
      <ambientLight intensity={0.02} color="#fff7ed" />
      <hemisphereLight args={['#fdf6ec', '#6b5541', 0.12]} />

      <directionalLight
        position={[-90, 120, 80]}
        target={shadowTarget}
        intensity={0.55}
        color="#fff0dc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={140}
        shadow-camera-bottom={-40}
        shadow-camera-near={1}
        shadow-camera-far={420}
        shadow-bias={-0.00025}
        shadow-normalBias={0.035}
      />

      <directionalLight
        position={[40, 45, 120]}
        intensity={0.08}
        color="#dfe9f5"
      />
      <directionalLight
        position={[20, 65, -120]}
        intensity={0.35}
        color="#ffd9a5"
      />

      <Softbox
        position={[-95, 85, 110]}
        width={80}
        height={55}
        intensity={4.8}
        color="#ffe0bd"
      />
      <Softbox
        position={[-68, 62, 68]}
        width={28}
        height={20}
        intensity={2.4}
        color="#fff0d8"
      />
      <Softbox
        position={[25, 28, 128]}
        width={70}
        height={50}
        intensity={3.0}
        color="#ffe9d4"
      />
      <Softbox
        position={[100, 45, 80]}
        width={60}
        height={45}
        intensity={0.35}
        color="#dbe7f7"
      />
      <Softbox
        position={[80, 68, -110]}
        width={80}
        height={60}
        intensity={4.0}
        color="#ffcf95"
      />
      <Softbox
        position={[0, 160, 0]}
        width={80}
        height={80}
        intensity={0.2}
        color="#fff8ee"
      />
    </>
  );
}
