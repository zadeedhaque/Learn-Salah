import { usePrayerStore } from '@/store/prayerStore';
import type { BodyPart } from './model/anchors';
import type { CameraView } from './camera';
import type { PoseId } from './rig/poses';
import type { TransitionOptions } from './animation/PoseAnimator';

/**
 * Public 3D API. Pages call these; the store is the single source of truth and
 * the AnimationController / CameraController react to it.
 *
 *   playAnimation('ruku')
 *   transitionToPose('sujood', { duration: 1.2, easing: 'easeInOut' })
 *   setCameraView('side')
 */
let pendingOptions: TransitionOptions | null = null;

export function playAnimation(pose: PoseId, highlights?: BodyPart[]) {
  usePrayerStore.getState().setScene(highlights ? { pose, highlights } : { pose });
}

export function transitionToPose(pose: PoseId, opts: TransitionOptions = {}) {
  pendingOptions = opts;
  playAnimation(pose);
}

/** Used by the AnimationController; returns options passed to transitionToPose once. */
export function consumeTransitionOptions(): TransitionOptions | null {
  const o = pendingOptions;
  pendingOptions = null;
  return o;
}

/** Manually choose a camera angle (turns automatic camera off). */
export function setCameraView(view: CameraView) {
  usePrayerStore.getState().setManualView(view);
}

export function setAutoCamera(on: boolean) {
  usePrayerStore.getState().setAutoCamera(on);
}
