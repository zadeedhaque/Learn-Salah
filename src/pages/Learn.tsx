import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useL, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { useProgressStore } from '@/store/progressStore';
import { useLessonSceneSync, usePrayer } from '@/hooks/usePrayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { setCameraView } from '@/three/engine';
import { STEPS, PRAYERS, RECITATIONS } from '@/content/prayer';
import type { LessonId, PrayerId } from '@/content/types';
import { hrefFor } from '@/hooks/useRoute';
import { MovementCard } from '@/components/prayer/MovementCard';
import { PrayerTimeline } from '@/components/prayer/PrayerTimeline';
import { RakAhTimeline } from '@/components/prayer/RakAhTimeline';
import { PrayerSelector } from '@/components/prayer/PrayerSelector';
import { RecitationDrawer } from '@/components/prayer/RecitationDrawer';
import { ProgressPanel } from '@/components/prayer/ProgressPanel';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/ui/Icon';

function isPrayer(id: LessonId): id is PrayerId {
  return id in PRAYERS;
}

/**
 * Scroll-driven lesson. The 3D figure stays fixed beside the content (above it on
 * mobile); as each step section reaches the reading line an IntersectionObserver
 * updates the current step → pose, camera, highlights, recitation and timeline.
 */
export default function Learn() {
  const t = useT();
  const l = useL();
  const setLayout = usePrayerStore((s) => s.setLayout);
  const playing = usePrayerStore((s) => s.playing);
  const setPlaying = usePrayerStore((s) => s.setPlaying);
  const markRecitation = useProgressStore((s) => s.markRecitation);
  const { lessonId, steps, index, step, goTo, next, prev, setLesson } = usePrayer();
  const [chooser, setChooser] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const fromObserver = useRef(false);
  const programmatic = useRef(0);

  useEffect(() => setLayout('learn'), [setLayout]);
  useEffect(() => () => setPlaying(false), [setPlaying]);
  useLessonSceneSync(true);

  // Count recitations as learned once their step has been viewed for a moment.
  useEffect(() => {
    const id = window.setTimeout(() => STEPS[step.stepId].recitations.forEach(markRecitation), 2500);
    return () => window.clearTimeout(id);
  }, [step, markRecitation]);

  // Scroll the active section into view when the step changes via buttons / keys / timeline.
  useEffect(() => {
    if (fromObserver.current) {
      fromObserver.current = false;
      return;
    }
    const el = sections.current[index];
    if (!el) return;
    programmatic.current = Date.now();
    const reduced = document.documentElement.classList.contains('reduce-motion');
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [index, lessonId]);

  // Reading line: a thin band ~40% down the viewport (below the 3D panel on mobile).
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() - programmatic.current < 1100) return;
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const i = Number((hit.target as HTMLElement).dataset.index);
        if (Number.isFinite(i) && i !== usePrayerStore.getState().stepIndex) {
          fromObserver.current = true;
          goTo(i);
        }
      },
      { rootMargin: mobile ? '-62% 0px -30% 0px' : '-38% 0px -52% 0px', threshold: [0, 0.01] },
    );
    sections.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps, goTo]);

  // Guided playback: advance automatically; audio (when available) advances on end.
  const hasAudioRef = useRef(false);
  useEffect(() => {
    if (!playing) return;
    const recs = STEPS[step.stepId].recitations;
    const lines = recs.reduce((n, r) => n + RECITATIONS[r].lines.length, 0);
    const ms = 4500 + lines * 2200;
    const id = window.setTimeout(() => {
      if (hasAudioRef.current) return;
      if (index >= steps.length - 1) setPlaying(false);
      else next();
    }, ms);
    return () => window.clearTimeout(id);
  }, [playing, step, index, steps.length, next, setPlaying]);

  const onAudioEnded = useCallback(() => {
    if (usePrayerStore.getState().playing) next();
  }, [next]);

  const togglePlay = useCallback(() => setPlaying(!usePrayerStore.getState().playing), [setPlaying]);
  const handlers = useMemo(
    () => ({
      prev,
      next,
      toggle: togglePlay,
      front: () => setCameraView('front'),
      side: () => setCameraView('side'),
      threeQuarter: () => setCameraView('threeQuarter'),
    }),
    [prev, next, togglePlay],
  );
  useKeyboardShortcuts(handlers);

  const lessonTitle = lessonId === 'basics' ? t('learn.basics') : lessonId === 'beginner' ? t('learn.beginner') : l(PRAYERS[lessonId].name);
  const current = STEPS[step.stepId];

  return (
    <div className="learn-content relative z-10 min-h-svh bg-ink md:bg-transparent">
      <div className="bg-ink md:min-h-svh md:border-s md:hairline md:bg-ink/95">
        {/* Lesson header */}
        <div className="sticky top-[var(--sticky-top)] z-20 border-b hairline bg-ink/90 px-4 py-3 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-3">
            <button type="button" aria-expanded={chooser} onClick={() => setChooser((c) => !c)} className="flex items-center gap-2 rounded-xl px-1 text-start">
              <span className="eyebrow">{t('learn.lesson')}</span>
              <span className="font-display text-xl text-ivory">{lessonTitle}</span>
              <Icon name="chevronDown" size={16} className={`text-muted transition-transform ${chooser ? 'rotate-180' : ''}`} />
            </button>
            <div className="ms-auto flex items-center gap-2">
              <button type="button" onClick={() => setDrawer(true)} className="btn btn-ghost h-9 px-3 text-sm">
                <Icon name="headphones" size={16} />
                <span className="hidden sm:inline">{t('nav.recitations')}</span>
              </button>
            </div>
          </div>
          {chooser && (
            <div className="mx-auto mt-3 max-w-2xl">
              <PrayerSelector
                value={lessonId}
                onChange={(id) => {
                  setLesson(id, 0);
                  setChooser(false);
                  window.scrollTo({ top: 0 });
                }}
              />
            </div>
          )}
          <div className="mx-auto mt-3 hidden max-w-2xl md:block">
            <RakAhTimeline steps={steps} index={index} onSelect={goTo} />
          </div>
        </div>

        {/* Screen-reader announcement of the current step and pose */}
        <p className="sr-only" aria-live="polite">
          {t('stage.figureLabel', { pose: l(current.title) })}
        </p>

        {steps.map((s, i) => (
          <MovementCard
            key={s.key}
            ref={(el) => void (sections.current[i] = el)}
            step={s}
            index={i}
            total={steps.length}
            active={i === index}
            onAudioEnded={i === index ? onAudioEnded : undefined}
            footer={
              s.stepId === 'complete' ? (
                <div className="glass space-y-4 rounded-2xl p-6">
                  <p className="font-display text-3xl text-ivory">{t('learn.completeTitle')}</p>
                  <p className="text-muted">{t('learn.completeBody')}</p>
                  <div className="flex flex-wrap gap-3">
                    <a href={hrefFor(isPrayer(lessonId) ? `practice/${lessonId}` : 'practice')} className="btn btn-primary h-11 px-5">
                      {t('learn.practiceThis')}
                    </a>
                    <button type="button" onClick={() => goTo(0)} className="btn btn-ghost h-11 px-5">
                      {t('learn.restart')}
                    </button>
                    <a href={hrefFor('quick')} className="btn btn-quiet h-11 px-5">
                      {t('nav.quick')}
                    </a>
                  </div>
                </div>
              ) : undefined
            }
          />
        ))}

        <div className="px-4 pb-10 sm:px-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <ProgressPanel />
            <p className="flex items-center gap-2 text-xs text-dim">
              <Icon name="keyboard" size={15} />
              <span>
                {t('learn.shortcuts')}: {t('learn.shortcutsList')}
              </span>
            </p>
          </div>
        </div>
        <Footer compact />
      </div>

      <PrayerTimeline steps={steps} index={index} onSelect={goTo} onPrev={prev} onNext={next} playing={playing} onTogglePlay={togglePlay} />
      <RecitationDrawer open={drawer} onClose={() => setDrawer(false)} steps={steps} onJump={goTo} />
    </div>
  );
}
