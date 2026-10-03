import { Bone, Euler, MathUtils, Quaternion, Vector3 } from 'three';
import { BONE_NAMES, FINGERS, SIDES, createRig } from './skeleton.ts';
import type { BoneName, Rig, Side } from './skeleton.ts';
import { orientFoot, orientHand, solveTwoBone } from './ik.ts';
import { POSES } from './poses.ts';
import type { ArmTarget, HandShape, LegTarget, PoseId, PoseSpec, V3 } from './poses.ts';

export interface BakedPose {
  id: PoseId;
  hipsPos: Vector3;
  quats: Record<BoneName, Quaternion>;
}

const D = MathUtils.DEG2RAD;
const _e = new Euler(0, 0, 0, 'YXZ');
const _v = new Vector3();
const _w = new Vector3();
const _p = new Vector3();

/** Mirror a left-side target to the right side (negate X of every vector). */
function mx(v: V3): V3;
function mx(v: V3 | undefined): V3 | undefined;
function mx(v: V3 | undefined): V3 | undefined {
  return v && [-v[0], v[1], v[2]];
}
function mirrorArm(t: ArmTarget): ArmTarget {
  return { wrist: mx(t.wrist), pole: mx(t.pole), elbow: mx(t.elbow), fingers: mx(t.fingers), palm: mx(t.palm) };
}
function mirrorLeg(t: LegTarget): LegTarget {
  return { ...t, ankle: mx(t.ankle), pole: mx(t.pole), knee: mx(t.knee), toes: mx(t.toes), sole: mx(t.sole) };
}

function mirrorName(name: BoneName): BoneName | null {
  if (name.endsWith('L')) return (name.slice(0, -1) + 'R') as BoneName;
  return null;
}

function setFk(rig: Rig, name: BoneName, deg: V3) {
  _e.set(deg[0] * D, deg[1] * D, deg[2] * D, 'YXZ');
  rig.bones[name].quaternion.setFromEuler(_e);
}

interface ShapeDef {
  curl: Record<string, V3>;
  spread: Record<string, number>;
  thumb: [V3, V3, V3];
}

/** Finger curl per joint (degrees) and spread, authored for the LEFT hand. */
const SHAPES: Record<HandShape, ShapeDef> = {
  relaxed: {
    curl: { index: [14, 18, 10], middle: [18, 22, 12], ring: [22, 24, 12], pinky: [24, 26, 14] },
    spread: { index: -3, middle: 0, ring: 2, pinky: 5 },
    thumb: [[12, 0, -10], [0, 0, -12], [0, 0, -10]],
  },
  open: {
    curl: { index: [4, 5, 3], middle: [5, 6, 3], ring: [6, 7, 4], pinky: [7, 8, 4] },
    spread: { index: -4, middle: -1, ring: 2, pinky: 5 },
    thumb: [[2, 0, -2], [0, 0, -4], [0, 0, -4]],
  },
  flat: {
    curl: { index: [3, 4, 2], middle: [3, 4, 2], ring: [4, 5, 3], pinky: [5, 6, 3] },
    spread: { index: -2, middle: 0, ring: 1, pinky: 3 },
    thumb: [[8, 0, 2], [0, 0, -4], [0, 0, -4]],
  },
  spread: {
    curl: { index: [22, 26, 14], middle: [24, 28, 16], ring: [26, 30, 16], pinky: [26, 30, 16] },
    spread: { index: -9, middle: -2, ring: 5, pinky: 11 },
    thumb: [[-8, 0, -8], [0, 0, -16], [0, 0, -12]],
  },
  fold: {
    curl: { index: [14, 16, 8], middle: [16, 18, 9], ring: [18, 20, 10], pinky: [22, 22, 12] },
    spread: { index: -1, middle: 0, ring: 1, pinky: 2 },
    thumb: [[24, 0, -14], [0, 0, -18], [0, 0, -14]],
  },
  point: {
    curl: { index: [4, 3, 2], middle: [82, 96, 58], ring: [86, 98, 58], pinky: [88, 98, 58] },
    spread: { index: 0, middle: 0, ring: 1, pinky: 2 },
    thumb: [[22, 0, -34], [0, 0, -30], [0, 0, -20]],
  },
};

