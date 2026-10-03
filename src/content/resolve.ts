import type { PoseId } from '@/three/rig/poses';
import type { CameraView } from '@/three/camera';
import type { AbstractPose, LessonStep, MadhhabId, MadhhabPractice, RulingLevel, RulingSet } from './types';
import { MADHHABS } from './madhabs';
import { STEPS } from './prayer';

/** Map an abstract position to a concrete pose for the selected school. */
export function resolvePose(pose: AbstractPose, practice: MadhhabPractice, sitting?: LessonStep['sitting']): PoseId {
  const posture =
    sitting === 'first' ? practice.firstSitting : sitting === 'only' ? practice.singleSitting : practice.finalSitting;
  switch (pose) {
    case 'stand':
    case 'itidal':
      return 'stand';
    case 'qiyam':
      return practice.handPlacement === 'navel' ? 'qiyam_navel' : practice.handPlacement === 'chest' ? 'qiyam_chest' : 'stand';
    case 'takbir':
      return practice.takbirHands === 'ears' ? 'takbir_ears' : 'takbir_shoulders';
    case 'ruku':
      return 'ruku';
    case 'sujood':
      return 'sujood';
    case 'jalsa':
      return practice.jalsaPosture === 'tawarruk' ? 'tawarruk_rest' : 'jalsa';
    case 'firstSitting':
    case 'finalSitting':
      return posture === 'tawarruk' ? 'tawarruk' : 'tashahhud';
    case 'salamRight':
      return posture === 'tawarruk' ? 'salam_right_tw' : 'salam_right';
    case 'salamLeft':
      return posture === 'tawarruk' ? 'salam_left_tw' : 'salam_left';
  }
}

export interface ResolvedStep {
  pose: PoseId;
  view: CameraView;
}

export function resolveLessonStep(step: LessonStep, madhhab: MadhhabId): ResolvedStep {
  const content = STEPS[step.stepId];
  const practice = MADHHABS[madhhab].practice;
  let abstract = content.pose;
  if (step.stepId === 'complete') abstract = 'jalsa';
  // The middle sitting uses the first-sitting posture.
  if (step.stepId === 'tashahhud' && step.sitting === 'first') abstract = 'firstSitting';
  return { pose: resolvePose(abstract, practice, step.sitting), view: content.camera };
}

export function rulingFor(levels: RulingSet, madhhab: MadhhabId): RulingLevel | undefined {
  return levels[madhhab] ?? levels.common;
}
