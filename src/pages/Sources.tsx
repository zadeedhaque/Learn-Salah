import { useEffect, useMemo } from 'react';
import { useL, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { SOURCE_LIST, STEPS, RECITATIONS, PRAYERS } from '@/content/prayer';
import { MADHHABS } from '@/content/madhabs';
import type { Source } from '@/content/types';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/ui/Icon';

/** All references, grouped, with what each is cited for and where it is used. */
export default function Sources() {
  const t = useT();
  const l = useL();
  const setLayout = usePrayerStore((s) => s.setLayout);
  useEffect(() => setLayout('hidden'), [setLayout]);

  const usedIn = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const add = (id: string, label: string) => {
      if (!map.has(id)) map.set(id, new Set());
      map.get(id)!.add(label);
    };
    Object.values(STEPS).forEach((s) => s.sources.forEach((id) => add(id, l(s.title))));
    Object.values(RECITATIONS).forEach((r) => r.sources.forEach((id) => add(id, l(r.title))));
    Object.values(PRAYERS).forEach((p) => p.sources.forEach((id) => add(id, l(p.name))));
    Object.values(MADHHABS).forEach((m) => Object.values(m.differences).forEach((d) => d.sources?.forEach((id) => add(id, `${l(m.name)}`))));
    return map;
  }, [l]);

  const groups: { kind: Source['kind']; title: string }[] = [
    { kind: 'quran', title: t('sources.quran') },
    { kind: 'hadith', title: t('sources.hadith') },
    { kind: 'scholarly', title: t('sources.scholarly') },
  ];

  return (
    <div className="relative z-10 min-h-svh bg-ink pt-[var(--nav-h)]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
        <p className="eyebrow mb-3">{t('nav.sources')}</p>
        <h1 className="font-display text-5xl text-ivory md:text-6xl">{t('sources.title')}</h1>
        <p className="mt-4 text-lg text-muted">{t('sources.intro')}</p>
        <div className="mt-8 flex gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-5 text-sm text-ivory-2" role="note">
          <Icon name="info" size={20} className="shrink-0 text-gold" />
          <p>{t('sources.banner')}</p>
        </div>
        {groups.map((g) => (
          <section key={g.kind} className="mt-12" aria-labelledby={`src-${g.kind}`}>
            <h2 id={`src-${g.kind}`} className="mb-4 font-display text-3xl text-ivory">
              {g.title}
            </h2>
            <ul className="divide-y divide-line rounded-2xl border hairline">
              {SOURCE_LIST.filter((s) => s.kind === g.kind).map((s) => (
                <li key={s.id} className="grid gap-2 p-4 sm:grid-cols-[14rem_1fr]">
                  <div>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 font-medium text-ivory underline decoration-line-strong underline-offset-4 hover:decoration-ivory">
                        {s.work} {s.reference}
                        <Icon name="external" size={12} />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="font-medium text-ivory">
                        {s.work} — {s.reference}
                      </span>
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="text-ivory-2">{l(s.summary)}</p>
                    {usedIn.get(s.id) && (
                      <p className="mt-1 text-xs text-dim">
                        {t('sources.citedFor')}: {[...usedIn.get(s.id)!].join(' · ')}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Footer />
    </div>
  );
}
