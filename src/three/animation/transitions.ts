import type { PoseId } from '../rig/poses.ts';

type PoseClass = 'standing' | 'bowing' | 'between' | 'prostrate' | 'sitting';

const CLASS: Record<PoseId, PoseClass> = {
  stand: 'standing',
  qiyam_navel: 'standing',
  qiyam_chest: 'standing',
  takbir_ears: 'standing',
  takbir_shoulders: 'standing',
  ruku: 'bowing',
  kneel: 'between',
  crouch: 'between',
  sujood: 'prostrate',
  jalsa: 'sitting',
  tashahhud: 'sitting',
  tawarruk: 'sitting',
  tawarruk_rest: 'sitting',
  salam_right: 'sitting',
  salam_left: 'sitting',
  salam_right_tw: 'sitting',
  salam_left_tw: 'sitting',
};

export interface PathPreferences {
  /** Maliki practice places the hands down before the knees; most others knees first. */
  handsFirst: boolean;
  /** Shafi'i practice includes a brief sitting (jalsat al-istirahah) before rising. */
  restBeforeRising: boolean;
}

/**
 * Waypoints between two poses so the figure physically moves through
 * intermediate positions (e.g. standing → kneeling → prostration) instead of
 * blending straight through the floor.
 */
export function transitionPath(from: PoseId, to: PoseId, prefs: PathPreferences): PoseId[] {
  const a = CLASS[from];
  const b = CLASS[to];
  const descend: PoseId = prefs.handsFirst ? 'crouch' : 'kneel';
  if (a === b) return [to];
  switch (`${a}>${b}`) {
    case 'standing>bowing':
    case 'bowing>standing':
    case 'prostrate>sitting':
    case 'sitting>prostrate':
      return [to];
    case 'standing>prostrate':
      return [descend, to];
    case 'bowing>prostrate':
      return ['stand', descend, to];
    case 'prostrate>standing':
      return prefs.restBeforeRising ? ['jalsa', 'kneel', to] : ['kneel', to];
    case 'prostrate>bowing':
      return ['kneel', 'stand', to];
    case 'standing>sitting':
    case 'sitting>standing':
      return ['kneel', to];
    case 'bowing>sitting':
      return ['stand', 'kneel', to];
    case 'sitting>bowing':
      return ['kneel', 'stand', to];
    default:
      return [to];
  }
}
