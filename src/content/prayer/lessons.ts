import type { LessonId, LessonStep, PrayerId, StepId } from '../types';
import { PRAYERS } from './index';

const FOUNDATIONS: StepId[] = ['what-is-salah', 'why-pray', 'prayer-times', 'wudu', 'qiblah', 'preparation'];

/**
 * Build the ordered sequence of steps for a lesson.
 *  - basics:   a fully explained two-rak'ah walkthrough
 *  - beginner: foundations (what Salah is, wudu, qiblah…) followed by the basics
 *  - a prayer: every rak'ah of that prayer, with first and final sittings
 */
export function buildLesson(id: LessonId): LessonStep[] {
  if (id === 'basics') return [{ key: 'intro', stepId: 'intro' }, ...prayerSteps(2, [true, true], 'basics')];
  if (id === 'beginner') {
    return [
      { key: 'intro', stepId: 'intro' },
      ...FOUNDATIONS.map((s) => ({ key: s, stepId: s })),
      ...prayerSteps(2, [true, true], 'basics'),
    ];
  }
  const p = PRAYERS[id as PrayerId];
  return prayerSteps(p.fardRakahs, p.aloud, id);
}

function prayerSteps(rakahs: number, aloud: boolean[], prefix: string): LessonStep[] {
  const out: LessonStep[] = [];
  const add = (stepId: StepId, rakah: number, extra: Partial<LessonStep> = {}) =>
    out.push({ key: `${prefix}-${rakah}-${stepId}-${out.length}`, stepId, rakah, totalRakahs: rakahs, aloud: aloud[rakah - 1], ...extra });

  for (let r = 1; r <= rakahs; r++) {
    if (r === 1) {
      add('niyyah', r);
      add('takbir', r);
      add('qiyam', r);
    }
    add('fatiha', r);
    if (r <= 2) add('surah', r);
    add('ruku', r);
    add('itidal', r);
    add('sujood', r);
    add('jalsa', r);
    add('sujood-second', r);
    if (r === rakahs) {
      const sitting = rakahs === 2 ? 'only' : 'final';
      add('tashahhud', r, { sitting });
      add('salawat', r, { sitting });
      add('dua', r, { sitting });
      add('salam-right', r, { sitting });
      add('salam-left', r, { sitting });
    } else {
      if (r === 2) add('tashahhud', r, { sitting: 'first' });
      add('rise', r);
    }
  }
  out.push({ key: `${prefix}-complete`, stepId: 'complete', rakah: rakahs, totalRakahs: rakahs, sitting: rakahs === 2 ? 'only' : 'final' });
  return out;
}
