import type { BoneName } from './rig/skeleton';
import { MIXAMO_MAP } from './animation/retarget';

/**
 * Which 3D figure to render.
 *
 *  - `procedural` (default): the code-generated faceless figure. No assets needed.
 *  - `gltf`: loads /public/models/prayer-person.glb and retargets every pose onto it.
 *
 * Switch with environment variables (e.g. in `.env.local`):
 *
 *   VITE_PRAYER_MODEL=gltf
 *   VITE_PRAYER_MODEL_BONES=mixamo      # or omit if bones already use internal names
 *
 * See public/models/README.md for the expected rig.
 */
export type ModelSource =
  | { kind: 'procedural' }
  | { kind: 'gltf'; url: string; boneMap: Partial<Record<BoneName, string>>; draco: boolean };

const env = import.meta.env;

export const MODEL_SOURCE: ModelSource =
  env.VITE_PRAYER_MODEL === 'gltf'
    ? {
        kind: 'gltf',
        url: `${env.BASE_URL}models/prayer-person.glb`,
        boneMap: env.VITE_PRAYER_MODEL_BONES === 'mixamo' ? MIXAMO_MAP : {},
        draco: env.VITE_PRAYER_MODEL_DRACO !== 'false',
      }
    : { kind: 'procedural' };
