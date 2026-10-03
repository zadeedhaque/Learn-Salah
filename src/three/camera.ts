import { MathUtils, Vector3 } from 'three';
import type { PoseFocus } from './rig/poses.ts';

export type CameraView = 'front' | 'threeQuarter' | 'side' | 'overhead' | 'low';

export const CAMERA_VIEWS: CameraView[] = ['front', 'threeQuarter', 'side'];

/**
 * Educational camera presets. Azimuth is measured from the front (+Z) towards the
 * figure's right side (−X), so the side view shows the figure facing screen-right.
 */
const PRESETS: Record<CameraView, { azimuth: number; elevation: number }> = {
  front: { azimuth: 0, elevation: 7 },
  threeQuarter: { azimuth: -38, elevation: 11 },
  side: { azimuth: -90, elevation: 4 },
  overhead: { azimuth: -32, elevation: 38 },
  low: { azimuth: -24, elevation: -3 },
};

export interface CameraShot {
  position: Vector3;
  target: Vector3;
}

/** Compute a camera position that frames `focus` from the given view. */
export function computeShot(view: CameraView, focus: PoseFocus, aspect: number, fovDeg: number, padding = 1.18): CameraShot {
  const { azimuth, elevation } = PRESETS[view];
  const fov = MathUtils.degToRad(fovDeg);
  const [w, h] = focus.size;
  const distH = h / 2 / Math.tan(fov / 2);
  const distW = w / 2 / (Math.tan(fov / 2) * Math.max(aspect, 0.3));
  const dist = Math.max(distH, distW) * padding + 0.25;
  const az = MathUtils.degToRad(azimuth);
  const el = MathUtils.degToRad(elevation);
  const target = new Vector3(...focus.target);
  const position = new Vector3(
    target.x - Math.sin(-az) * Math.cos(el) * dist,
    target.y + Math.sin(el) * dist,
    target.z + Math.cos(az) * Math.cos(el) * dist,
  );
  return { position, target };
}
