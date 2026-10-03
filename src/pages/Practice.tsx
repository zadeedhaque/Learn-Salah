import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useL, useLang, useNum, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { useProgressStore } from '@/store/progressStore';
import { navigate, useRoute } from '@/hooks/useRoute';
import { PRAYERS } from '@/content/prayer';
import { buildLesson } from '@/content/prayer/lessons';
import { resolveLessonStep } from '@/content/resolve';
import { PRAYER_IDS } from '@/content/types';
import type { LessonStep, PrayerId, StepId } from '@/content/types';
import { STAGE_LABEL } from '@/components/prayer/RakAhTimeline';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Icon, ForwardArrow } from '@/components/ui/Icon';

type Stage = keyof typeof STAGE_LABEL;
const STAGES = Object.keys(STAGE_LABEL) as Stage[];

const STAGE_OF: Partial<Record<StepId, Stage>> = {
  takbir: 'takbir',
  qiyam: 'qiyam',
  fatiha: 'qiyam',
  surah: 'qiyam',
  rise: 'qiyam',
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

interface PracticeStage {
  stage: Stage;
  step: LessonStep;
}

function sequenceFor(prayer: PrayerId): PracticeStage[] {
  const out: PracticeStage[] = [];
  for (const step of buildLesson(prayer)) {
    const stage = STAGE_OF[step.stepId];
    if (!stage) continue;
    const last = out[out.length - 1];
    if (last && last.stage === stage) continue;
    out.push({ stage, step });
  }
  return out;
}

function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function optionsFor(correct: Stage): Stage[] {
  const pool = shuffle(STAGES.filter((s) => s !== correct)).slice(0, 3);
  return shuffle([correct, ...pool]);
}

/** Practice mode: the learner predicts each next position; feedback is gentle. */
export default function Practice() {
  const t = useT();
  const l = useL();
  const num = useNum();
  const { params } = useRoute();
  const setLayout = usePrayerStore((s) => s.setLayout);
  const setScene = usePrayerStore((s) => s.setScene);
  const madhhab = usePrayerStore((s) => s.madhhab);
  const records = useProgressStore((s) => s.practice);
  const prayer = (PRAYER_IDS as string[]).includes(params[0] ?? '') ? (params[0] as PrayerId) : null;

  useEffect(() => setLayout('practice'), [setLayout]);

  useEffect(() => {
    if (!prayer) setScene({ pose: madhhab === 'maliki' ? 'stand' : 'qiyam_navel', view: 'threeQuarter', highlights: [] });
  }, [prayer, madhhab, setScene]);

  return (
    <div className="practice-content relative z-10 bg-ink md:border-s md:hairline">
      {prayer ? (
        <PracticeRun key={prayer} prayer={prayer} />
      ) : (
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-8 md:py-20">
          <p className="eyebrow mb-3">{t('nav.practice')}</p>
          <h1 className="font-display text-5xl text-ivory">{t('practice.title')}</h1>
          <p className="mt-4 text-lg text-muted">{t('practice.subtitle')}</p>
          <h2 className="mb-4 mt-10 text-sm font-medium text-ivory-2">{t('practice.choose')}</h2>
          <ul className="space-y-3">
            {PRAYER_IDS.map((p) => {
              const rec = records[p];
              return (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => navigate(`practice/${p}`)}
                    className="glass flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-start hover:border-emerald-glow/30"
                  >
                    <span>
                      <span className="block font-display text-2xl text-ivory">{t('practice.start', { prayer: l(PRAYERS[p].name) })}</span>
                      <span className="text-sm text-muted">
                        {num(PRAYERS[p].fardRakahs)} {t('quick.rakahs')}
                        {rec && ` · ${t('practice.best', { pct: rec.best })} · ${t('practice.runs', { n: rec.runs })}`}
                      </span>
                    </span>
                    <span lang="ar" className="arabic text-2xl text-gold">
                      {PRAYERS[p].arabicName}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function PracticeRun({ prayer }: { prayer: PrayerId }) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const num = useNum();
  const madhhab = usePrayerStore((s) => s.madhhab);
  const setScene = usePrayerStore((s) => s.setScene);
  const recordPractice = useProgressStore((s) => s.recordPractice);
  const seq = useMemo(() => sequenceFor(prayer), [prayer]);
  const [pos, setPos] = useState(0);
  const [options, setOptions] = useState<Stage[]>(() => optionsFor(seq[1].stage));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [wrongPicks, setWrongPicks] = useState<Stage[]>([]);
  const [firstTry, setFirstTry] = useState(0);
  const [done, setDone] = useState(false);
  const questions = seq.length - 1;

  const show = useCallback(
    (i: number) => {
      const r = resolveLessonStep(seq[i].step, madhhab);
      const view = seq[i].stage === 'ruku' || seq[i].stage === 'sujood' ? 'side' : seq[i].stage === 'salam' ? 'front' : 'threeQuarter';
      setScene({ pose: r.pose, view, highlights: [] });
    },
    [seq, madhhab, setScene],
  );

  useEffect(() => show(pos), [pos, show]);

  const choose = (s: Stage) => {
    if (feedback === 'correct') return;
    const correct = seq[pos + 1].stage;
    if (s === correct) {
      if (!wrongPicks.length) setFirstTry((n) => n + 1);
      setFeedback('correct');
      window.setTimeout(() => {
        const nextPos = pos + 1;
        setFeedback(null);
        setWrongPicks([]);
        if (nextPos >= seq.length - 1) {
          setPos(nextPos);
          setDone(true);
          const score = Math.round(((firstTry + (wrongPicks.length ? 0 : 1)) / questions) * 100);
          recordPractice(prayer, score);
        } else {
          setPos(nextPos);
          setOptions(optionsFor(seq[nextPos + 1].stage));
        }
      }, 900);
    } else {
      setFeedback('wrong');
      setWrongPicks((w) => (w.includes(s) ? w : [...w, s]));
    }
  };

  const restart = () => {
    setPos(0);
    setFirstTry(0);
    setDone(false);
    setFeedback(null);
    setWrongPicks([]);
    setOptions(optionsFor(seq[1].stage));
  };

  const pct = Math.round((firstTry / questions) * 100);

  return (
    <div className="mx-auto flex min-h-[calc(100svh-var(--nav-h))] max-w-xl flex-col px-4 py-8 sm:px-8 md:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">{t('practice.title')}</p>
          <p className="font-display text-3xl text-ivory">{l(PRAYERS[prayer].name)}</p>
        </div>
        <button type="button" onClick={() => navigate('practice')} className="btn btn-quiet h-9 px-3 text-sm">
          <Icon name="close" size={16} />
          {t('practice.exit')}
        </button>
      </div>
      <ProgressBar label={t('practice.stage', { n: Math.min(pos + 1, seq.length), total: seq.length })} value={(pos / (seq.length - 1)) * 100} />

      {!done ? (
        <div className="mt-10 flex-1">
          <p className="text-xs uppercase tracking-wider text-dim">{t('practice.current')}</p>
          <p className="mt-1 font-display text-5xl text-ivory">{STAGE_LABEL[seq[pos].stage][lang]}</p>
          {seq[pos].step.rakah && (
            <p className="mt-1 text-sm text-muted">{t('learn.rakah', { n: seq[pos].step.rakah!, total: seq[pos].step.totalRakahs! })}</p>
          )}
          <h2 className="mt-10 text-xl text-ivory-2">{t('practice.whatNext')}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {options.map((o) => {
              const wrong = wrongPicks.includes(o);
              const right = feedback === 'correct' && o === seq[pos + 1].stage;
              return (
                <li key={o}>
                  <button
                    type="button"
                    onClick={() => choose(o)}
                    disabled={wrong}
                    className={`h-16 w-full rounded-2xl border text-lg transition-all duration-300 ${
                      right
                        ? 'border-emerald-glow/70 bg-emerald/50 text-ivory'
                        : wrong
                          ? 'border-line bg-transparent text-dim line-through decoration-1'
                          : 'hairline bg-ink-3/60 text-ivory hover:border-emerald-glow/40'
                    }`}
                  >
                    {STAGE_LABEL[o][lang]}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 min-h-7 text-lg" role="status" aria-live="polite">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.span key={feedback} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={feedback === 'correct' ? 'text-emerald-glow' : 'text-gold'}>
                  {t(feedback === 'correct' ? 'practice.correct' : 'practice.tryAgain')}
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        </div>
      ) : (
        <div className="mt-10 flex-1 space-y-5">
          <p className="font-display text-5xl text-ivory">{t('practice.finished')}</p>
          <p className="text-lg text-muted">{t('practice.score', { pct })}</p>
          <p className="text-sm text-dim">{num(firstTry)} / {num(questions)}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={restart} className="btn btn-primary h-12 px-6">
              {t('practice.again')}
            </button>
            <button type="button" onClick={() => navigate('practice')} className="btn btn-ghost h-12 px-6">
              {t('practice.another')}
              <ForwardArrow />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
