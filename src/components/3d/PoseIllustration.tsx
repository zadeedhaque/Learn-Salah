import { useMemo } from 'react';
import { Vector3 } from 'three';
import { createRig } from '@/three/rig/skeleton';
import type { BoneName, Rig } from '@/three/rig/skeleton';
import { applySpec } from '@/three/rig/bake';
import { POSES } from '@/three/rig/poses';
import type { PoseId } from '@/three/rig/poses';

/**
 * 2D illustration generated from the same rig and pose data as the 3D figure.
 * Used as the no-WebGL fallback and for small previews, so illustrations can
 * never drift out of sync with the animation.
 */
type View = 'side' | 'front';

interface Drawing {
  viewBox: string;
  head: { x: number; y: number; r: number };
  strokes: { d: string; w: number; far: boolean }[];
  robe: string;
  floor: number;
}

let rig: Rig | null = null;
const cache = new Map<string, Drawing>();

function draw(pose: PoseId, view: View): Drawing {
  const key = `${pose}-${view}`;
  const hit = cache.get(key);
  if (hit) return hit;
  rig ??= createRig();
  applySpec(rig, POSES[pose]);
  const r = rig;
  const P = (bone: BoneName, local: [number, number, number] = [0, 0, 0]) => {
    const v = r.bones[bone].localToWorld(new Vector3(...local));
    return view === 'side' ? { x: v.z, y: -v.y } : { x: -v.x, y: -v.y };
  };
  const line = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' ');
  const strokes: Drawing['strokes'] = [];
  // In side view the camera is on the figure's right, so the left limbs are "far".
  for (const side of ['L', 'R'] as const) {
    const far = view === 'side' && side === 'L';
    strokes.push({
      d: line([P(`thigh${side}`), P(`shin${side}`), P(`foot${side}`), P(`toes${side}`, [0, 0, 0.07])]),
      w: 0.085,
      far,
    });
    strokes.push({
      d: line([P(`upperArm${side}`), P(`forearm${side}`), P(`hand${side}`), P(`middle3${side}`, [0, -0.02, 0])]),
      w: 0.06,
      far,
    });
  }
  const hips = P('hips', [0, -0.04, 0]);
  const neck = P('neck');
  strokes.push({ d: line([hips, P('spine'), P('chest'), neck]), w: 0.2, far: false });
  strokes.push({ d: line([neck, P('head')]), w: 0.075, far: false });
  const headC = P('head', [0, 0.1, 0.01]);
  const kneeL = P('shinL');
  const kneeR = P('shinR');
  const robe = line([P('upperArmL'), P('upperArmR'), kneeR, kneeL]) + ' Z';

  const pts = [headC, hips, kneeL, kneeR, P('toesL', [0, 0, 0.08]), P('toesR', [0, 0, 0.08]), P('middle3L'), P('middle3R'), P('footL'), P('footR')];
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const pad = 0.18;
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad;
  const maxY = 0.04;
  const d: Drawing = {
    viewBox: `${minX.toFixed(3)} ${minY.toFixed(3)} ${(maxX - minX).toFixed(3)} ${(maxY - minY).toFixed(3)}`,
    head: { x: headC.x, y: headC.y, r: 0.095 },
    strokes,
    robe,
    floor: 0,
  };
  cache.set(key, d);
  return d;
}

export function PoseIllustration({
  pose,
  view = 'side',
  className,
  title,
}: {
  pose: PoseId;
  view?: View;
  className?: string;
  title?: string;
}) {
  const d = useMemo(() => draw(pose, view), [pose, view]);
  const [x, , w] = d.viewBox.split(' ').map(Number);
  return (
    <svg viewBox={d.viewBox} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <line x1={x} x2={x + w} y1={0.012} y2={0.012} stroke="currentColor" strokeOpacity={0.25} strokeWidth={0.008} />
      <path d={d.robe} fill="currentColor" fillOpacity={0.08} />
      {d.strokes
        .slice()
        .sort((a, b) => Number(b.far) - Number(a.far))
        .map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke="currentColor" strokeOpacity={s.far ? 0.4 : 0.92} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      <circle cx={d.head.x} cy={d.head.y} r={d.head.r} fill="currentColor" fillOpacity={0.92} />
    </svg>
  );
}
