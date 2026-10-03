import { useEffect, useRef, useState } from 'react';
import { usePrayerStore } from '@/store/prayerStore';
import { useT } from '@/i18n';
import { CAMERA_VIEWS } from '@/three/camera';
import type { CameraView } from '@/three/camera';
import { setAutoCamera, setCameraView } from '@/three/engine';
import { Icon } from '@/components/ui/Icon';
import { Toggle } from '@/components/ui/Toggle';

const LABEL_KEY: Record<CameraView, string> = {
  front: 'stage.front',
  threeQuarter: 'stage.threeQuarter',
  side: 'stage.side',
  overhead: 'stage.threeQuarter',
  low: 'stage.threeQuarter',
};

/** Subtle view menu: Front / 3/4 / Side, auto camera, animation and highlights. */
export function ModelControls({ variant = 'stage' }: { variant?: 'stage' | 'hero' }) {
  const t = useT();
  const autoCamera = usePrayerStore((s) => s.autoCamera);
  const manualView = usePrayerStore((s) => s.manualView);
  const stepView = usePrayerStore((s) => s.scene.view);
  const heroView = usePrayerStore((s) => s.heroView);
  const setHeroView = usePrayerStore((s) => s.setHeroView);
  const animationsOn = usePrayerStore((s) => s.animationsOn);
  const highlightsOn = usePrayerStore((s) => s.highlightsOn);
  const setAnimationsOn = usePrayerStore((s) => s.setAnimationsOn);
  const setHighlightsOn = usePrayerStore((s) => s.setHighlightsOn);
  const [menu, setMenu] = useState(false);
  const [hint, setHint] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const hero = variant === 'hero';
  const active: CameraView = hero ? (heroView ?? 'threeQuarter') : autoCamera ? stepView : manualView;

  useEffect(() => {
    const id = window.setTimeout(() => setHint(false), 6000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [menu]);

  const order: CameraView[] = hero ? ['front', 'side', 'threeQuarter'] : CAMERA_VIEWS;

  return (
    <>
      <div
        role="toolbar"
        aria-label={t('stage.controls')}
        className={`absolute z-10 flex gap-2 ${hero ? 'end-6 top-24 flex-col' : 'end-3 top-3 flex-col sm:end-4 sm:top-4'}`}
      >
        <div className={`glass flex flex-col gap-1 rounded-2xl p-1.5 ${hero ? 'w-28' : ''}`}>
          {order.map((v) => {
            const on = active === v;
            return (
              <button
                key={v}
                type="button"
                aria-pressed={on}
                onClick={() => (hero ? setHeroView(v) : setCameraView(v))}
                className={`flex h-8 items-center justify-center gap-1.5 rounded-xl px-2.5 text-[0.72rem] transition-colors sm:h-9 sm:px-3 sm:text-[0.8rem] ${
                  on ? 'border border-emerald-glow/50 bg-emerald/50 text-ivory' : 'border border-transparent text-ivory-2 hover:bg-ivory/5'
                }`}
              >
                {on && v === 'front' && hero && <Icon name="camera" size={14} />}
                {t(LABEL_KEY[v])}
              </button>
            );
          })}
        </div>
        {!hero && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-pressed={autoCamera}
              onClick={() => setAutoCamera(!autoCamera)}
              className={`glass flex h-8 sm:h-9 w-full items-center justify-center gap-1.5 rounded-xl px-2.5 text-[0.72rem] ${autoCamera ? 'text-emerald-glow' : 'text-muted'}`}
              title={t('stage.autoCamera')}
            >
              <Icon name={autoCamera ? 'check' : 'camera'} size={14} />
              <span className="hidden sm:inline">{t('stage.autoCamera')}</span>
              <span className="sm:hidden">Auto</span>
            </button>
            <button
              type="button"
              aria-expanded={menu}
              aria-haspopup="true"
              onClick={() => setMenu((m) => !m)}
              className="glass mt-2 flex h-8 sm:h-9 w-full items-center justify-center gap-1.5 rounded-xl text-[0.72rem] text-ivory-2"
            >
              <Icon name="settings" size={14} />
              <span className="hidden sm:inline">{t('stage.model')}</span>
            </button>
            {menu && (
              <div className="glass absolute end-0 top-full mt-2 w-56 rounded-xl p-2" role="group" aria-label={t('stage.model')}>
                <Toggle label={t('stage.animation')} checked={animationsOn} onChange={setAnimationsOn} />
                <Toggle label={t('stage.highlights')} checked={highlightsOn} onChange={setHighlightsOn} />
              </div>
            )}
          </div>
        )}
      </div>
      {!hero && (
        <p
          className={`pointer-events-none absolute bottom-3 start-1/2 z-10 -translate-x-1/2 rounded-full bg-ink/60 px-3 py-1 text-[0.7rem] text-muted transition-opacity duration-700 rtl:translate-x-1/2 ${
            hint ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {t('stage.rotateHint')}
        </p>
      )}
    </>
  );
}
