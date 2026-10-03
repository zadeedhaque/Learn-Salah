import { useT } from '@/i18n';
import type { RulingLevel } from '@/content/types';
import { Tooltip } from '@/components/ui/Tooltip';

const STYLE: Record<RulingLevel, string> = {
  fard: 'border-emerald-glow/50 bg-emerald/35 text-ivory',
  condition: 'border-emerald-glow/40 bg-emerald-deep/60 text-ivory',
  wajib: 'border-gold/60 bg-gold/15 text-[#f0dcae]',
  sunnah: 'border-gold/40 bg-transparent text-gold',
  recommended: 'border-line-strong bg-transparent text-ivory-2',
  optional: 'border-line bg-transparent text-muted',
  notPracticed: 'border-dashed border-line-strong bg-transparent text-muted',
};

/** Colour-coded ruling category with an explanation on hover / focus / tap. */
export function RulingBadge({ level, subject }: { level: RulingLevel; subject?: string }) {
  const t = useT();
  return (
    <span className="inline-flex items-center gap-2">
      <Tooltip content={t(`ruling.${level}Help`)}>
        <span className={`rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider ${STYLE[level]}`}>
          {t(`ruling.${level}`)}
        </span>
      </Tooltip>
      {subject && <span className="text-sm text-ivory-2">{subject}</span>}
    </span>
  );
}
