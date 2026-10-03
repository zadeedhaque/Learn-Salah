import { Object3D, Quaternion, Vector3 } from 'three';
import { BONE_DEFS, BONE_NAMES } from '../rig/skeleton.ts';
import type { BoneName, Rig } from '../rig/skeleton.ts';

/**
 * Retargets poses from the internal rig onto an imported skeleton (e.g. a .glb).
 *
 * The internal rig has identity rest rotations, so a bone's world rotation in any
 * pose is exactly the world-space delta from rest. For the target we apply:
 *
 *   targetWorld = sourceWorldDelta * targetRestWorld
 *   targetLocal = inverse(parentWorld) * targetWorld
 *
 * which works for skeletons with arbitrary rest orientations (Mixamo, Blender
 * Rigify exports, …) as long as they face +Z and are roughly T/A-posed.
 */
export interface RetargetBinding {
  bones: Partial<Record<BoneName, Object3D>>;
  restWorld: Partial<Record<BoneName, Quaternion>>;
  hipsRestPos: Vector3;
  heightScale: number;
}

/** Common bone naming schemes mapped to the internal names. */
export const MIXAMO_MAP: Partial<Record<BoneName, string>> = {
  hips: 'mixamorigHips',
  spine: 'mixamorigSpine1',
  chest: 'mixamorigSpine2',
  neck: 'mixamorigNeck',
  head: 'mixamorigHead',
  shoulderL: 'mixamorigLeftShoulder',
  upperArmL: 'mixamorigLeftArm',
  forearmL: 'mixamorigLeftForeArm',
  handL: 'mixamorigLeftHand',
  shoulderR: 'mixamorigRightShoulder',
  upperArmR: 'mixamorigRightArm',
  forearmR: 'mixamorigRightForeArm',
  handR: 'mixamorigRightHand',
  thighL: 'mixamorigLeftUpLeg',
  shinL: 'mixamorigLeftLeg',
  footL: 'mixamorigLeftFoot',
  toesL: 'mixamorigLeftToeBase',
  thighR: 'mixamorigRightUpLeg',
  shinR: 'mixamorigRightLeg',
  footR: 'mixamorigRightFoot',
  toesR: 'mixamorigRightToeBase',
};

export function createBinding(root: Object3D, nameMap: Partial<Record<BoneName, string>> = {}): RetargetBinding {
  root.updateMatrixWorld(true);
  const bones: Partial<Record<BoneName, Object3D>> = {};
  const restWorld: Partial<Record<BoneName, Quaternion>> = {};
  for (const name of BONE_NAMES) {
    const obj = root.getObjectByName(nameMap[name] ?? name);
    if (!obj) continue;
    bones[name] = obj;
    restWorld[name] = obj.getWorldQuaternion(new Quaternion());
  }
  const hips = bones.hips;
  const hipsRestPos = hips ? hips.position.clone() : new Vector3();
  const hipsWorldY = hips ? hips.getWorldPosition(new Vector3()).y : 0.98;
  return { bones, restWorld, hipsRestPos, heightScale: hipsWorldY / 0.98 };
}

const _q = new Quaternion();
const _pq = new Quaternion();
const _src = new Quaternion();

/** Copy the source rig's current pose onto the bound target skeleton. */
export function applyRetarget(source: Rig, binding: RetargetBinding) {
  source.root.updateMatrixWorld(true);
  for (const def of BONE_DEFS) {
    const target = binding.bones[def.name];
    const rest = binding.restWorld[def.name];
    if (!target || !rest) continue;
    source.bones[def.name].getWorldQuaternion(_src);
    _q.copy(_src).multiply(rest);
    if (target.parent) {
      target.parent.getWorldQuaternion(_pq);
      _q.premultiply(_pq.invert());
    }
    target.quaternion.copy(_q);
    target.updateMatrixWorld(true);
  }
  const hips = binding.bones.hips;
  if (hips) {
    const p = source.bones.hips.position;
    hips.position.set(
      binding.hipsRestPos.x + p.x * binding.heightScale,
      binding.hipsRestPos.y + (p.y - 0.98) * binding.heightScale,
      binding.hipsRestPos.z + p.z * binding.heightScale,
    );
  }
}
