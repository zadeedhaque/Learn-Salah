import { useEffect } from 'react';
import { useL, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { MADHHABS } from '@/content/madhabs';
import { MADHHAB_IDS } from '@/content/types';
import { hrefFor } from '@/hooks/useRoute';
import { Footer } from '@/components/layout/Footer';
import { ProgressPanel } from '@/components/prayer/ProgressPanel';

export default function About() {
  const t = useT();
  const l = useL();
  const setLayout = usePrayerStore((s) => s.setLayout);
  useEffect(() => setLayout('hidden'), [setLayout]);

  return (
    <div className="relative z-10 min-h-svh bg-ink pt-[var(--nav-h)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <p className="eyebrow mb-3">{t('nav.about')}</p>
        <h1 className="font-display text-5xl text-ivory md:text-6xl">{t('about.title')}</h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ivory-2">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
        </div>

        <h2 className="mt-14 font-display text-3xl text-ivory">{t('about.principlesTitle')}</h2>
        <ul className="mt-4 space-y-3">
          {['principle1', 'principle2', 'principle3'].map((k) => (
            <li key={k} className="flex gap-3 text-ivory-2">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" aria-hidden="true" />
              {t(`about.${k}`)}
            </li>
          ))}
        </ul>

        <h2 className="mt-14 font-display text-3xl text-ivory">{t('madhhab.label')}</h2>
        <p className="mt-3 text-muted">{t('madhhab.help')}</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {MADHHAB_IDS.map((m) => (
            <div key={m} className="glass rounded-2xl p-5">
              <dt className="flex items-baseline justify-between">
                <span className="font-display text-2xl text-ivory">{l(MADHHABS[m].name)}</span>
                <span lang="ar" className="arabic text-xl text-gold">
                  {MADHHABS[m].arabicName}
                </span>
              </dt>
              <dd className="mt-1 text-sm text-muted">
                {l(MADHHABS[m].founder)} — {l(MADHHABS[m].description)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 rounded-2xl border border-gold/30 bg-gold/5 p-6">
          <h2 className="font-display text-2xl text-ivory">{t('about.reviewTitle')}</h2>
          <p className="mt-2 text-ivory-2">{t('about.reviewBody')}</p>
          <a href={hrefFor('sources')} className="mt-3 inline-block text-sm text-gold underline underline-offset-4">
            {t('nav.sources')}
          </a>
        </div>
        <ProgressPanel className="mt-10" />
      </div>
      <Footer />
    </div>
  );
}
