import { forwardRef } from 'react';
import { isFallback, useL, useLang, useNum, useT } from '@/i18n';
import { STEPS } from '@/content/prayer';
import { rulingFor, resolveLessonStep } from '@/content/resolve';
import type { LessonStep } from '@/content/types';
import { useMadhhab } from '@/hooks/useMadhhab';
import { usePrayerStore } from '@/store/prayerStore';
import { useProgressStore } from '@/store/progressStore';
import { PoseIllustration } from '@/components/3d/PoseIllustration';
import { Icon } from '@/components/ui/Icon';
import { RulingBadge } from './RulingBadge';
import { RecitationCard } from './RecitationCard';
import { MadhhabNotes } from './MadhhabNotes';
import { SourceList } from './SourceList';

/**
 * One lesson step, answering WHAT (instruction), HOW (positioning) and
 * WHAT DO I SAY (recitations), plus rulings, madhhab notes and sources.
 */
export const MovementCard = forwardRef<HTMLElement, { step: LessonStep; index: number; total: number; active: boolean; onAudioEnded?: () => void; footer?: React.ReactNode }>(
  function MovementCard({ step, index, total, active, onAudioEnded, footer }, ref) {
    const t = useT();
    const l = useL();
    const lang = useLang();
    const num = useNum();
    const { id: madhhab } = useMadhhab();
    const level = usePrayerStore((s) => s.level);
    const illustrated = usePrayerStore((s) => s.illustrated);
    const learned = useProgressStore((s) => !!s.learned[step.stepId]);
    const setLearned = useProgressStore((s) => s.setLearned);
    const c = STEPS[step.stepId];
    const resolved = resolveLessonStep(step, madhhab);

    const context: string[] = [];
    if (step.rakah && step.totalRakahs) context.push(t('learn.rakah', { n: step.rakah, total: step.totalRakahs }));
    if (step.stepId === 'tashahhud' && step.sitting) context.push(t(step.sitting === 'first' ? 'learn.firstSitting' : 'learn.finalSitting'));
    if (step.aloud !== undefined && (step.stepId === 'fatiha' || step.stepId === 'surah')) context.push(t(step.aloud ? 'learn.aloud' : 'learn.silent'));
    const later = step.stepId === 'fatiha' && step.rakah && step.rakah > 2;

    return (
      <section
        ref={ref}
        data-index={index}
        aria-labelledby={`step-${index}-title`}
        aria-current={active ? 'step' : undefined}
        className={`scroll-mt-28 px-4 py-12 transition-opacity duration-700 sm:px-8 md:min-h-[78svh] md:py-16 ${active ? 'opacity-100' : 'opacity-40'}`}
      >
        <div className="mx-auto max-w-2xl space-y-8">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="eyebrow">
                {t('learn.step')} {num(index + 1).padStart(2, num(0))} <span className="text-dim">/ {num(total)}</span>
              </span>
              {context.map((x) => (
                <span key={x} className="chip !py-0.5 !text-[0.72rem]">
                  {x}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <h2 id={`step-${index}-title`} className="font-display text-4xl leading-tight text-ivory sm:text-5xl">
                {l(c.title)}
              </h2>
              {c.arabicTitle && (
                <p lang="ar" className="arabic text-3xl leading-none text-gold sm:text-4xl">
                  {c.arabicTitle}
                </p>
              )}
            </div>
            <p className="text-lg text-ivory-2">{l(c.subtitle)}</p>
            {c.rulings.length > 0 && (
              <ul className="flex flex-col gap-2 pt-1" aria-label={t('learn.ruling')}>
                {c.rulings.map((r, i) => {
                  const lvl = rulingFor(r.levels, madhhab);
                  return lvl ? (
                    <li key={i}>
                      <RulingBadge level={lvl} subject={l(r.subject)} />
                      {r.note && (active || level === 'improve') && <p className="mt-1 ps-1 text-xs leading-relaxed text-dim">{l(r.note)}</p>}
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </header>

          {illustrated && (
            <div className="glass flex justify-center rounded-2xl p-4">
              <PoseIllustration pose={resolved.pose} view={c.camera === 'front' ? 'front' : 'side'} className="h-56 text-ivory-2" title={l(c.title)} />
            </div>
          )}

          <div>
            <p className="eyebrow mb-2">{t('learn.whatToDo')}</p>
            <p className="text-xl leading-relaxed text-ivory">{l(c.instruction)}</p>
            {isFallback(c.instruction, lang) && <p className="mt-1 text-[0.7rem] text-dim">{t('common.translationPending')}</p>}
          </div>

          {c.how.length > 0 && (
            <div>
              <p className="eyebrow mb-3">{t('learn.how')}</p>
              <ul className="space-y-2.5">
                {c.how.map((h, i) => (
                  <li key={i} className="flex gap-3 text-[1.02rem] leading-relaxed text-ivory-2">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" aria-hidden="true" />
                    <span>{l(h)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {c.highlights.length > 0 && (
            <div>
              <p className="eyebrow mb-3">{t('learn.focus')}</p>
              <ul className="flex flex-wrap gap-2">
                {c.highlights.map((h) => (
                  <li key={h.part} className="chip">
                    <span className="h-2 w-2 rounded-full bg-emerald-glow shadow-[0_0_10px_rgba(127,209,174,0.8)]" aria-hidden="true" />
                    <span className="text-ivory">{t(`body.${h.part}`)}</span>
                    <span className="text-muted">· {l(h.label)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="eyebrow mb-3">{t('learn.whatToSay')}</p>
            {later && <p className="mb-3 text-sm text-muted">{l(STEPS.surah.how[1])}</p>}
            {c.recitations.length ? (
              <div className="space-y-4">
                {c.recitations.map((r, i) => (
                  <RecitationCard key={r} id={r} onEnded={i === c.recitations.length - 1 ? onAudioEnded : undefined} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">{t('learn.nothingRecited')}</p>
            )}
          </div>

          <MadhhabNotes topics={c.differences} defaultOpen={level === 'improve'} />

          <div className="grid gap-6 border-t hairline pt-6 sm:grid-cols-[1fr_auto]">
            <SourceList ids={c.sources} />
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <button
                type="button"
                aria-pressed={learned}
                onClick={() => setLearned(step.stepId, !learned)}
                className={`btn h-9 px-3 text-sm ${learned ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Icon name={learned ? 'check' : 'circle'} size={15} />
                {t(learned ? 'learn.learned' : 'learn.markLearned')}
              </button>
              {c.review === 'draft' && <span className="text-[0.7rem] text-dim">{t('common.draft')}</span>}
            </div>
          </div>
          {footer}
        </div>
      </section>
    );
  },
);
