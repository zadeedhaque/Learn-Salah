import { useCallback, useEffect, useMemo } from 'react';
import { usePrayerStore } from '@/store/prayerStore';
import { useProgressStore } from '@/store/progressStore';
import { buildLesson } from '@/content/prayer/lessons';
import { STEPS } from '@/content/prayer';
import { resolveLessonStep } from '@/content/resolve';
import type { LessonId } from '@/content/types';

/** The current lesson, its steps and navigation helpers. */
export function usePrayer() {
  const lessonId = usePrayerStore((s) => s.lessonId);
  const stepIndex = usePrayerStore((s) => s.stepIndex);
  const setStepIndex = usePrayerStore((s) => s.setStepIndex);
  const setLessonRaw = usePrayerStore((s) => s.setLesson);

  const steps = useMemo(() => buildLesson(lessonId), [lessonId]);
  const index = Math.min(Math.max(stepIndex, 0), steps.length - 1);
  const step = steps[index];
  const content = STEPS[step.stepId];

  const goTo = useCallback((i: number) => setStepIndex(Math.min(Math.max(i, 0), steps.length - 1)), [setStepIndex, steps.length]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const setLesson = useCallback((id: LessonId, i = 0) => setLessonRaw(id, i), [setLessonRaw]);

  return { lessonId, steps, index, step, content, goTo, next, prev, setLesson, isFirst: index === 0, isLast: index === steps.length - 1 };
}

/** Keep the 3D figure, camera and highlights synchronised with the current step. */
export function useLessonSceneSync(active: boolean) {
  const { step, content } = usePrayer();
  const madhhab = usePrayerStore((s) => s.madhhab);
  const setScene = usePrayerStore((s) => s.setScene);
  const markVisited = useProgressStore((s) => s.markVisited);

  useEffect(() => {
    if (!active) return;
    const r = resolveLessonStep(step, madhhab);
    setScene({ pose: r.pose, view: r.view, highlights: content.highlights.map((h) => h.part) });
    const t = window.setTimeout(() => markVisited(step.stepId), 1500);
    return () => window.clearTimeout(t);
  }, [active, step, content, madhhab, setScene, markVisited]);
}
