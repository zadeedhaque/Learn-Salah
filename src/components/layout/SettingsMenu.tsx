import { useEffect, useRef, useState } from 'react';
import { useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { Icon } from '@/components/ui/Icon';
import { Toggle } from '@/components/ui/Toggle';

/** Display & accessibility settings: reduced motion, high contrast, larger text. */
export function SettingsMenu({ inline = false }: { inline?: boolean }) {
  const t = useT();
  const a11y = usePrayerStore((s) => s.a11y);
  const setA11y = usePrayerStore((s) => s.setA11y);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  const toggles = (
    <div className="space-y-1">
      <Toggle label={t('settings.reducedMotion')} checked={a11y.reducedMotion} onChange={(v) => setA11y({ reducedMotion: v })} />
      <Toggle label={t('settings.highContrast')} checked={a11y.highContrast} onChange={(v) => setA11y({ highContrast: v })} />
      <Toggle label={t('settings.largeText')} checked={a11y.largeText} onChange={(v) => setA11y({ largeText: v })} />
    </div>
  );

  if (inline) return toggles;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={t('common.settings')}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-xl text-ivory-2 hover:bg-ivory/5 hover:text-ivory"
      >
        <Icon name="eye" size={19} />
      </button>
      {open && (
        <div className="glass absolute end-0 top-full z-50 mt-2 w-64 rounded-2xl p-3" role="group" aria-label={t('common.settings')}>
          <p className="eyebrow mb-2 px-2">{t('common.settings')}</p>
          {toggles}
        </div>
      )}
    </div>
  );
}
