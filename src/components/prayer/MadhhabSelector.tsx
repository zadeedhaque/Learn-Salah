import { useT } from '@/i18n';
import { useMadhhab } from '@/hooks/useMadhhab';
import { MADHHAB_IDS } from '@/content/types';
import type { MadhhabId } from '@/content/types';

/**
 * Madhhab selector. A radio group: one school is chosen as the learner's
 * reference; nothing implies the others are wrong.
 */
export function MadhhabSelector({ compact = false, showLabel = true }: { compact?: boolean; showLabel?: boolean }) {
  const t = useT();
  const { id, setMadhhab } = useMadhhab();

  const onKey = (e: React.KeyboardEvent, current: MadhhabId) => {
    const i = MADHHAB_IDS.indexOf(current);
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    if (!forward && !back) return;
    e.preventDefault();
    const rtl = document.documentElement.dir === 'rtl';
    const step = (forward ? 1 : -1) * (rtl && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') ? -1 : 1);
    const next = MADHHAB_IDS[(i + step + MADHHAB_IDS.length) % MADHHAB_IDS.length];
    setMadhhab(next);
    (e.currentTarget.parentElement?.querySelector(`[data-m="${next}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <div className={`flex items-center gap-2.5 ${compact ? '' : 'flex-wrap'}`}>
      {showLabel && <span className="text-xs text-muted" id="madhhab-label">{t('madhhab.label')}:</span>}
      <div className="seg" role="radiogroup" aria-labelledby={showLabel ? 'madhhab-label' : undefined} aria-label={showLabel ? undefined : t('madhhab.label')} title={t('madhhab.help')}>
        {MADHHAB_IDS.map((m) => (
          <button
            key={m}
            data-m={m}
            type="button"
            role="radio"
            aria-checked={id === m}
            tabIndex={id === m ? 0 : -1}
            onClick={() => setMadhhab(m)}
            onKeyDown={(e) => onKey(e, m)}
            className={compact ? '!px-2.5 !text-[0.74rem]' : ''}
          >
            {t(`madhhab.${m}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
