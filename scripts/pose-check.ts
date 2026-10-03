// Prints world positions of contact points for every pose: node scripts/pose-check.ts [poseId]
import { Vector3 } from 'three';
import { createRig } from '../src/three/rig/skeleton.ts';
import type { BoneName } from '../src/three/rig/skeleton.ts';
import { applySpec } from '../src/three/rig/bake.ts';
import { POSES } from '../src/three/rig/poses.ts';
import type { PoseId } from '../src/three/rig/poses.ts';

const rig = createRig();
const f = (v: Vector3) => `(${v.x.toFixed(3)}, ${v.y.toFixed(3)}, ${v.z.toFixed(3)})`;
const at = (bone: BoneName, local: [number, number, number] = [0, 0, 0]) =>
  rig.bones[bone].localToWorld(new Vector3(...local));

const only = process.argv[2] as PoseId | undefined;
for (const id of Object.keys(POSES) as PoseId[]) {
  if (only && id !== only) continue;
  applySpec(rig, POSES[id]);
  console.log(`\n== ${id}`);
  const rows: [string, Vector3][] = [
    ['head top', at('head', [0, 0.19, 0])],
    ['forehead', at('head', [0, 0.12, 0.09])],
    ['face low', at('head', [0, 0.04, 0.095])],
    ['chest', at('chest')],
    ['shoulderL', at('upperArmL')],
    ['elbowL', at('forearmL')],
    ['wristL', at('handL')],
    ['wristR', at('handR')],
    ['midtipL', at('middle3L', [0, -0.021, 0])],
    ['hipL', at('thighL')],
    ['kneeL', at('shinL')],
    ['kneeR', at('shinR')],
    ['ankleL', at('footL')],
    ['ankleR', at('footR')],
    ['heelL', at('footL', [0, -0.065, -0.05])],
    ['toetipL', at('toesL', [0, -0.012, 0.075])],
    ['toetipR', at('toesR', [0, -0.012, 0.075])],
  ];
  for (const [k, v] of rows) console.log(k.padEnd(10), f(v));
}
