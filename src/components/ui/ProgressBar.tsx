import { useNum } from '@/i18n';

/** Accessible progress bar with a calm animated fill. */
export function ProgressBar({ label, value, compact = false }: { label: string; value: number; compact?: boolean }) {
  const num = useNum();
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-ivory-2">{label}</span>
        <span className="tabular-nums text-muted">{num(v)}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-ivory/10"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald-glow transition-[width] duration-700 ease-out"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
