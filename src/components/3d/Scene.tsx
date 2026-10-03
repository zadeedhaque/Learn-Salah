import { Component, Suspense, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { usePrayerStore } from '@/store/prayerStore';
import { MODEL_SOURCE } from '@/three/modelConfig';
import { SceneEnvironment } from './Environment';
import type { Quality } from './Environment';
import { PrayerModel } from './PrayerModel';
import { GltfPrayerModel } from './GltfPrayerModel';
import { CameraController } from './CameraController';
import { BodyHighlight } from './BodyHighlight';
import { AnimationController } from './AnimationController';
import { useSceneStatus } from './sceneContext';

function detectQuality(): Quality {
  try {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    return coarse || cores <= 4 || window.innerWidth < 760 ? 'low' : 'high';
  } catch {
    return 'low';
  }
}

/** Falls back to the procedural figure if an external model fails to load. */
class ModelBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[Learn Salah] External model failed to load, using the built-in figure.', err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Figure() {
  if (MODEL_SOURCE.kind === 'gltf') {
    return (
      <ModelBoundary fallback={<PrayerModel />}>
        <GltfPrayerModel url={MODEL_SOURCE.url} boneMap={MODEL_SOURCE.boneMap} draco={MODEL_SOURCE.draco} />
      </ModelBoundary>
    );
  }
  return <PrayerModel />;
}

/**
 * Compile every shader up front (parallel where supported) so the first pose
 * changes never stall on shader compilation, then signal the loading screen.
 */
function ReadySignal() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const compiled = useRef(false);
  const frames = useRef(0);
  useEffect(() => {
    let alive = true;
    const done = () => alive && (compiled.current = true);
    const t = window.setTimeout(done, 6000);
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [gl, scene, camera]);
  useFrame(() => {
    if (!compiled.current) return;
    frames.current++;
    if (frames.current === 3) useSceneStatus.getState().setReady();
  });
  return null;
}

function Lights({ quality }: { quality: Quality }) {
  const size = quality === 'high' ? 2048 : 1024;
  return (
    <>
      <hemisphereLight args={['#33465c', '#1d140b', 0.55]} />
      <directionalLight
        position={[-2.4, 4.6, 3.2]}
        intensity={2.5}
        color="#ffe3c2"
        castShadow
        shadow-mapSize={[size, size]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-1.6}
        shadow-camera-right={1.6}
        shadow-camera-top={2.2}
        shadow-camera-bottom={-0.6}
        shadow-camera-near={1}
        shadow-camera-far={12}
      />
      <directionalLight position={[2.4, 3.2, -3.6]} intensity={1.5} color="#9fc0e6" />
      <directionalLight position={[3, 1.2, 2.5]} intensity={0.35} color="#ffd9a8" />
    </>
  );
}

/** The WebGL scene. Lazily loaded so the page shell renders first. */
export default function Scene() {
  const layout = usePrayerStore((s) => s.layout);
  const quality = useMemo(detectQuality, []);

  return (
    <Canvas
      shadows
      dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      camera={{ fov: 30, near: 0.05, far: 60, position: [-2.6, 1.6, 3.6] }}
      gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
      frameloop={layout === 'hidden' ? 'never' : 'always'}
      onCreated={(state) => {
        useSceneStatus.getState().setProgress(0.6);
        if (import.meta.env.DEV) (window as unknown as { __r3f: unknown }).__r3f = state;
      }}
      aria-hidden="true"
    >
      <color attach="background" args={['#0a0c0b']} />
      <fog attach="fog" args={['#0a0c0b', 6.5, 16]} />
      <Lights quality={quality} />
      <Suspense fallback={null}>
        <SceneEnvironment quality={quality} />
      </Suspense>
      <Suspense fallback={null}>
        <Figure />
        <AnimationController />
        <BodyHighlight />
        <ReadySignal />
      </Suspense>
      <ContactShadows position={[0, 0.008, 0.25]} scale={[2.4, 3]} blur={2.4} opacity={0.55} far={1.4} resolution={512} frames={quality === 'high' ? Infinity : 1} />
      <CameraController />
    </Canvas>
  );
}
