import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import type { ExperienceLevel } from '@/store/prayerStore';
import { navigate, useRoute } from '@/hooks/useRoute';
import { useSceneStatus } from '@/components/3d/sceneContext';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

const OPTIONS: { level: ExperienceLevel; icon: IconName }[] = [
  { level: 'new', icon: 'sparkle' },
  { level: 'basics', icon: 'book' },
  { level: 'improve', icon: 'chart' },
  { level: 'quick', icon: 'file' },
];

/** First-visit question that routes the learner to the right starting point. */
export function Onboarding() {
  const t = useT();
  const done = usePrayerStore((s) => s.onboardingDone);
  const complete = usePrayerStore((s) => s.completeOnboarding);
  const setLesson = usePrayerStore((s) => s.setLesson);
  const ready = useSceneStatus((s) => s.ready);
  const { page } = useRoute();
  const [show, setShow] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done || page !== 'home') return;
    const id = window.setTimeout(() => setShow(true), ready ? 900 : 3500);
    return () => window.clearTimeout(id);
  }, [done, page, ready]);

  useEffect(() => {
    if (!show) return;
    dialogRef.current?.querySelector('button')?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && finish(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const finish = (level: ExperienceLevel | null) => {
    complete(level);
    setShow(false);
    if (level === 'new') {
      setLesson('beginner', 0);
      navigate('learn');
    } else if (level === 'basics' || level === 'improve') {
      setLesson('basics', 0);
      navigate('learn');
    } else if (level === 'quick') {
      navigate('quick');
    }
  };

  return (
    <AnimatePresence>
      {show && !done && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="onb-title"
            className="glass w-full max-w-xl rounded-3xl p-6 sm:p-8"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
            exit={{ y: 12, opacity: 0 }}
          >
            <p className="eyebrow mb-2">{t('onboarding.welcome')}</p>
            <h2 id="onb-title" className="font-display text-3xl text-ivory sm:text-4xl">
              {t('onboarding.question')}
            </h2>
            <ul className="mt-6 grid gap-3">
              {OPTIONS.map((o) => (
                <li key={o.level}>
                  <button
                    type="button"
                    onClick={() => finish(o.level)}
                    className="group flex w-full items-start gap-4 rounded-2xl border hairline bg-ink/40 p-4 text-start transition-colors hover:border-emerald-glow/40 hover:bg-emerald-deep/40"
                  >
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border hairline text-gold">
                      <Icon name={o.icon} size={19} />
                    </span>
                    <span>
                      <span className="block font-medium text-ivory">{t(`onboarding.${o.level}`)}</span>
                      <span className="mt-0.5 block text-sm text-muted">{t(`onboarding.${o.level}Desc`)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => finish(null)} className="mt-5 text-sm text-muted underline-offset-4 hover:text-ivory hover:underline">
              {t('onboarding.skip')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
