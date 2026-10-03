import { Quaternion, Vector3 } from 'three';
import { BONE_NAMES } from '../rig/skeleton.ts';
import type { BoneName, Rig } from '../rig/skeleton.ts';
import { getBakedPose } from '../rig/bake.ts';
import type { BakedPose } from '../rig/bake.ts';
import type { PoseId } from '../rig/poses.ts';
import { transitionPath } from './transitions.ts';
import type { PathPreferences } from './transitions.ts';

export type Easing = 'easeInOut' | 'linear' | 'easeOut';

export interface TransitionOptions {
  /** Seconds for the whole transition (all waypoints). Defaults to a distance-based duration. */
  duration?: number;
  easing?: Easing;
  /** Multiplier applied to the automatic duration. */
  speed?: number;
  prefs?: PathPreferences;
}

interface Segment {
  to: BakedPose;
  duration: number;
  /** Velocity at the start / end of this segment (0 = at rest), for smooth waypoints. */
  v0: number;
  v1: number;
}

/**
 * Lead/lag per bone as a fraction of each segment. The core moves first and the
 * hands and fingers settle last, which reads as deliberate, natural movement.
 */
function delayFor(name: BoneName): number {
  if (name === 'hips' || name === 'root') return 0;
  if (name === 'spine' || name.startsWith('thigh') || name.startsWith('shin')) return 0.03;
  if (name === 'chest' || name.startsWith('foot') || name.startsWith('toes')) return 0.06;
  if (name === 'neck' || name === 'head') return 0.1;
  if (name.startsWith('shoulder') || name.startsWith('upperArm')) return 0.1;
  if (name.startsWith('forearm')) return 0.14;
  if (name.startsWith('hand')) return 0.18;
  return 0.22; // fingers
}

const DELAYS = Object.fromEntries(BONE_NAMES.map((n) => [n, delayFor(n)])) as Record<BoneName, number>;

/** Cubic Hermite easing with normalised start/end velocities. */
function hermite(t: number, v0: number, v1: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (t3 - 2 * t2 + t) * v0 + (-2 * t3 + 3 * t2) + (t3 - t2) * v1;
}

const MAJOR: BoneName[] = ['hips', 'spine', 'chest', 'thighL', 'thighR', 'shinL', 'shinR', 'upperArmL', 'upperArmR', 'forearmL', 'forearmR', 'head'];

function poseDistance(a: { quats: Record<BoneName, Quaternion>; hipsPos: Vector3 }, b: BakedPose) {
  let d = a.hipsPos.distanceTo(b.hipsPos) * 2.2;
  for (const n of MAJOR) d += a.quats[n].angleTo(b.quats[n]) * 0.22;
  return d;
}

/**
 * Centralised pose animation for the prayer figure.
 *
 *   animator.transitionToPose('ruku', { duration: 1.2, easing: 'easeInOut' })
 *
 * Every frame `update(dt)` writes interpolated local rotations into the rig. A
 * subtle breathing layer keeps the figure from looking like a static mannequin.
 */
export class PoseAnimator {
  readonly rig: Rig;
  private target: PoseId = 'stand';
  private segments: Segment[] = [];
  private segT = 0;
  private from = { quats: {} as Record<BoneName, Quaternion>, hipsPos: new Vector3() };
  private time = 0;
  private listeners = new Set<(pose: PoseId, done: boolean) => void>();
  breathing = true;
  enabled = true;

  constructor(rig: Rig, initial: PoseId = 'stand') {
    this.rig = rig;
    for (const n of BONE_NAMES) this.from.quats[n] = new Quaternion();
    this.setPose(initial);
  }

  get currentTarget() {
    return this.target;
  }

  get isAnimating() {
    return this.segments.length > 0;
  }

