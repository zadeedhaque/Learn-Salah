import { useEffect } from 'react';
import { usePrayerStore } from '@/store/prayerStore';
import { MADHHABS } from '@/content/madhabs';
import { consumeTransitionOptions } from '@/three/engine';
import { sceneRefs, useSceneStatus } from './sceneContext';

/**
 * Bridges application state to the centralised PoseAnimator: whenever the scene
 * pose changes, transition the figure there using the selected madhhab's path
 * preferences (e.g. knees or hands first when going down to sujood).
 */
export function AnimationController() {
  const pose = usePrayerStore((s) => s.scene.pose);
  const madhhab = usePrayerStore((s) => s.madhhab);
  const animationsOn = usePrayerStore((s) => s.animationsOn);
  const reduced = usePrayerStore((s) => s.a11y.reducedMotion);

  useEffect(() => {
    const a = sceneRefs.animator;
    if (!a) return;
    a.breathing = !reduced;
    a.enabled = animationsOn && !reduced;
  }, [animationsOn, reduced]);

  useEffect(() => {
    const a = sceneRefs.animator;
    if (!a) return;
    const practice = MADHHABS[madhhab].practice;
    const opts = consumeTransitionOptions() ?? {};
    // If the learner moves on mid-transition (e.g. fast scrolling), catch up quickly
    // instead of lagging behind the text.
    const speed = opts.speed ?? (a.isAnimating ? 2.2 : 1.15);
    a.transitionToPose(pose, {
      ...opts,
      speed,
      prefs: { handsFirst: practice.descent === 'hands', restBeforeRising: practice.restBeforeRising },
    });
    useSceneStatus.getState().setProgress(0.95);
  }, [pose, madhhab]);

  return null;
}
