import { useL, useT } from '@/i18n';
import { useProgress } from '@/hooks/useProgress';
import { useProgressStore } from '@/store/progressStore';
import { STEPS } from '@/content/prayer';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Icon } from '@/components/ui/Icon';

/** Local-only progress: category bars plus learned / still-learning lists. */
export function ProgressPanel({ className }: { className?: string }) {
  const t = useT();
  const l = useL();
  const p = useProgress();
  const reset = useProgressStore((s) => s.reset);
  return (
    <div className={`glass rounded-2xl p-6 ${className ?? ''}`}>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="eyebrow">{t('progress.title')}</h3>
        <button type="button" onClick={reset} className="text-xs text-dim hover:text-ivory">
          {t('progress.reset')}
        </button>
      </div>
      <div className="space-y-4">
        <ProgressBar label={t('progress.basics')} value={p.basics} />
        <ProgressBar label={t('progress.movements')} value={p.movements} />
        <ProgressBar label={t('progress.recitations')} value={p.recitations} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-dim">{t('progress.learned')}</p>
          <ul className="space-y-1">
            {p.learnedList.map((id) => (
              <li key={id} className="flex items-center gap-2 text-ivory-2">
                <Icon name="check" size={14} className="text-emerald-glow" />
                {l(STEPS[id].title)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-dim">{t('progress.stillLearning')}</p>
          <ul className="space-y-1">
            {p.learningList.map((id) => (
              <li key={id} className="flex items-center gap-2 text-muted">
                <Icon name="circle" size={12} />
                {l(STEPS[id].title)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-5 text-xs text-dim">{t('progress.noLogin')}</p>
    </div>
  );
}
