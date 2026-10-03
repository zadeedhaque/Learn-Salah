import { useCallback } from 'react';
import { usePrayerStore } from '@/store/prayerStore';
import { playAnimation, setAutoCamera, setCameraView, transitionToPose } from '@/three/engine';
import { resolvePose } from '@/content/resolve';
import { MADHHABS } from '@/content/madhabs';
import type { AbstractPose, LessonStep } from '@/content/types';
import type { BodyPart } from '@/three/model/anchors';
import type { CameraView } from '@/three/camera';

/** Component-facing access to the 3D engine (pose, camera, highlights). */
export function useModelAnimation() {
  const madhhab = usePrayerStore((s) => s.madhhab);
  const setScene = usePrayerStore((s) => s.setScene);

  const showAbstract = useCallback(
    (pose: AbstractPose, opts: { view?: CameraView; highlights?: BodyPart[]; sitting?: LessonStep['sitting'] } = {}) => {
      const concrete = resolvePose(pose, MADHHABS[madhhab].practice, opts.sitting);
      setScene({ pose: concrete, highlights: opts.highlights ?? [], ...(opts.view ? { view: opts.view } : {}) });
    },
    [madhhab, setScene],
  );

  return { showAbstract, playAnimation, transitionToPose, setCameraView, setAutoCamera };
}
