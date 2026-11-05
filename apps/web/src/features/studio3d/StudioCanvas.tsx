import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, ContactShadows, OrbitControls } from '@react-three/drei';
import {
  Bloom,
  EffectComposer,
  N8AO,
  Vignette,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useStudioStore } from '../../store/studioStore';
import { TeapotModel } from './TeapotModel';
import { StudioBackdrop } from './StudioBackdrop';
import { StudioLighting } from './StudioLighting';

export type ViewPreset = 'front' | 'side' | 'back' | 'reset';

export interface ViewCommand {
  preset: ViewPreset;
  nonce: number;
}

const CAMERA_TARGET = new THREE.Vector3(0, 24, 0);
const VIEW_POSITIONS: Record<ViewPreset, THREE.Vector3> = {
  front: new THREE.Vector3(0, 104, 140),
  side: new THREE.Vector3(165, 119, 0.01),
  back: new THREE.Vector3(0, 104, -140),
  reset: new THREE.Vector3(0, 104, 140),
};

function CameraRig({ command }: { command: ViewCommand }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as
    | { target: THREE.Vector3; update: () => void }
    | null;
  const targetPosition = useRef(camera.position.clone());
  const targetLookAt = useRef(CAMERA_TARGET.clone());
  const startPosition = useRef(camera.position.clone());
  const startLookAt = useRef(CAMERA_TARGET.clone());
  const startTime = useRef(0);
  const animating = useRef(false);

  useEffect(() => {
    targetPosition.current.copy(VIEW_POSITIONS[command.preset]);
    targetLookAt.current.copy(CAMERA_TARGET);
    startPosition.current.copy(camera.position);
    startLookAt.current.copy(controls?.target ?? CAMERA_TARGET);
    startTime.current = performance.now();
    animating.current = true;
  }, [camera, command, controls]);

  useFrame(() => {
    if (!animating.current || !controls) return;
    const progress = Math.min(
      1,
      (performance.now() - startTime.current) / 620,
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    camera.position.lerpVectors(
      startPosition.current,
      targetPosition.current,
      eased,
    );
    controls.target.lerpVectors(startLookAt.current, targetLookAt.current, eased);
    controls.update();
    if (progress >= 1) {
      camera.position.copy(targetPosition.current);
      controls.target.copy(targetLookAt.current);
      controls.update();
      animating.current = false;
    }
  });

  return null;
}

function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = generator.fromScene(room, 0.04).texture;
    scene.environment = texture;
    return () => {
      scene.environment = null;
      texture.dispose();
      generator.dispose();
    };
  }, [gl, scene]);

  return null;
}

function StaticShadows() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    const timers = [400, 1600, 3200].map((delay) =>
      window.setTimeout(() => {
        gl.shadowMap.needsUpdate = true;
      }, delay),
    );
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);

  return null;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isMobile;
}

export function StudioCanvas({ viewCommand }: { viewCommand: ViewCommand }) {
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const isMobile = useIsMobile();

  return (
    <ErrorBoundary fallbackTitle="3D 器物暂时未加载">
      <Canvas
        shadows
        dpr={[1, isMobile ? 1.5 : 1.75]}
        camera={{
          fov: 32,
          near: 0.5,
          far: 900,
          position: [
            VIEW_POSITIONS.front.x,
            VIEW_POSITIONS.front.y,
            VIEW_POSITIONS.front.z,
          ],
        }}
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.86;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.domElement.dataset.studioCanvas = 'true';
          camera.lookAt(CAMERA_TARGET);
        }}
        style={{ touchAction: 'none' }}
      >
        <StudioEnvironment />
        <StudioBackdrop />
        <StaticShadows />
        <StudioLighting />

        <Suspense fallback={null}>
          <TeapotModel />
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.8}
            scale={170}
            blur={3.4}
            far={100}
            resolution={1024}
            color="#2b1d15"
            frames={1}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          target={[0, 24, 0]}
          enablePan={false}
          enableDamping
          dampingFactor={0.075}
          rotateSpeed={0.62}
          zoomSpeed={0.8}
          minDistance={72}
          maxDistance={240}
          minPolarAngle={0.32}
          maxPolarAngle={Math.PI / 2 - 0.03}
          autoRotate={autoRotate}
          autoRotateSpeed={0.72}
        />
        <CameraRig command={viewCommand} />
        <AdaptiveDpr />
        <AdaptiveEvents />

        <EffectComposer multisampling={isMobile ? 0 : 2}>
          <N8AO
            aoRadius={9}
            distanceFalloff={1.1}
            intensity={2.1}
            quality={isMobile ? 'low' : 'medium'}
            halfRes
            depthAwareUpsampling
            color="#3e2c20"
          />
          <Bloom
            intensity={isMobile ? 0.05 : 0.1}
            luminanceThreshold={1.05}
            luminanceSmoothing={0.45}
            mipmapBlur
          />
          <Vignette offset={0.24} darkness={0.32} />
        </EffectComposer>
      </Canvas>
    </ErrorBoundary>
  );
}
