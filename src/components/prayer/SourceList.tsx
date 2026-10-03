import { useL, useT } from '@/i18n';
import { SOURCES } from '@/content/prayer';
import { Icon } from '@/components/ui/Icon';

/** Reusable source list: [1] Sahih al-Bukhari 757 — what it is cited for. */
export function SourceList({ ids, compact = false }: { ids: string[]; compact?: boolean }) {
  const t = useT();
  const l = useL();
  const list = ids.map((id) => SOURCES[id]).filter(Boolean);
  if (!list.length) return null;
  return (
    <div>
      <p className="eyebrow mb-3">{t('learn.sources')}</p>
      <ol className="space-y-2">
        {list.map((s, i) => (
          <li key={s.id} className="flex gap-3 text-sm">
            <span className="tabular-nums text-dim">[{i + 1}]</span>
            <span className="min-w-0">
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-ivory-2 underline decoration-line-strong underline-offset-4 hover:text-ivory">
                  {s.work} {s.kind === 'quran' ? s.reference : `· ${s.reference}`}
                  <Icon name="external" size={12} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <span className="text-ivory-2">
                  {s.work} · {s.reference}
                </span>
              )}
              {!compact && <span className="block text-xs text-dim">{l(s.summary)}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
