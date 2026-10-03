import { useMemo } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { PROGRESS_GROUPS, RECITATION_ORDER } from '@/content/prayer';
import type { StepId } from '@/content/types';

/** Percentages per category; a step counts once visited or explicitly marked learned. */
export function useProgress() {
  const visited = useProgressStore((s) => s.visited);
  const learned = useProgressStore((s) => s.learned);
  const recitations = useProgressStore((s) => s.recitations);

  return useMemo(() => {
    const done = (id: StepId) => !!learned[id] || !!visited[id];
    const pct = (ids: StepId[]) => Math.round((ids.filter(done).length / ids.length) * 100);
    const recDone = RECITATION_ORDER.filter((r) => recitations[r]).length;
    const movementIds = PROGRESS_GROUPS.movements;
    return {
      basics: pct(PROGRESS_GROUPS.basics),
      movements: pct(movementIds),
      recitations: Math.round((recDone / RECITATION_ORDER.length) * 100),
      learnedList: movementIds.filter(done),
      learningList: movementIds.filter((id) => !done(id)),
    };
  }, [visited, learned, recitations]);
}
