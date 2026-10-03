import { useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { buildProceduralHuman } from '@/three/model/proceduralHuman';
import { PoseAnimator } from '@/three/animation/PoseAnimator';
import { usePrayerStore } from '@/store/prayerStore';
import { RUG_HEIGHT, sceneRefs, useSceneStatus } from './sceneContext';

/**
 * The procedural faceless figure. Builds the skinned mesh once, registers the rig
 * and animator for the rest of the scene, and advances the animation each frame.
 */
export function PrayerModel() {
  const human = useMemo(() => buildProceduralHuman(), []);
  const animator = useMemo(() => new PoseAnimator(human.rig, usePrayerStore.getState().scene.pose), [human]);

  useLayoutEffect(() => {
    sceneRefs.rig = human.rig;
    sceneRefs.animator = animator;
    useSceneStatus.getState().setProgress(0.85);
    return () => {
      if (sceneRefs.animator === animator) {
        sceneRefs.rig = null;
        sceneRefs.animator = null;
      }
      human.dispose();
    };
  }, [human, animator]);

  useFrame((_, dt) => animator.update(Math.min(dt, 0.1)));

  return <primitive object={human.group} position={[0, RUG_HEIGHT, 0]} />;
}
