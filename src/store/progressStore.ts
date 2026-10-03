import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PrayerId, RecitationId, StepId } from '@/content/types';
import { safeJSONStorage } from './safeStorage';

interface PracticeRecord {
  best: number;
  runs: number;
}

interface ProgressState {
  /** Steps the learner has spent time on (step id → first visit time, epoch ms). */
  visited: Partial<Record<StepId, number>>;
  /** Steps explicitly marked as learned. */
  learned: Partial<Record<StepId, true>>;
  /** Recitations opened or played. */
  recitations: Partial<Record<RecitationId, true>>;
  practice: Partial<Record<PrayerId, PracticeRecord>>;
  markVisited(id: StepId): void;
  setLearned(id: StepId, learned: boolean): void;
  markRecitation(id: RecitationId): void;
  recordPractice(id: PrayerId, scorePct: number): void;
  reset(): void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      visited: {},
      learned: {},
      recitations: {},
      practice: {},
      markVisited: (id) =>
        set((s) => (s.visited[id] ? s : { visited: { ...s.visited, [id]: Date.now() } })),
      setLearned: (id, learned) =>
        set((s) => {
          const next = { ...s.learned };
          if (learned) next[id] = true;
          else delete next[id];
          return { learned: next };
        }),
      markRecitation: (id) => set((s) => (s.recitations[id] ? s : { recitations: { ...s.recitations, [id]: true } })),
      recordPractice: (id, scorePct) =>
        set((s) => {
          const prev = s.practice[id] ?? { best: 0, runs: 0 };
          return { practice: { ...s.practice, [id]: { best: Math.max(prev.best, scorePct), runs: prev.runs + 1 } } };
        }),
      reset: () => set({ visited: {}, learned: {}, recitations: {}, practice: {} }),
    }),
    { name: 'learn-salah-progress', version: 1, storage: safeJSONStorage },
  ),
);
