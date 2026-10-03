import { create } from 'zustand';
import type { Rig } from '@/three/rig/skeleton';
import type { PoseAnimator } from '@/three/animation/PoseAnimator';

/** Height of the prayer rug; the figure stands on top of it. */
export const RUG_HEIGHT = 0.006;

/** Live references shared between 3D components (single scene per page). */
export const sceneRefs: { rig: Rig | null; animator: PoseAnimator | null } = {
  rig: null,
  animator: null,
};

if (import.meta.env.DEV && typeof window !== 'undefined') (window as unknown as { __scene: typeof sceneRefs }).__scene = sceneRefs;

interface SceneStatus {
  /** Loading progress 0–1 for the loading screen. */
  progress: number;
  ready: boolean;
  failed: boolean;
  setProgress(p: number): void;
  setReady(): void;
  setFailed(): void;
}

export const useSceneStatus = create<SceneStatus>()((set) => ({
  progress: 0.1,
  ready: false,
  failed: false,
  setProgress: (p) => set((s) => ({ progress: Math.max(s.progress, p) })),
  setReady: () => set({ progress: 1, ready: true }),
  setFailed: () => set({ failed: true, ready: true }),
}));
