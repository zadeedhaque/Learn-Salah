import { useEffect, useRef } from 'react';
import { useL, useNum, useT } from '@/i18n';
import { STEPS } from '@/content/prayer';
import type { LessonStep } from '@/content/types';
import { BackArrow, ForwardArrow, Icon } from '@/components/ui/Icon';

/**
 * Persistent bottom bar:  ← Previous   01 ── 02 ── 03 …   Next →
 * The current step is always scrolled into view.
 */
export function PrayerTimeline({
  steps,
  index,
  onSelect,
  onPrev,
  onNext,
  playing,
  onTogglePlay,
}: {
  steps: LessonStep[];
  index: number;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  playing: boolean;
  onTogglePlay: () => void;
}) {
  const t = useT();
  const l = useL();
  const num = useNum();
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-i="${index}"]`);
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [index]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t hairline bg-ink/85 backdrop-blur-xl" style={{ height: 'var(--bar-h)' }}>
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button type="button" onClick={onPrev} disabled={index === 0} className="btn btn-ghost h-10 px-3 text-sm disabled:opacity-40 sm:px-4" aria-label={t('learn.previous')}>
          <BackArrow />
          <span className="hidden md:inline">{t('learn.previous')}</span>
        </button>
        <nav aria-label={t('learn.timeline')} className="min-w-0 flex-1">
          <ol ref={listRef} className="no-scrollbar flex items-center overflow-x-auto px-2 py-2">
            {steps.map((s, i) => {
              const active = i === index;
              const past = i < index;
              const title = l(STEPS[s.stepId].title);
              return (
                <li key={s.key} className="flex items-center">
                  {i > 0 && <span className={`h-px w-3 sm:w-5 ${past || active ? 'bg-emerald-glow/50' : 'bg-line'}`} aria-hidden="true" />}
                  <button
                    type="button"
                    data-i={i}
                    onClick={() => onSelect(i)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`${t('learn.step')} ${num(i + 1)}: ${title}`}
                    title={title}
                    className={`grid h-8 min-w-8 place-items-center rounded-full border px-1.5 text-[0.72rem] tabular-nums transition-all duration-300 ${
                      active
                        ? 'scale-110 border-emerald-glow/70 bg-emerald/60 text-ivory'
                        : past
                          ? 'border-emerald-glow/25 text-ivory-2'
                          : 'hairline text-dim hover:text-ivory'
                    }`}
                  >
                    {num(i + 1).padStart(2, num(0))}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <button
          type="button"
          onClick={onTogglePlay}
          aria-pressed={playing}
          aria-label={playing ? t('learn.pause') : t('learn.play')}
          title={playing ? t('learn.pause') : t('learn.play')}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border hairline text-ivory-2 hover:text-ivory"
        >
          <Icon name={playing ? 'pause' : 'play'} size={16} />
        </button>
        <button type="button" onClick={onNext} disabled={index === steps.length - 1} className="btn btn-primary h-10 px-3 text-sm disabled:opacity-40 sm:px-4" aria-label={t('learn.next')}>
          <span className="hidden md:inline">{t('learn.next')}</span>
          <ForwardArrow />
        </button>
      </div>
    </div>
  );
}
