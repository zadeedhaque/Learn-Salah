import type { BoneName } from '../rig/skeleton.ts';
import type { V3 } from '../rig/poses.ts';

/** Body regions that instructional steps can draw attention to. */
export type BodyPart =
  | 'head'
  | 'forehead'
  | 'gaze'
  | 'back'
  | 'chest'
  | 'hands'
  | 'fingers'
  | 'index'
  | 'elbows'
  | 'knees'
  | 'feet'
  | 'toes'
  | 'seat';

export interface Anchor {
  bone: BoneName;
  offset: V3;
}

/**
 * Where each body part sits relative to the rig. Used for highlights and labels.
 * A replacement model only needs the same bone names (see GltfPrayerModel).
 */
export const BODY_ANCHORS: Record<BodyPart, Anchor[]> = {
  head: [{ bone: 'head', offset: [0, 0.11, 0] }],
  forehead: [{ bone: 'head', offset: [0, 0.13, 0.09] }],
  gaze: [{ bone: 'head', offset: [0, 0.09, 0.11] }],
  back: [
    { bone: 'spine', offset: [0, 0.05, -0.14] },
    { bone: 'chest', offset: [0, 0.06, -0.13] },
  ],
  chest: [{ bone: 'chest', offset: [0, 0.08, 0.14] }],
  hands: [
    { bone: 'handL', offset: [0, -0.06, 0] },
    { bone: 'handR', offset: [0, -0.06, 0] },
  ],
  fingers: [
    { bone: 'middle2L', offset: [0, 0, 0] },
    { bone: 'middle2R', offset: [0, 0, 0] },
  ],
  index: [{ bone: 'index2R', offset: [0, -0.01, 0] }],
  elbows: [
    { bone: 'forearmL', offset: [0, 0, 0] },
    { bone: 'forearmR', offset: [0, 0, 0] },
  ],
  knees: [
    { bone: 'shinL', offset: [0, 0, 0.05] },
    { bone: 'shinR', offset: [0, 0, 0.05] },
  ],
  feet: [
    { bone: 'footL', offset: [0, -0.035, 0.05] },
    { bone: 'footR', offset: [0, -0.035, 0.05] },
  ],
  toes: [
    { bone: 'toesL', offset: [0, 0, 0.03] },
    { bone: 'toesR', offset: [0, 0, 0.03] },
  ],
  seat: [{ bone: 'hips', offset: [0, -0.1, -0.11] }],
};
