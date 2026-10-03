import { Component, Suspense, lazy, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { usePrayerStore } from '@/store/prayerStore';
import { useT } from '@/i18n';
import { ModelControls } from './ModelControls';
import { useSceneStatus } from './sceneContext';

const Scene = lazy(() => import('./Scene'));
const PoseIllustration = lazy(() => import('./PoseIllustration').then((m) => ({ default: m.PoseIllustration })));

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

class CanvasBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error('[Learn Salah] 3D scene failed', err);
    useSceneStatus.getState().setFailed();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Shown when WebGL is missing or the scene crashes. Instructions stay fully usable. */
function Fallback({ message }: { message: string }) {
  const t = useT();
  const pose = usePrayerStore((s) => s.scene.pose);
  const setIllustrated = usePrayerStore((s) => s.setIllustrated);
  const layout = usePrayerStore((s) => s.layout);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center pattern-bg">
      {layout !== 'hero' && (
        <Suspense fallback={null}>
          <PoseIllustration pose={pose} className="h-[52%] max-h-80 text-ivory-2" />
        </Suspense>
      )}
      <p className="max-w-sm text-ivory-2">{message}</p>
      {layout !== 'hero' && (
        <button type="button" className="btn btn-ghost h-10 px-4 text-sm" onClick={() => setIllustrated(true)}>
          {t('stage.viewIllustrated')}
        </button>
      )}
    </div>
  );
}

/**
 * Fixed container for the single, persistent WebGL canvas. Its placement animates
 * between layouts (full-bleed hero → side panel while learning), which is what
 * makes the hero → lesson transition feel continuous.
 */
export function Stage() {
  const layout = usePrayerStore((s) => s.layout);
  const t = useT();
  const webgl = useMemo(detectWebGL, []);

  useEffect(() => {
    if (!webgl) useSceneStatus.getState().setFailed();
  }, [webgl]);

  return (
    <div className={`stage stage--${layout}`} aria-hidden={layout === 'hidden' ? true : undefined}>
      {webgl ? (
        <CanvasBoundary fallback={<Fallback message={t('stage.unavailable')} />}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </CanvasBoundary>
      ) : (
        <Fallback message={t('stage.noWebgl')} />
      )}
      <div className="stage-vignette" />
      {webgl && (layout === 'learn' || layout === 'practice') && <ModelControls />}
    </div>
  );
}
