import { useState } from 'react';
import { isFallback, useL, useLang, useT } from '@/i18n';
import { useMadhhab } from '@/hooks/useMadhhab';
import { DIFFERENCE_TITLES, MADHHABS } from '@/content/madhabs';
import { MADHHAB_IDS } from '@/content/types';
import type { DifferenceTopic } from '@/content/types';
import { Icon } from '@/components/ui/Icon';

/**
 * Shows the selected school's practice for each topic, with an optional side-by-side
 * comparison. If all four schools agree, it is labelled "Common practice".
 */
export function MadhhabNotes({ topics, defaultOpen = false }: { topics: DifferenceTopic[]; defaultOpen?: boolean }) {
  const t = useT();
  const l = useL();
  const lang = useLang();
  const { id } = useMadhhab();
  const [compare, setCompare] = useState(defaultOpen);
  if (!topics.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">{t('learn.madhhabNotes')}</p>
        <button type="button" aria-expanded={compare} onClick={() => setCompare((c) => !c)} className="inline-flex items-center gap-1 text-xs text-muted hover:text-ivory">
          {t(compare ? 'learn.hideCompare' : 'learn.compareAll')}
          <Icon name="chevronDown" size={14} className={`transition-transform ${compare ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {topics.map((topic) => {
        const texts = MADHHAB_IDS.map((m) => MADHHABS[m].differences[topic].text);
        const common = texts.every((x) => x.en === texts[0].en);
        const mine = MADHHABS[id].differences[topic].text;
        return (
          <div key={topic} className="rounded-xl border hairline bg-ink/30 p-4">
            <p className="mb-2 text-sm font-medium text-ivory">{DIFFERENCE_TITLES[topic][lang] ?? DIFFERENCE_TITLES[topic].en}</p>
            {common ? (
              <p className="text-sm text-ivory-2">
                <span className="me-2 rounded-full border border-emerald-glow/40 px-2 py-0.5 text-[0.7rem] text-emerald-glow">{t('learn.commonPractice')}</span>
                {l(mine)}
              </p>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-ivory-2">
                  <span className="me-2 text-xs font-semibold uppercase tracking-wider text-gold">{t(`madhhab.${id}`)}</span>
                  {l(mine)}
                </p>
                {isFallback(mine, lang) && <p className="mt-1 text-[0.7rem] text-dim">{t('common.translationPending')}</p>}
                {compare && (
                  <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                    {MADHHAB_IDS.map((m) => (
                      <div key={m} className={`rounded-lg border p-3 text-xs leading-relaxed ${m === id ? 'border-emerald-glow/40 bg-emerald-deep/30' : 'hairline'}`}>
                        <dt className="mb-1 font-semibold text-ivory">{t(`madhhab.${m}`)}</dt>
                        <dd className="text-muted">{l(MADHHABS[m].differences[topic].text)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
