import { Bone, Matrix4, Quaternion, Vector3 } from 'three';
import type { Side } from './skeleton.ts';

const _A = new Vector3();
const _dir = new Vector3();
const _pd = new Vector3();
const _n = new Vector3();
const _Bp = new Vector3();
const _Tp = new Vector3();
const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();
const _m = new Matrix4();
const _q = new Quaternion();
const _pq = new Quaternion();
const _tmp = new Vector3();

/** Apply a world-space rotation (as a basis) to a bone by converting it into its parent's space. */
function setWorldBasis(bone: Bone, x: Vector3, y: Vector3, z: Vector3) {
  _m.makeBasis(x, y, z);
  _q.setFromRotationMatrix(_m);
  if (bone.parent) {
    bone.parent.getWorldQuaternion(_pq);
    _q.premultiply(_pq.invert());
  }
  bone.quaternion.copy(_q);
  bone.updateMatrixWorld(true);
}

/**
 * Orient a limb bone whose rest child-axis is local -Y so that it points along `dir`.
 * `bendNormal` fixes the twist: the hinge axis (local X) maps to `sign * bendNormal`.
 */
function aimLimbBone(bone: Bone, dir: Vector3, bendNormal: Vector3, sign: number) {
  _y.copy(dir).normalize().negate();
  _x.copy(bendNormal).multiplyScalar(sign);
  _x.addScaledVector(_y, -_x.dot(_y)).normalize();
  _z.crossVectors(_x, _y).normalize();
  setWorldBasis(bone, _x, _y, _z);
}

/**
 * Analytic two-bone IK.
 * @param target   world position for the end joint (wrist / ankle)
 * @param poleDir  world direction the middle joint (elbow / knee) should point towards
 * @param sign     -1 for arms (elbow flexes forward about -X), +1 for legs (knee flexes about +X)
 */
export function solveTwoBone(
  upper: Bone,
  lower: Bone,
  end: Bone,
  target: Vector3,
  poleDir: Vector3,
  sign: number,
) {
  upper.updateMatrixWorld(true);
  upper.getWorldPosition(_A);
  const a = lower.position.length();
  const b = end.position.length();

  _dir.subVectors(target, _A);
  const d = Math.min(Math.max(_dir.length(), 1e-3), a + b - 1e-4);
  _dir.normalize();

  _pd.copy(poleDir).addScaledVector(_dir, -poleDir.dot(_dir));
  if (_pd.lengthSq() < 1e-8) _pd.set(0, 0, 1).addScaledVector(_dir, -_dir.z);
  _pd.normalize();

  const cosA = Math.min(Math.max((a * a + d * d - b * b) / (2 * a * d), -1), 1);
  const sinA = Math.sqrt(1 - cosA * cosA);
  _Bp.copy(_A).addScaledVector(_dir, cosA * a).addScaledVector(_pd, sinA * a);
  _Tp.copy(_A).addScaledVector(_dir, d);
  _n.crossVectors(_pd, _dir).normalize();

  aimLimbBone(upper, _tmp.subVectors(_Bp, _A), _n, sign);
  aimLimbBone(lower, _tmp.subVectors(_Tp, _Bp), _n, sign);
}

/** Point the hand's fingers along `fingers` with the palm facing `palm` (world space). */
export function orientHand(hand: Bone, side: Side, fingers: Vector3, palm: Vector3) {
  _y.copy(fingers).normalize().negate();
  _x.copy(palm).multiplyScalar(side === 'L' ? -1 : 1);
  _x.addScaledVector(_y, -_x.dot(_y)).normalize();
  _z.crossVectors(_x, _y).normalize();
  setWorldBasis(hand, _x, _y, _z);
}

/** Point the foot's toes along `toes` with the sole facing `sole` (world space). */
export function orientFoot(foot: Bone, toes: Vector3, sole: Vector3) {
  _y.copy(sole).normalize().negate();
  _z.copy(toes).addScaledVector(_y, -toes.dot(_y)).normalize();
  _x.crossVectors(_y, _z).normalize();
  setWorldBasis(foot, _x, _y, _z);
}
