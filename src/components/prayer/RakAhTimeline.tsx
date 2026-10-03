import { useMemo } from 'react';
import { useLang, useNum, useT } from '@/i18n';
import type { Lang, LessonStep, StepId } from '@/content/types';

type Stage = 'takbir' | 'qiyam' | 'ruku' | 'itidal' | 'sujood' | 'jalsa' | 'tashahhud' | 'salam';

const STAGE_OF: Partial<Record<StepId, Stage>> = {
  takbir: 'takbir',
  qiyam: 'qiyam',
  fatiha: 'qiyam',
  surah: 'qiyam',
  ruku: 'ruku',
  itidal: 'itidal',
  sujood: 'sujood',
  jalsa: 'jalsa',
  'sujood-second': 'sujood',
  tashahhud: 'tashahhud',
  salawat: 'tashahhud',
  dua: 'tashahhud',
  'salam-right': 'salam',
  'salam-left': 'salam',
};

export const STAGE_LABEL: Record<Stage, Record<Lang, string>> = {
  takbir: { en: 'Takbir', bn: 'তাকবির', ar: 'التكبير' },
  qiyam: { en: 'Qiyam', bn: 'কিয়াম', ar: 'القيام' },
  ruku: { en: 'Ruku’', bn: 'রুকু', ar: 'الركوع' },
  itidal: { en: 'I’tidal', bn: 'কওমা', ar: 'الاعتدال' },
  sujood: { en: 'Sujood', bn: 'সিজদা', ar: 'السجود' },
  jalsa: { en: 'Jalsa', bn: 'জলসা', ar: 'الجلسة' },
  tashahhud: { en: 'Tashahhud', bn: 'তাশাহহুদ', ar: 'التشهد' },
  salam: { en: 'Salam', bn: 'সালাম', ar: 'التسليم' },
};

interface Group {
  rakah: number;
  stages: { stage: Stage; first: number; last: number }[];
}

/** Rak'ah-by-rak'ah structure; the active stage is highlighted and every stage is clickable. */
export function RakAhTimeline({ steps, index, onSelect }: { steps: LessonStep[]; index: number; onSelect: (i: number) => void }) {
  const t = useT();
  const lang = useLang();
  const num = useNum();

  const groups = useMemo(() => {
    const out: Group[] = [];
    steps.forEach((s, i) => {
      const stage = STAGE_OF[s.stepId];
      if (!stage || !s.rakah) return;
      let g = out.find((x) => x.rakah === s.rakah);
      if (!g) {
        g = { rakah: s.rakah, stages: [] };
        out.push(g);
      }
      const last = g.stages[g.stages.length - 1];
      if (last && last.stage === stage && last.last === i - 1) last.last = i;
      else g.stages.push({ stage, first: i, last: i });
    });
    return out;
  }, [steps]);

  if (!groups.length) return null;

  return (
    <nav aria-label={t('learn.rakahTimeline')} className="space-y-2">
      {groups.map((g) => (
        <div key={g.rakah} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-[0.7rem] uppercase tracking-wider text-dim">{t('quick.rakah', { n: g.rakah })}</span>
          <ol className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {g.stages.map((s, si) => {
              const active = index >= s.first && index <= s.last;
              const past = index > s.last;
              return (
                <li key={si} className="flex items-center gap-1">
                  {si > 0 && <span className={`h-px w-2.5 ${past || active ? 'bg-emerald-glow/50' : 'bg-line'}`} aria-hidden="true" />}
                  <button
                    type="button"
                    onClick={() => onSelect(s.first)}
                    aria-current={active ? 'step' : undefined}
                    className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.72rem] transition-all duration-500 ${
                      active
                        ? 'border-emerald-glow/60 bg-emerald/45 text-ivory shadow-[0_0_18px_-4px_rgba(127,209,174,0.6)]'
                        : past
                          ? 'border-emerald-glow/20 text-ivory-2'
                          : 'hairline text-muted hover:text-ivory'
                    }`}
                  >
                    {STAGE_LABEL[s.stage][lang]}
                  </button>
                </li>
              );
            })}
          </ol>
          <span className="sr-only">{num(g.rakah)}</span>
        </div>
      ))}
    </nav>
  );
}
