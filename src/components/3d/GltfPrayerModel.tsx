import { useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { Mesh } from 'three';
import { createRig } from '@/three/rig/skeleton';
import type { BoneName } from '@/three/rig/skeleton';
import { PoseAnimator } from '@/three/animation/PoseAnimator';
import { applyRetarget, createBinding } from '@/three/animation/retarget';
import { usePrayerStore } from '@/store/prayerStore';
import { RUG_HEIGHT, sceneRefs, useSceneStatus } from './sceneContext';

interface Props {
  url: string;
  boneMap: Partial<Record<BoneName, string>>;
  draco: boolean;
}

/**
 * Loads an external rigged model (public/models/prayer-person.glb) and drives it
 * with the same pose system as the procedural figure, via retargeting.
 * Draco-compressed files are supported (decoder fetched on demand by drei).
 */
export function GltfPrayerModel({ url, boneMap, draco }: Props) {
  const gltf = useGLTF(url, draco);
  const scene = useMemo(() => {
    const s = cloneSkinned(gltf.scene);
    s.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false;
      }
    });
    return s;
  }, [gltf]);
  const rig = useMemo(() => createRig(), []);
  const animator = useMemo(() => new PoseAnimator(rig, usePrayerStore.getState().scene.pose), [rig]);
  const binding = useMemo(() => createBinding(scene, boneMap), [scene, boneMap]);

  useLayoutEffect(() => {
    sceneRefs.rig = rig;
    sceneRefs.animator = animator;
    useSceneStatus.getState().setProgress(0.85);
    return () => {
      if (sceneRefs.animator === animator) {
        sceneRefs.rig = null;
        sceneRefs.animator = null;
      }
    };
  }, [rig, animator]);

  useFrame((_, dt) => {
    animator.update(Math.min(dt, 0.1));
    applyRetarget(rig, binding);
  });

  return (
    <group position={[0, RUG_HEIGHT, 0]}>
      {/* Hidden driver rig keeps highlight anchors in sync with the pose. */}
      <primitive object={rig.root} visible={false} />
      <primitive object={scene} />
    </group>
  );
}
