// Measures the posed robe surface height where the hands rest in sitting poses.
// node scripts/robe-check.ts
import { Vector3, SkinnedMesh } from 'three';
import { buildProceduralHuman } from '../src/three/model/proceduralHuman.ts';
import { applySpec } from '../src/three/rig/bake.ts';
import { POSES } from '../src/three/rig/poses.ts';
import type { PoseId } from '../src/three/rig/poses.ts';

const human = buildProceduralHuman();
const robe = human.group.children.find((c) => c.name === 'robe') as SkinnedMesh;
const v = new Vector3();
for (const id of ['jalsa', 'tashahhud', 'tawarruk', 'tawarruk_rest', 'salam_right', 'salam_left_tw'] as PoseId[]) {
  applySpec(human.rig, POSES[id]);
  human.group.updateMatrixWorld(true);
  robe.skeleton.update();
  const spec = POSES[id];
  for (const side of ['L', 'R'] as const) {
    const t = side === 'L' ? spec.arms?.L : (spec.arms?.R ?? spec.arms?.L);
    if (!t) continue;
    const wx = side === 'L' || spec.arms?.R ? t.wrist[0] : -t.wrist[0];
    let top = -1;
    const pos = robe.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      robe.getVertexPosition(i, v);
      // Region the hand covers: around the wrist x, from wrist z forward ~0.16 m.
      if (Math.abs(v.x - wx) < 0.05 && v.z > t.wrist[2] - 0.02 && v.z < t.wrist[2] + 0.17) top = Math.max(top, v.y);
    }
    console.log(id.padEnd(14), side, 'wrist y', t.wrist[1].toFixed(3), ' robe top', top.toFixed(3));
  }
}
