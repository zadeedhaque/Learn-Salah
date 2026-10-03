import type { BoneName } from './skeleton.ts';

/**
 * Pose library.
 *
 * Poses are authored as a mix of forward kinematics (spine / head) and IK targets
 * (wrists and ankles in root space) so contact points such as palms on the floor,
 * knees on the ground and hands on the knees stay exact. Poses are "baked" into
 * per-bone quaternions once (see bake.ts) and the animation system interpolates
 * between baked poses.
 *
 * Every limb target is authored for the LEFT side; the right side is mirrored
 * automatically unless an explicit right-side target is supplied.
 */

export type V3 = [number, number, number];

export type HandShape = 'relaxed' | 'flat' | 'spread' | 'point' | 'fold' | 'open';

export interface ArmTarget {
  wrist: V3;
  /** Direction the elbow should point towards (or give an approximate elbow point). */
  pole?: V3;
  elbow?: V3;
  /** Direction the fingers point. */
  fingers: V3;
  /** Direction the palm faces. */
  palm: V3;
}

export interface LegTarget {
  ankle: V3;
  /** Direction the knee should point towards (or give an approximate knee point). */
  pole?: V3;
  knee?: V3;
  toes: V3;
  /** Direction the sole faces (outward from the sole). */
  sole: V3;
  /** Toe joint bend in degrees (negative = toes bent up / tucked). */
  toeBend?: number;
}

export interface PoseFocus {
  /** Point the camera should look at. */
  target: V3;
  /** Width and height (metres) the camera should keep in frame. */
  size: [number, number];
}

export interface PoseSpec {
  id: PoseId;
  hips: { pos: V3; rot: V3 };
  /** Local rotations in degrees, Euler order YXZ. Left-side bones are mirrored to the right. */
  fk?: Partial<Record<BoneName, V3>>;
  arms?: { L?: ArmTarget; R?: ArmTarget };
  legs?: { L?: LegTarget; R?: LegTarget };
  hands?: { L?: HandShape; R?: HandShape };
  focus: PoseFocus;
}

export type PoseId =
  | 'stand'
  | 'qiyam_navel'
  | 'qiyam_chest'
  | 'takbir_ears'
  | 'takbir_shoulders'
  | 'ruku'
  | 'kneel'
  | 'crouch'
  | 'sujood'
  | 'jalsa'
  | 'tashahhud'
  | 'tawarruk'
  | 'tawarruk_rest'
  | 'salam_right'
  | 'salam_left'
  | 'salam_right_tw'
  | 'salam_left_tw';

const STANDING_FOCUS: PoseFocus = { target: [0, 0.93, 0.05], size: [0.9, 1.95] };

const STANDING_LEGS: LegTarget = {
  ankle: [0.1, 0.07, 0],
  pole: [0, 0, 1],
  toes: [0.14, 0, 1],
  sole: [0, -1, 0],
};

const TUCKED_FOOT: Omit<LegTarget, 'ankle' | 'pole'> = {
  toes: [0, -1, 0.12],
  sole: [0, 0.08, -1],
  toeBend: -78,
};

const stand: PoseSpec = {
  id: 'stand',
  hips: { pos: [0, 0.98, 0], rot: [0, 0, 0] },
  fk: {
    upperArmL: [2, 0, 5],
    forearmL: [-12, 0, 0],
    handL: [0, 0, 3],
  },
  legs: { L: STANDING_LEGS },
  hands: { L: 'relaxed', R: 'relaxed' },
  focus: STANDING_FOCUS,
};

function folded(y: number, zLeft: number): PoseSpec['arms'] {
  return {
    L: { wrist: [0.07, y, zLeft], pole: [0.75, -0.25, -0.6], fingers: [-0.96, -0.28, 0.02], palm: [0, 0.05, -1] },
    R: { wrist: [-0.07, y + 0.012, zLeft + 0.026], pole: [-0.75, -0.25, -0.6], fingers: [0.96, -0.22, 0.04], palm: [0, 0.08, -1] },
  };
}

