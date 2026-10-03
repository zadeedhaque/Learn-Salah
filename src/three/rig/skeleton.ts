import { Bone } from 'three';

/**
 * Procedural humanoid skeleton.
 *
 * Conventions (rest / bind pose):
 *  - Units are metres, Y is up, the figure faces +Z (towards the qiblah in scene space).
 *  - The figure's LEFT side is +X.
 *  - Every bone has an identity rotation in the rest pose, so each bone's local frame is
 *    aligned with the world. Limbs hang along -Y, feet point along +Z.
 *  - Palms face the thighs in the rest pose (left palm faces -X, right palm faces +X).
 */

export type Side = 'L' | 'R';
export const SIDES: Side[] = ['L', 'R'];

export const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const;
export type Finger = (typeof FINGERS)[number];

type FingerBone = `${Finger}${1 | 2 | 3}${Side}`;
type LimbBone =
  | `shoulder${Side}`
  | `upperArm${Side}`
  | `forearm${Side}`
  | `hand${Side}`
  | `thigh${Side}`
  | `shin${Side}`
  | `foot${Side}`
  | `toes${Side}`;

export type BoneName = 'root' | 'hips' | 'spine' | 'chest' | 'neck' | 'head' | LimbBone | FingerBone;

export interface BoneDef {
  name: BoneName;
  parent: BoneName | null;
  offset: [number, number, number];
}

/** Body dimensions, kept in one place so the mesh builder and rig agree. */
export const DIM = {
  hipsY: 0.98,
  spine: 0.1,
  chest: 0.18,
  neck: 0.22,
  head: 0.09,
  shoulderX: 0.03,
  clavicle: 0.155,
  upperArm: 0.29,
  forearm: 0.26,
  hipX: 0.095,
  hipDrop: 0.06,
  thigh: 0.45,
  shin: 0.4,
  ankleToBall: 0.15,
  ankleHeight: 0.07,
} as const;

/** Phalanx lengths per finger (proximal → distal). */
const FINGER_SEGMENTS: Record<Finger, [number, number, number]> = {
  thumb: [0.036, 0.03, 0.024],
  index: [0.042, 0.025, 0.02],
  middle: [0.046, 0.028, 0.021],
  ring: [0.043, 0.026, 0.02],
  pinky: [0.034, 0.021, 0.018],
};

/** Knuckle positions for the LEFT hand, relative to the wrist. Mirrored in X for the right. */
const FINGER_BASES: Record<Finger, [number, number, number]> = {
  thumb: [-0.012, -0.028, 0.026],
  index: [0.0, -0.094, 0.024],
  middle: [0.0, -0.098, 0.007],
  ring: [0.0, -0.094, -0.01],
  pinky: [0.0, -0.086, -0.026],
};

/** Direction the thumb chain extends in the rest pose (down and forward). */
const THUMB_DIR: [number, number, number] = [-0.32, -0.8, 0.5];

function mirror(v: [number, number, number], side: Side): [number, number, number] {
  return side === 'L' ? v : [-v[0], v[1], v[2]];
}

function buildDefs(): BoneDef[] {
  const defs: BoneDef[] = [
    { name: 'root', parent: null, offset: [0, 0, 0] },
    { name: 'hips', parent: 'root', offset: [0, DIM.hipsY, 0] },
    { name: 'spine', parent: 'hips', offset: [0, DIM.spine, 0] },
    { name: 'chest', parent: 'spine', offset: [0, DIM.chest, 0] },
    { name: 'neck', parent: 'chest', offset: [0, DIM.neck, -0.012] },
    { name: 'head', parent: 'neck', offset: [0, DIM.head, 0.012] },
  ];
  for (const s of SIDES) {
    defs.push(
      { name: `shoulder${s}`, parent: 'chest', offset: mirror([DIM.shoulderX, 0.17, -0.012], s) },
      { name: `upperArm${s}`, parent: `shoulder${s}`, offset: mirror([DIM.clavicle, -0.025, 0], s) },
      { name: `forearm${s}`, parent: `upperArm${s}`, offset: [0, -DIM.upperArm, 0] },
      { name: `hand${s}`, parent: `forearm${s}`, offset: [0, -DIM.forearm, 0] },
      { name: `thigh${s}`, parent: 'hips', offset: mirror([DIM.hipX, -DIM.hipDrop, 0], s) },
      { name: `shin${s}`, parent: `thigh${s}`, offset: [0, -DIM.thigh, 0] },
      { name: `foot${s}`, parent: `shin${s}`, offset: [0, -DIM.shin, 0] },
      { name: `toes${s}`, parent: `foot${s}`, offset: [0, -0.055, DIM.ankleToBall] },
    );
    for (const f of FINGERS) {
      const seg = FINGER_SEGMENTS[f];
      defs.push({ name: `${f}1${s}`, parent: `hand${s}`, offset: mirror(FINGER_BASES[f], s) });
      const dir: [number, number, number] = f === 'thumb' ? THUMB_DIR : [0, -1, 0];
      const len = Math.hypot(dir[0], dir[1], dir[2]);
      for (let i = 1; i < 3; i++) {
        const l = seg[i - 1] / len;
        defs.push({
          name: `${f}${(i + 1) as 2 | 3}${s}`,
          parent: `${f}${i as 1 | 2}${s}`,
          offset: mirror([dir[0] * l, dir[1] * l, dir[2] * l], s),
        });
      }
    }
  }
  return defs;
}

export const BONE_DEFS: BoneDef[] = buildDefs();
export const BONE_NAMES: BoneName[] = BONE_DEFS.map((d) => d.name);
export const FINGER_TIP_LENGTH: Record<Finger, number> = Object.fromEntries(
  FINGERS.map((f) => [f, FINGER_SEGMENTS[f][2]]),
) as Record<Finger, number>;
export const FINGER_SEGMENT_LENGTHS = FINGER_SEGMENTS;
export const THUMB_DIRECTION = THUMB_DIR;

export type BoneMap = Record<BoneName, Bone>;

export interface Rig {
  root: Bone;
  bones: BoneMap;
}

/** Create a fresh bone hierarchy in the rest pose. Works without a WebGL context. */
export function createRig(): Rig {
  const bones = {} as BoneMap;
  for (const def of BONE_DEFS) {
    const b = new Bone();
    b.name = def.name;
    b.position.set(...def.offset);
    bones[def.name] = b;
    if (def.parent) bones[def.parent].add(b);
  }
  bones.root.updateMatrixWorld(true);
  return { root: bones.root, bones };
}