function applyHandShape(rig: Rig, side: Side, shape: HandShape) {
  const s = SHAPES[shape];
  const m = side === 'L' ? 1 : -1;
  for (const f of FINGERS) {
    if (f === 'thumb') {
      s.thumb.forEach((deg, i) => setFk(rig, `thumb${(i + 1) as 1 | 2 | 3}${side}`, [deg[0], deg[1] * m, deg[2] * m]));
      continue;
    }
    const c = s.curl[f];
    // Curl about local Z towards the palm; spread about local X (same sign on both sides).
    setFk(rig, `${f}1${side}`, [s.spread[f], 0, -c[0] * m]);
    setFk(rig, `${f}2${side}`, [0, 0, -c[1] * m]);
    setFk(rig, `${f}3${side}`, [0, 0, -c[2] * m]);
  }
}

/** Pole direction from an explicit joint point (relative to the chain root) or a direction. */
function poleFor(chainRoot: Bone, point: V3 | undefined, dir: V3 | undefined): Vector3 {
  if (point) return chainRoot.getWorldPosition(_w).negate().add(_p.set(...point));
  return _w.set(...(dir ?? [0, 0, 1]));
}

function resetRig(rig: Rig) {
  for (const name of BONE_NAMES) rig.bones[name].quaternion.identity();
}

/** Pose the rig in place according to a spec. */
export function applySpec(rig: Rig, spec: PoseSpec) {
  resetRig(rig);
  const { bones } = rig;
  bones.hips.position.set(...spec.hips.pos);
  setFk(rig, 'hips', spec.hips.rot);

  // Rotations are pseudovectors: mirroring across X keeps the X angle and negates Y and Z.
  for (const [name, deg] of Object.entries(spec.fk ?? {}) as [BoneName, V3][]) {
    setFk(rig, name, deg);
    const mirrored = mirrorName(name);
    if (mirrored && !(spec.fk && mirrored in spec.fk)) setFk(rig, mirrored, [deg[0], -deg[1], -deg[2]]);
  }
  rig.root.updateMatrixWorld(true);

  for (const side of SIDES) {
    const leg = side === 'L' ? spec.legs?.L : (spec.legs?.R ?? (spec.legs?.L && mirrorLeg(spec.legs.L)));
    if (leg) {
      solveTwoBone(bones[`thigh${side}`], bones[`shin${side}`], bones[`foot${side}`], _v.set(...leg.ankle), poleFor(bones[`thigh${side}`], leg.knee, leg.pole), 1);
      orientFoot(bones[`foot${side}`], _v.set(...leg.toes), _w.set(...leg.sole));
      if (leg.toeBend) setFk(rig, `toes${side}`, [leg.toeBend, 0, 0]);
    }
  }
  rig.root.updateMatrixWorld(true);

  for (const side of SIDES) {
    const arm = side === 'L' ? spec.arms?.L : (spec.arms?.R ?? (spec.arms?.L && mirrorArm(spec.arms.L)));
    if (arm) {
      solveTwoBone(bones[`upperArm${side}`], bones[`forearm${side}`], bones[`hand${side}`], _v.set(...arm.wrist), poleFor(bones[`upperArm${side}`], arm.elbow, arm.pole), -1);
      orientHand(bones[`hand${side}`], side, _v.set(...arm.fingers), _w.set(...arm.palm));
    }
    const shape = spec.hands?.[side];
    if (shape) applyHandShape(rig, side, shape);
  }
  rig.root.updateMatrixWorld(true);
}

const cache = new Map<PoseId, BakedPose>();
let bakeRig: Rig | null = null;

/** Bake a pose into per-bone local quaternions (cached). */
export function getBakedPose(id: PoseId): BakedPose {
  const hit = cache.get(id);
  if (hit) return hit;
  bakeRig ??= createRig();
  applySpec(bakeRig, POSES[id]);
  const quats = {} as Record<BoneName, Quaternion>;
  for (const name of BONE_NAMES) quats[name] = bakeRig.bones[name].quaternion.clone();
  const baked: BakedPose = { id, hipsPos: bakeRig.bones.hips.position.clone(), quats };
  cache.set(id, baked);
  return baked;
}
