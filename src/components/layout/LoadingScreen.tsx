import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { useSceneStatus } from '@/components/3d/sceneContext';

/** Short, calm loading screen while the 3D guide prepares (capped so it never lingers). */
export function LoadingScreen() {
  const t = useT();
  const ready = useSceneStatus((s) => s.ready);
  const progress = useSceneStatus((s) => s.progress);
  const layout = usePrayerStore((s) => s.layout);
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const a = window.setTimeout(() => setMinElapsed(true), 700);
    const b = window.setTimeout(() => setTimedOut(true), 9000);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  const done = (ready && minElapsed) || timedOut || layout === 'hidden';
  useEffect(() => {
    if (done) setDismissed(true);
  }, [done]);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-ink pattern-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          role="status"
          aria-live="polite"
        >
          <p className="arabic text-5xl text-ivory md:text-6xl" lang="ar">
            بِسْمِ اللَّهِ
          </p>
          <p className="text-sm text-muted">{t('loading.preparing')}</p>
          <div className="h-1 w-56 overflow-hidden rounded-full bg-ivory/10" aria-hidden="true">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald to-gold transition-[width] duration-500" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