const qiyamNavel: PoseSpec = {
  ...stand,
  id: 'qiyam_navel',
  fk: { neck: [4, 0, 0], head: [8, 0, 0] },
  arms: folded(1.0, 0.158),
  hands: { L: 'fold', R: 'fold' },
};

const qiyamChest: PoseSpec = {
  ...qiyamNavel,
  id: 'qiyam_chest',
  arms: folded(1.14, 0.158),
};

function takbir(id: PoseId, wrist: V3): PoseSpec {
  return {
    ...stand,
    id,
    fk: { shoulderL: [0, 0, 8] },
    arms: { L: { wrist, elbow: [wrist[0] + 0.13, wrist[1] - 0.24, wrist[2] + 0.04], fingers: [0.02, 1, 0.08], palm: [-0.1, 0, 1] } },
    hands: { L: 'open', R: 'open' },
  };
}

const ruku: PoseSpec = {
  id: 'ruku',
  hips: { pos: [0, 0.912, -0.1], rot: [83, 0, 0] },
  fk: { spine: [4, 0, 0], chest: [3, 0, 0], neck: [-2, 0, 0], head: [0, 0, 0] },
  legs: { L: STANDING_LEGS },
  arms: { L: { wrist: [0.125, 0.585, 0.045], pole: [0.6, 0.2, -0.4], fingers: [0.02, -0.92, 0.4], palm: [-0.05, -0.25, -1] } },
  hands: { L: 'spread', R: 'spread' },
  focus: { target: [0, 0.72, 0.12], size: [1.2, 1.55] },
};

const kneel: PoseSpec = {
  id: 'kneel',
  hips: { pos: [0, 0.556, 0.3], rot: [28, 0, 0] },
  fk: { spine: [6, 0, 0], chest: [4, 0, 0], head: [10, 0, 0] },
  legs: { L: { ankle: [0.1, 0.16, -0.02], pole: [0, -0.2, 1], ...TUCKED_FOOT } },
  arms: { L: { wrist: [0.18, 0.38, 0.6], pole: [0.8, 0.2, -0.5], fingers: [0, -0.55, 0.85], palm: [0, -0.85, -0.2] } },
  hands: { L: 'flat', R: 'flat' },
  focus: { target: [0, 0.5, 0.35], size: [1.3, 1.4] },
};

const crouch: PoseSpec = {
  id: 'crouch',
  hips: { pos: [0, 0.62, -0.16], rot: [86, 0, 0] },
  fk: { spine: [14, 0, 0], chest: [12, 0, 0], head: [-10, 0, 0] },
  legs: { L: { ...STANDING_LEGS, pole: [0, 0.1, 1] } },
  arms: { L: { wrist: [0.2, 0.04, 0.56], pole: [0.8, 0.3, -0.4], fingers: [0, 0, 1], palm: [0, -1, 0] } },
  hands: { L: 'flat', R: 'flat' },
  focus: { target: [0, 0.5, 0.25], size: [1.3, 1.4] },
};

const sujood: PoseSpec = {
  id: 'sujood',
  hips: { pos: [0, 0.494, 0.44], rot: [100, 0, 0] },
  fk: { spine: [21, 0, 0], chest: [18, 0, 0], neck: [-6, 0, 0], head: [-20, 0, 0] },
  legs: { L: { ankle: [0.1, 0.18, 0.0], pole: [0, -0.2, 1], ...TUCKED_FOOT } },
  arms: { L: { wrist: [0.19, 0.035, 0.8], elbow: [0.3, 0.3, 0.72], fingers: [-0.04, 0, 1], palm: [0, -1, 0] } },
  hands: { L: 'flat', R: 'flat' },
  focus: { target: [0, 0.32, 0.45], size: [1.45, 1.05] },
};

const SITTING_HANDS: ArmTarget = { wrist: [0.125, 0.28, 0.12], pole: [1, -0.2, -0.5], fingers: [0, -0.22, 1], palm: [0, -1, 0] };