  onChange(fn: (pose: PoseId, done: boolean) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Jump to a pose immediately (reduced motion, initial state). */
  setPose(id: PoseId) {
    const p = getBakedPose(id);
    this.target = id;
    this.segments = [];
    this.write(p.quats, p.hipsPos);
    this.listeners.forEach((l) => l(id, true));
  }

  /** Alias matching the public API naming used across the app. */
  playAnimation(id: PoseId, opts?: TransitionOptions) {
    this.transitionToPose(id, opts);
  }

  transitionToPose(id: PoseId, opts: TransitionOptions = {}) {
    if (!this.enabled) {
      this.setPose(id);
      return;
    }
    const prefs = opts.prefs ?? { handsFirst: false, restBeforeRising: false };
    const path = id === this.target && !this.segments.length ? [] : transitionPath(this.target, id, prefs);
    this.target = id;
    if (!path.length) return;

    this.snapshot();
    let prev: { quats: Record<BoneName, Quaternion>; hipsPos: Vector3 } = this.from;
    const baked = path.map((p) => getBakedPose(p));
    const auto = baked.map((b) => {
      const d = poseDistance(prev, b);
      prev = b;
      return Math.min(Math.max(0.45 + d * 0.42, 0.55), 1.7);
    });
    const autoTotal = auto.reduce((s, x) => s + x, 0);
    const scale = (opts.duration ? opts.duration / autoTotal : 1) / (opts.speed ?? 1);
    const n = baked.length;
    this.segments = baked.map((to, i) => ({
      to,
      duration: Math.max(auto[i] * scale, 0.05),
      v0: i === 0 ? (opts.easing === 'linear' ? 1 : 0) : 1,
      v1: i === n - 1 ? (opts.easing === 'linear' ? 1 : 0) : 1,
    }));
    this.segT = 0;
    this.listeners.forEach((l) => l(id, false));
  }

  private snapshot() {
    for (const n of BONE_NAMES) this.from.quats[n].copy(this.rig.bones[n].quaternion);
    this.from.hipsPos.copy(this.rig.bones.hips.position);
  }

  private write(quats: Record<BoneName, Quaternion>, hipsPos: Vector3) {
    for (const n of BONE_NAMES) this.rig.bones[n].quaternion.copy(quats[n]);
    this.rig.bones.hips.position.copy(hipsPos);
  }

  private settled = getBakedPose('stand');
  private tmpQ = new Quaternion();
  private breathQ = new Quaternion();

  update(dt: number) {
    this.time += dt;
    const seg = this.segments[0];
    if (seg) {
      this.segT += dt / seg.duration;
      const t = Math.min(this.segT, 1);
      const { bones } = this.rig;
      for (const n of BONE_NAMES) {
        const d = DELAYS[n];
        const lt = Math.min(Math.max((t - d) / (1 - d), 0), 1);
        const e = hermite(lt, seg.v0, seg.v1);
        bones[n].quaternion.slerpQuaternions(this.from.quats[n], seg.to.quats[n], e);
      }
      bones.hips.position.lerpVectors(this.from.hipsPos, seg.to.hipsPos, hermite(t, seg.v0, seg.v1));
      if (t >= 1) {
        this.segments.shift();
        this.settled = seg.to;
        this.snapshot();
        this.segT = 0;
        if (!this.segments.length) this.listeners.forEach((l) => l(this.target, true));
      }
    } else {
      const p = getBakedPose(this.target);
      if (this.settled !== p) this.settled = p;
      this.write(p.quats, p.hipsPos);
    }
    if (this.breathing) this.applyBreathing();
  }

  private applyBreathing() {
    const s = Math.sin(this.time * 1.25);
    const { bones } = this.rig;
    this.breathQ.setFromAxisAngle(AXIS_X, s * 0.008);
    bones.chest.quaternion.multiply(this.breathQ);
    this.tmpQ.setFromAxisAngle(AXIS_X, -s * 0.004);
    bones.neck.quaternion.multiply(this.tmpQ);
    this.tmpQ.setFromAxisAngle(AXIS_Z, s * 0.012);
    bones.shoulderL.quaternion.multiply(this.tmpQ);
    this.tmpQ.setFromAxisAngle(AXIS_Z, -s * 0.012);
    bones.shoulderR.quaternion.multiply(this.tmpQ);
  }
}

const AXIS_X = new Vector3(1, 0, 0);
const AXIS_Z = new Vector3(0, 0, 1);
