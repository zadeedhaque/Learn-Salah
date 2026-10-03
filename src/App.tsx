import { Suspense, lazy, useEffect, useRef } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { DIRECTION, HTML_LANG, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { useRoute } from '@/hooks/useRoute';
import type { Page } from '@/hooks/useRoute';
import { Stage } from '@/components/3d/Stage';
import { Navbar } from '@/components/layout/Navbar';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { Onboarding } from '@/components/layout/Onboarding';

const PAGES: Record<Page, React.LazyExoticComponent<() => React.JSX.Element>> = {
  home: lazy(() => import('./pages/Home')),
  learn: lazy(() => import('./pages/Learn')),
  practice: lazy(() => import('./pages/Practice')),
  recitations: lazy(() => import('./pages/Recitations')),
  quick: lazy(() => import('./pages/QuickReference')),
  about: lazy(() => import('./pages/About')),
  sources: lazy(() => import('./pages/Sources')),
};

/** Reflect language, direction and accessibility settings on <html>. */
function useDocumentSettings() {
  const lang = usePrayerStore((s) => s.lang);
  const a11y = usePrayerStore((s) => s.a11y);
  useEffect(() => {
    const html = document.documentElement;
    html.lang = HTML_LANG[lang];
    html.dir = DIRECTION[lang];
  }, [lang]);
  useEffect(() => {
    const c = document.documentElement.classList;
    c.toggle('reduce-motion', a11y.reducedMotion);
    c.toggle('high-contrast', a11y.highContrast);
    c.toggle('large-text', a11y.largeText);
  }, [a11y]);
}

export default function App() {
  const t = useT();
  const route = useRoute();
  const reduced = usePrayerStore((s) => s.a11y.reducedMotion);
  const mainRef = useRef<HTMLElement>(null);
  useDocumentSettings();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route.page]);

  const Page = PAGES[route.page];

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <button
        type="button"
        onClick={() => mainRef.current?.focus()}
        className="sr-only z-[70] rounded-lg bg-ivory px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-3"
      >
        {t('common.skipToContent')}
      </button>
      <Navbar />
      <Stage />
      <main id="main" ref={mainRef} tabIndex={-1} className="relative outline-none">
        <Suspense fallback={<div className="min-h-svh" />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={route.page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <Page />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      <Onboarding />
      <LoadingScreen />
    </MotionConfig>
  );
}
