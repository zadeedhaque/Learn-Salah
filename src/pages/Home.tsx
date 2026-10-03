import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useL, useNum, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { useModelAnimation } from '@/hooks/useModelAnimation';
import { navigate, hrefFor } from '@/hooks/useRoute';
import { PRAYERS, STEPS } from '@/content/prayer';
import { buildLesson } from '@/content/prayer/lessons';
import { resolvePose } from '@/content/resolve';
import { MADHHABS } from '@/content/madhabs';
import { PRAYER_IDS } from '@/content/types';
import type { LessonId, StepId } from '@/content/types';
import { Icon, ForwardArrow } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { Section } from '@/components/layout/Section';
import { Footer } from '@/components/layout/Footer';
import { ModelControls } from '@/components/3d/ModelControls';
import { PoseIllustration } from '@/components/3d/PoseIllustration';
import { ProgressPanel } from '@/components/prayer/ProgressPanel';
import type { PoseId } from '@/three/rig/poses';

/** Steps the hero card can preview on the figure. */
const HERO_STEPS: StepId[] = ['qiyam', 'takbir', 'ruku', 'itidal', 'sujood', 'jalsa', 'tashahhud', 'salam-right'];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] as const } },
});

export default function Home() {
  const t = useT();
  const l = useL();
  const num = useNum();
  const setLayout = usePrayerStore((s) => s.setLayout);
  const setLesson = usePrayerStore((s) => s.setLesson);
  const madhhab = usePrayerStore((s) => s.madhhab);
  const level = usePrayerStore((s) => s.level);
  const { showAbstract } = useModelAnimation();
  const [heroIdx, setHeroIdx] = useState(0);
  const heroStep = STEPS[HERO_STEPS[heroIdx]];

  useEffect(() => setLayout('hero'), [setLayout]);
  useEffect(() => {
    showAbstract(heroStep.pose, { view: 'threeQuarter', sitting: 'final' });
  }, [heroStep, showAbstract]);

  const openLesson = (id: LessonId, stepId?: StepId) => {
    const steps = buildLesson(id);
    const i = stepId ? Math.max(steps.findIndex((s) => s.stepId === stepId), 0) : 0;
    setLesson(id, i);
    navigate('learn');
  };

  const start = () => openLesson(level === 'new' ? 'beginner' : 'basics');

  const features: { icon: IconName; label: string }[] = [
    { icon: 'cube', label: t('hero.f3d') },
    { icon: 'sound', label: t('hero.fRecitations') },
    { icon: 'book', label: t('hero.fPrayers') },
    { icon: 'users', label: t('hero.fMadhhabs') },
    { icon: 'globe', label: t('hero.fLanguages') },
  ];

  const cards: { href: string; title: string; body: string; icon: IconName; pose: PoseId }[] = [
    { href: 'learn', title: t('nav.learn'), body: t('hero.cardLearn'), icon: 'book', pose: resolvePose('qiyam', MADHHABS[madhhab].practice) },
    { href: 'practice', title: t('nav.practice'), body: t('hero.cardPractice'), icon: 'chart', pose: 'ruku' },
    { href: 'recitations', title: t('nav.recitations'), body: t('hero.cardRecitations'), icon: 'headphones', pose: 'sujood' },
    { href: 'quick', title: t('nav.quick'), body: t('hero.cardQuick'), icon: 'file', pose: 'tashahhud' },
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end pb-6 pt-[50svh] md:justify-center md:pt-[calc(var(--nav-h)+2rem)]">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-10">
          <div className="relative z-10 max-w-2xl self-center">
            <motion.p {...fade(0.1)} className="mb-6 inline-flex rounded-full border border-emerald-glow/35 bg-emerald-deep/40 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-emerald-glow">
              {t('hero.badge')}
            </motion.p>
            <motion.h1 {...fade(0.2)} className="font-display text-[2.9rem] leading-[0.98] text-ivory sm:text-7xl xl:text-[5.4rem]">
              <span className="block">{t('hero.title1')}</span>
              <span className="text-gradient block">{t('hero.title2')}</span>
              <span className="text-gradient block">{t('hero.title3')}</span>
            </motion.h1>
            <motion.p {...fade(0.35)} className="mt-6 max-w-xl text-lg leading-relaxed text-ivory-2 sm:text-xl">
              {t('hero.subtitle')}
            </motion.p>
            <motion.div {...fade(0.5)} className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={start} className="btn btn-primary h-14 px-7 text-lg">
                {t('hero.start')}
                <ForwardArrow />
              </button>
              <a href={hrefFor('quick')} className="btn btn-ghost h-14 px-7 text-lg">
                <Icon name="book" size={20} />
                {t('hero.quick')}
              </a>
            </motion.div>
            <motion.ul {...fade(0.65)} className="mt-8 hidden flex-nowrap gap-x-4 sm:flex">
              {features.map((f, i) => (
                <li key={f.label} className={`flex flex-col items-center gap-2 text-center text-xs text-ivory-2 ${i ? 'border-s hairline ps-4' : ''}`}>
                  <Icon name={f.icon} size={24} className="text-ivory" strokeWidth={1.3} />
                  <span className="max-w-[6rem] leading-snug">{f.label}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Floating step card, previews poses on the figure */}
          <motion.aside {...fade(0.8)} className="relative z-10 hidden self-center justify-self-end md:block" aria-label={t('hero.nowShowing')}>
            <div className="glass w-80 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-3xl text-ivory">{l(heroStep.title)}</p>
                  <p className="text-ivory-2">{l(heroStep.subtitle)}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <span className="tabular-nums">
                    {num(heroIdx + 1)} {t('common.of')} {num(HERO_STEPS.length)}
                  </span>
                  <button
                    type="button"
                    aria-label={t('learn.next')}
                    onClick={() => setHeroIdx((i) => (i + 1) % HERO_STEPS.length)}
                    className="grid h-8 w-8 place-items-center rounded-full text-ivory hover:bg-ivory/10"
                  >
                    <Icon name="chevronRight" size={18} className="rtl:-scale-x-100" />
                  </button>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{l(heroStep.instruction)}</p>
              <button type="button" onClick={() => openLesson('basics', HERO_STEPS[heroIdx])} className="mt-3 inline-flex items-center gap-1.5 text-sm text-ivory hover:text-emerald-glow">
                {t('hero.viewStep')} <ForwardArrow size={15} />
              </button>
              <div className="mt-4 flex gap-1.5" aria-hidden="true">
                {HERO_STEPS.map((_, i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i === heroIdx ? 'bg-emerald-glow' : 'bg-ivory/12'}`} />
                ))}
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Destination cards */}
        <motion.nav {...fade(0.9)} aria-label="Sections" className="relative z-10 mx-auto mt-8 grid w-full max-w-[1600px] grid-cols-2 gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
          {cards.map((c) => (
            <a key={c.href} href={hrefFor(c.href)} className="glass group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-emerald-glow/30">
              <PoseIllustration pose={c.pose} className="hidden h-16 w-16 shrink-0 text-ivory-2/90 sm:block" />
              <span className="min-w-0 flex-1">
                <Icon name={c.icon} size={20} className="mb-1 text-gold" />
                <span className="block font-display text-2xl text-ivory">{c.title}</span>
                <span className="hidden text-sm text-muted sm:block">{c.body}</span>
              </span>
              <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border hairline sm:grid text-ivory transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                <ForwardArrow size={16} />
              </span>
            </a>
          ))}
        </motion.nav>
        <ModelControlsHero />
      </section>

      {/* Below the fold: solid background over the fixed canvas */}
      <div className="relative z-10 bg-ink">
        <Section eyebrow={t('hero.tagline')} title={t('hero.storyTitle')}>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { k: 'What', icon: 'eye' as IconName },
              { k: 'How', icon: 'cube' as IconName },
              { k: 'Say', icon: 'sound' as IconName },
            ].map(({ k, icon }) => (
              <div key={k} className="glass rounded-2xl p-6">
                <Icon name={icon} size={22} className="mb-4 text-gold" />
                <p className="font-display text-3xl text-ivory">{t(`hero.story${k}`)}</p>
                <p className="mt-2 text-muted">{t(`hero.story${k}Body`)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow={t('nav.learn')} title={t('hero.prayersTitle')} intro={t('hero.prayersBody')} className="pt-0">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PRAYER_IDS.map((p) => (
                <li key={p}>
                  <button type="button" onClick={() => openLesson(p)} className="glass group flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-start hover:border-emerald-glow/30">
                    <span>
                      <span className="block font-display text-3xl text-ivory">{l(PRAYERS[p].name)}</span>
                      <span className="text-sm text-muted">
                        {num(PRAYERS[p].fardRakahs)} {t('quick.rakahs')} · {t('quick.fard')}
                      </span>
                    </span>
                    <span lang="ar" className="arabic text-3xl text-gold">
                      {PRAYERS[p].arabicName}
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => openLesson('beginner')} className="flex h-full w-full items-center justify-between gap-4 rounded-2xl border border-emerald-glow/30 bg-emerald-deep/40 p-5 text-start hover:bg-emerald-deep/60">
                  <span>
                    <span className="block font-display text-2xl text-ivory">{t('learn.beginner')}</span>
                    <span className="text-sm text-muted">{t('learn.beginnerDesc')}</span>
                  </span>
                  <ForwardArrow />
                </button>
              </li>
            </ul>
            <ProgressPanel />
          </div>
        </Section>
        <Footer />
      </div>
    </div>
  );
}

function ModelControlsHero() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="pointer-events-auto">
        <ModelControls variant="hero" />
      </div>
    </div>
  );
}
