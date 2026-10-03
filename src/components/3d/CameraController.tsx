import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import type { CameraControlsImpl } from '@react-three/drei';
import type { PerspectiveCamera } from 'three';
import { POSES } from '@/three/rig/poses';
import type { PoseFocus } from '@/three/rig/poses';
import { computeShot } from '@/three/camera';
import { usePrayerStore } from '@/store/prayerStore';

const HERO_FOCUS: PoseFocus = { target: [0, 0.98, 0.05], size: [0.8, 2.15] };

/**
 * Dedicated camera controller.
 *
 * - Auto camera: each step chooses the most informative angle (side for ruku and
 *   sujood, front / three-quarter for hand placement, …).
 * - Manual: the learner picks Front / 3/4 / Side, or orbits freely.
 * Transitions are always interpolated (never teleport) unless reduced motion is on.
 */
export function CameraController() {
  const ref = useRef<CameraControlsImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const layout = usePrayerStore((s) => s.layout);
  const autoCamera = usePrayerStore((s) => s.autoCamera);
  const manualView = usePrayerStore((s) => s.manualView);
  const stepView = usePrayerStore((s) => s.scene.view);
  const pose = usePrayerStore((s) => s.scene.pose);
  const nonce = usePrayerStore((s) => s.cameraNonce);
  const heroView = usePrayerStore((s) => s.heroView);
  const lang = usePrayerStore((s) => s.lang);
  const reduced = usePrayerStore((s) => s.a11y.reducedMotion);
  const interacting = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const c = ref.current;
    if (!c || layout === 'hidden') return;
    const aspect = width / Math.max(height, 1);
    const hero = layout === 'hero';
    const view = hero ? (heroView ?? 'threeQuarter') : autoCamera ? stepView : manualView;
    const standing = pose === 'stand' || pose.startsWith('qiyam') || pose.startsWith('takbir');
    const base = POSES[pose].focus;
    const portrait = aspect < 0.8;
    // Portrait hero: the figure fills the top half of the screen, above the heading.
    const portraitHero: PoseFocus = { target: [0, 0.98 - 0.66, 0.05], size: [0.5, 3.8] };
    const focus: PoseFocus = hero && portrait ? portraitHero : hero ? (standing ? HERO_FOCUS : { target: base.target, size: [base.size[0] * 1.35, base.size[1] * 1.35] }) : base;
    // Narrow screens get a wider lens so the camera can stay inside the prayer hall.
    const fov = aspect < 0.8 ? 44 : 30;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    const shot = computeShot(view, focus, aspect, camera.fov, hero ? (portrait ? 1.0 : 1.08) : 1.16);
    // Never leave the arcade (radius ≈ 5.4 m).
    const off = shot.position.clone().sub(shot.target);
    if (off.length() > 4.6) shot.position.copy(shot.target).add(off.setLength(4.6));
    const animate = !reduced && !first.current;
    first.current = false;
    void c.setLookAt(shot.position.x, shot.position.y, shot.position.z, shot.target.x, shot.target.y, shot.target.z, animate);
    if (hero && !portrait) {
      // Place the figure on the right of the screen, behind the hero text.
      const dist = shot.position.distanceTo(shot.target);
      const visibleW = 2 * dist * Math.tan((camera.fov * Math.PI) / 360) * aspect;
      const rtl = lang === 'ar';
      void c.setFocalOffset(visibleW * (rtl ? 0.16 : -0.16), 0, 0, animate);
    } else {
      void c.setFocalOffset(0, 0, 0, animate);
    }
  }, [layout, autoCamera, manualView, stepView, pose, width, height, nonce, reduced, camera, heroView, lang]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    // Dev-only handle for visual QA from the console.
    if (import.meta.env.DEV) (window as unknown as { __camera?: CameraControlsImpl }).__camera = c;
    const start = () => (interacting.current = true);
    const end = () => (interacting.current = false);
    c.addEventListener('controlstart', start);
    c.addEventListener('controlend', end);
    return () => {
      c.removeEventListener('controlstart', start);
      c.removeEventListener('controlend', end);
    };
  }, []);

  // Subtle, slow camera drift on the hero screen.
  useFrame((state, dt) => {
    const c = ref.current;
    if (!c || layout !== 'hero' || reduced || interacting.current) return;
    c.rotate(Math.sin(state.clock.elapsedTime * 0.22) * dt * 0.018, 0, false);
  });

  return (
    <CameraControls
      ref={ref}
      makeDefault
      smoothTime={reduced ? 0.01 : 0.7}
      draggingSmoothTime={0.12}
      minDistance={1.0}
      maxDistance={7}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI * 0.52}
      truckSpeed={0}
      dollySpeed={0.5}
      enabled={layout !== 'hero'}
    />
  );
}