const jalsa: PoseSpec = {
  id: 'jalsa',
  hips: { pos: [0, 0.36, -0.07], rot: [-3, 0, 0] },
  fk: { spine: [4, 0, 0], chest: [2, 0, 0], neck: [4, 0, 0], head: [10, 0, 0] },
  legs: {
    // Left foot laid down and sat upon; right foot upright with the toes bent.
    L: { ankle: [0.09, 0.075, -0.08], knee: [0.13, 0.055, 0.31], toes: [-0.45, -0.1, -0.9], sole: [0.05, 1, 0] },
    R: { ankle: [-0.1, 0.17, -0.07], knee: [-0.13, 0.058, 0.31], ...TUCKED_FOOT },
  },
  arms: { L: SITTING_HANDS },
  hands: { L: 'flat', R: 'flat' },
  focus: { target: [0, 0.6, 0.12], size: [1.1, 1.3] },
};

const POINTING_RIGHT: ArmTarget = { wrist: [-0.13, 0.292, 0.12], pole: [-1, -0.2, -0.5], fingers: [0, -0.1, 1], palm: [0.55, -0.8, 0] };

const tashahhud: PoseSpec = {
  ...jalsa,
  id: 'tashahhud',
  arms: { L: SITTING_HANDS, R: POINTING_RIGHT },
  hands: { L: 'flat', R: 'point' },
};

const tawarruk: PoseSpec = {
  id: 'tawarruk',
  hips: { pos: [0.05, 0.225, -0.05], rot: [-3, 0, -5] },
  fk: { spine: [4, 0, 3], chest: [2, 0, 2], neck: [4, 0, 0], head: [10, 0, 0] },
  legs: {
    // Left foot brought out beneath the right shin; sitting on the floor.
    L: { ankle: [-0.17, 0.065, 0.12], knee: [0.13, 0.055, 0.4], toes: [-1, -0.05, -0.25], sole: [0, 0.55, -0.85] },
    R: { ankle: [-0.19, 0.17, -0.06], knee: [-0.17, 0.06, 0.34], ...TUCKED_FOOT },
  },
  arms: {
    L: { ...SITTING_HANDS, wrist: [0.15, 0.2, 0.12] },
    R: { ...POINTING_RIGHT, wrist: [-0.11, 0.215, 0.12] },
  },
  hands: { L: 'flat', R: 'point' },
  focus: { target: [0, 0.56, 0.12], size: [1.1, 1.25] },
};

const tawarrukRest: PoseSpec = {
  ...tawarruk,
  id: 'tawarruk_rest',
  arms: { L: tawarruk.arms!.L },
  hands: { L: 'flat', R: 'flat' },
};

function turnHead(base: PoseSpec, id: PoseId, dir: 1 | -1): PoseSpec {
  return {
    ...base,
    id,
    fk: { ...base.fk, neck: [4, 30 * dir, 0], head: [8, 42 * dir, 0] },
    hands: { L: 'flat', R: 'flat' },
    arms: { L: base.arms!.L },
  };
}

export const POSES: Record<PoseId, PoseSpec> = {
  stand,
  qiyam_navel: qiyamNavel,
  qiyam_chest: qiyamChest,
  takbir_ears: takbir('takbir_ears', [0.17, 1.5, 0.15]),
  takbir_shoulders: takbir('takbir_shoulders', [0.19, 1.32, 0.19]),
  ruku,
  kneel,
  crouch,
  sujood,
  jalsa,
  tashahhud,
  tawarruk,
  tawarruk_rest: tawarrukRest,
  // Turning right = towards the figure's right side (-X), i.e. negative yaw.
  salam_right: turnHead(jalsa, 'salam_right', -1),
  salam_left: turnHead(jalsa, 'salam_left', 1),
  salam_right_tw: turnHead(tawarruk, 'salam_right_tw', -1),
  salam_left_tw: turnHead(tawarruk, 'salam_left_tw', 1),
};

export const POSE_IDS = Object.keys(POSES) as PoseId[];
