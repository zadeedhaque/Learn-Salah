import { useEffect } from 'react';
import { useL, useNum, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { navigate } from '@/hooks/useRoute';
import { PRAYERS } from '@/content/prayer';
import { PRAYER_IDS } from '@/content/types';
import type { PrayerId } from '@/content/types';
import { Footer } from '@/components/layout/Footer';
import { SourceList } from '@/components/prayer/SourceList';
import { ForwardArrow } from '@/components/ui/Icon';

/** Fast, text-only structure of each daily prayer (no 3D is rendered here). */
export default function QuickReference() {
  const t = useT();
  const l = useL();
  const num = useNum();
  const setLayout = usePrayerStore((s) => s.setLayout);
  const setLesson = usePrayerStore((s) => s.setLesson);
  useEffect(() => setLayout('hidden'), [setLayout]);

  const rakahItems = (p: PrayerId, r: number) => {
    const def = PRAYERS[p];
    const items: string[] = [];
    if (r === 1) items.push(t('quick.takbir'));
    items.push(r <= 2 ? t('quick.fatihaSurah') : t('quick.fatihaOnly'));
    items.push(t('quick.ruku'), t('quick.sujood'));
    if (r === 2 && def.fardRakahs > 2) items.push(t('quick.firstTashahhud'));
    if (r === def.fardRakahs) items.push(t('quick.finalSitting'), t('quick.salam'));
    return items;
  };

  return (
    <div className="relative z-10 min-h-svh bg-ink pt-[var(--nav-h)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <p className="eyebrow mb-3">{t('nav.quick')}</p>
        <h1 className="font-display text-5xl text-ivory md:text-6xl">{t('quick.title')}</h1>
        <p className="mt-3 text-lg text-muted">{t('quick.subtitle')}</p>

        <nav aria-label={t('quick.title')} className="mt-8 flex flex-wrap gap-2">
          {PRAYER_IDS.map((p) => (
            <a key={p} href={`#/quick`} onClick={(e) => {
              e.preventDefault();
              document.getElementById(`q-${p}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }} className="chip hover:border-line-strong hover:text-ivory">
              {l(PRAYERS[p].name)} · {num(PRAYERS[p].fardRakahs)}
            </a>
          ))}
        </nav>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {PRAYER_IDS.map((p) => {
            const def = PRAYERS[p];
            return (
              <article key={p} id={`q-${p}`} className="glass scroll-mt-24 rounded-2xl p-6" aria-labelledby={`qh-${p}`}>
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <h2 id={`qh-${p}`} className="font-display text-4xl uppercase tracking-wide text-ivory">
                      {l(def.name)}
                    </h2>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                      {num(def.fardRakahs)} {t('quick.fard')}
                    </p>
                  </div>
                  <span lang="ar" className="arabic text-4xl text-gold/90">
                    {def.arabicName}
                  </span>
                </header>
                <p className="mt-3 text-sm text-muted">
                  <span className="text-dim">{t('quick.time')}: </span>
                  {l(def.time)}
                </p>
                <ol className="mt-5 space-y-3">
                  {Array.from({ length: def.fardRakahs }, (_, i) => i + 1).map((r) => (
                    <li key={r} className="rounded-xl border hairline bg-ink/40 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-ivory">{t('quick.rakah', { n: r })}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[0.68rem] ${def.aloud[r - 1] ? 'border-emerald-glow/40 text-emerald-glow' : 'hairline text-muted'}`}>
                          {t(def.aloud[r - 1] ? 'quick.aloud' : 'quick.silent')}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-ivory-2">{rakahItems(p, r).join('  ·  ')}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 space-y-2 text-sm">
                  <p className="text-xs uppercase tracking-wider text-dim">{t('quick.sunnah')}</p>
                  {def.sunnah.map((s, i) => (
                    <p key={i} className="text-muted">
                      {l(s)}
                    </p>
                  ))}
                  {def.witr && (
                    <>
                      <p className="pt-2 text-xs uppercase tracking-wider text-dim">{t('quick.witr')}</p>
                      <p className="text-muted">{l(def.witr)}</p>
                    </>
                  )}
                  {def.notes.map((n, i) => (
                    <p key={i} className="border-s-2 border-gold/30 ps-3 text-xs text-dim">
                      {l(n)}
                    </p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t hairline pt-5">
                  <SourceList ids={def.sources} compact />
                  <button
                    type="button"
                    onClick={() => {
                      setLesson(p, 0);
                      navigate('learn');
                    }}
                    className="btn btn-primary h-10 px-4 text-sm"
                  >
                    {t('quick.learnThis')}
                    <ForwardArrow size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
