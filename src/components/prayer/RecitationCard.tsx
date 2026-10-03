import { isFallback, useL, useLang, useT } from '@/i18n';
import { RECITATIONS } from '@/content/prayer';
import type { RecitationId } from '@/content/types';
import { RecitationPlayer } from './RecitationPlayer';

/** Arabic (large), transliteration and translation, with the audio player. */
export function RecitationCard({ id, onEnded, showWhen = true }: { id: RecitationId; onEnded?: () => void; showWhen?: boolean }) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const r = RECITATIONS[id];
  return (
    <article className="rounded-2xl border border-gold/15 bg-gradient-to-b from-ink-3/80 to-ink-2/60 p-5" aria-labelledby={`rec-${id}`}>
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h4 id={`rec-${id}`} className="text-sm font-semibold uppercase tracking-wider text-gold">
          {l(r.title)}
        </h4>
        {r.repeat && <span className="text-xs text-muted">{l(r.repeat)}</span>}
      </header>
      <div className="space-y-5">
        {r.lines.map((line, i) => (
          <div key={i} className="space-y-1.5">
            <p lang="ar" className="arabic text-right text-[1.85rem] leading-[2.2] text-ivory sm:text-[2.1rem]">
              {line.arabic}
            </p>
            {lang !== 'ar' && <p className="text-[0.98rem] italic text-ivory-2">{line.transliteration}</p>}
            {lang !== 'ar' && (
              <p className="text-[0.95rem] leading-relaxed text-muted">
                “{l(line.translation)}”
              </p>
            )}
          </div>
        ))}
      </div>
      {isFallback(r.lines[0].translation, lang) && lang !== 'ar' && <p className="mt-2 text-[0.7rem] text-dim">{t('common.translationPending')}</p>}
      {showWhen && (
        <p className="mt-4 text-sm text-ivory-2">
          <span className="me-2 text-xs uppercase tracking-wider text-dim">{t('recitation.when')}</span>
          {l(r.when)}
        </p>
      )}
      {r.note && <p className="mt-2 text-xs leading-relaxed text-dim">{l(r.note)}</p>}
      <div className="mt-4">
        <RecitationPlayer id={id} file={r.audio} onEnded={onEnded} />
      </div>
    </article>
  );
}
