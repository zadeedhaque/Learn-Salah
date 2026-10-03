import { useEffect, useState } from 'react';
import { useL, useNum, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { useProgressStore } from '@/store/progressStore';
import { useModelAnimation } from '@/hooks/useModelAnimation';
import { navigate } from '@/hooks/useRoute';
import { RECITATIONS, RECITATION_ORDER, STEPS } from '@/content/prayer';
import { buildLesson } from '@/content/prayer/lessons';
import type { RecitationId } from '@/content/types';
import { RecitationCard } from '@/components/prayer/RecitationCard';
import { SourceList } from '@/components/prayer/SourceList';
import { Footer } from '@/components/layout/Footer';
import { Icon, ForwardArrow } from '@/components/ui/Icon';

/**
 * Mini audio library of every recitation. Choosing one opens it and moves the 3D
 * figure into the position where it is said.
 */
export default function Recitations() {
  const t = useT();
  const l = useL();
  const num = useNum();
  const setLayout = usePrayerStore((s) => s.setLayout);
  const setLesson = usePrayerStore((s) => s.setLesson);
  const listened = useProgressStore((s) => s.recitations);
  const markRecitation = useProgressStore((s) => s.markRecitation);
  const { showAbstract } = useModelAnimation();
  const [selected, setSelected] = useState<RecitationId>('fatiha');
  const rec = RECITATIONS[selected];
  const step = STEPS[rec.stepId];

  useEffect(() => setLayout('learn'), [setLayout]);
  useEffect(() => {
    showAbstract(step.pose, { view: step.camera, highlights: step.highlights.map((h) => h.part), sitting: 'final' });
    markRecitation(selected);
  }, [selected, step, showAbstract, markRecitation]);

  const openInLesson = () => {
    const steps = buildLesson('basics');
    setLesson('basics', Math.max(steps.findIndex((s) => s.stepId === rec.stepId), 0));
    navigate('learn');
  };

  return (
    <div className="learn-content relative z-10 min-h-svh bg-ink md:bg-transparent" style={{ paddingBottom: 0 }}>
      <div className="bg-ink md:min-h-svh md:border-s md:hairline md:bg-ink/95">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
          <p className="eyebrow mb-3">{t('nav.recitations')}</p>
          <h1 className="font-display text-5xl text-ivory">{t('recitation.library')}</h1>
          <p className="mt-3 text-muted">{t('recitation.libraryBody')}</p>

          <ol className="mt-8 grid gap-1.5 sm:grid-cols-2" aria-label={t('recitation.library')}>
            {RECITATION_ORDER.map((id, i) => {
              const r = RECITATIONS[id];
              const on = id === selected;
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelected(id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start transition-colors ${on ? 'border-emerald-glow/50 bg-emerald-deep/50' : 'border-transparent hover:bg-ivory/5'}`}
                  >
                    <span className="w-6 text-xs tabular-nums text-dim">{num(i + 1).padStart(2, num(0))}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-ivory">{l(r.title)}</span>
                    {listened[id] && <Icon name="check" size={14} className="text-emerald-glow" aria-label={t('progress.learned')} />}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 space-y-6" aria-live="polite">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-dim">{l(step.title)}</p>
                <h2 className="font-display text-4xl text-ivory">{l(rec.title)}</h2>
              </div>
              <button type="button" onClick={openInLesson} className="btn btn-ghost h-10 px-4 text-sm">
                {t('recitation.showInLesson')}
                <ForwardArrow size={16} />
              </button>
            </div>
            <p className="text-ivory-2">{l(step.instruction)}</p>
            <RecitationCard id={selected} />
            <SourceList ids={rec.sources} />
          </div>
        </div>
        <Footer compact />
      </div>
    </div>
  );
}
