import { useEffect, useState } from 'react';
import { LANGUAGE_NAMES, useT } from '@/i18n';
import { usePrayerStore } from '@/store/prayerStore';
import { LANGS } from '@/content/types';
import { hrefFor, useRoute } from '@/hooks/useRoute';
import type { Page } from '@/hooks/useRoute';
import { Icon } from '@/components/ui/Icon';
import { MadhhabSelector } from '@/components/prayer/MadhhabSelector';
import { Logo } from './Logo';
import { SettingsMenu } from './SettingsMenu';

const LINKS: [Page, string][] = [
  ['learn', 'nav.learn'],
  ['practice', 'nav.practice'],
  ['recitations', 'nav.recitations'],
  ['quick', 'nav.quick'],
  ['about', 'nav.about'],
  ['sources', 'nav.sources'],
];

function LanguageSwitcher() {
  const t = useT();
  const lang = usePrayerStore((s) => s.lang);
  const setLang = usePrayerStore((s) => s.setLang);
  return (
    <div className="flex items-center gap-2">
      <Icon name="globe" size={18} className="text-muted" />
      <div className="seg" role="radiogroup" aria-label={t('common.language')}>
        {LANGS.map((l) => (
          <button key={l} type="button" role="radio" aria-checked={lang === l} lang={l} onClick={() => setLang(l)} className="!px-2.5 !text-[0.76rem]">
            {l === 'en' ? 'EN' : LANGUAGE_NAMES[l]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const t = useT();
  const { page } = useRoute();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [page]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || page !== 'home' || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? 'border-b hairline bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
      style={{ height: 'var(--nav-h)' }}
    >
      <nav className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4 sm:px-6" aria-label="Main">
        <a href={hrefFor('')} className="rounded-lg" aria-label="Learn Salah — home">
          <Logo />
        </a>
        <ul className="ms-6 hidden items-center gap-1 lg:flex">
          {LINKS.map(([p, key]) => (
            <li key={p}>
              <a
                href={hrefFor(p)}
                aria-current={page === p ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-[0.88rem] transition-colors ${
                  page === p ? 'text-ivory' : 'text-ivory-2 hover:text-ivory'
                } aria-[current=page]:bg-ivory/[0.06]`}
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
        <div className="ms-auto hidden items-center gap-4 xl:flex">
          <MadhhabSelector compact />
          <span className="h-6 w-px bg-line" aria-hidden="true" />
          <LanguageSwitcher />
          <SettingsMenu />
        </div>
        <button
          type="button"
          className="ms-auto grid h-10 w-10 place-items-center rounded-xl text-ivory xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t('common.menu')}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="glass absolute inset-x-3 top-[calc(var(--nav-h)+6px)] max-h-[calc(100svh-var(--nav-h)-20px)] overflow-y-auto rounded-2xl p-4 xl:hidden">
          <ul className="grid grid-cols-2 gap-1 lg:hidden">
            {LINKS.map(([p, key]) => (
              <li key={p}>
                <a href={hrefFor(p)} aria-current={page === p ? 'page' : undefined} className="block rounded-lg px-3 py-2.5 text-ivory-2 aria-[current=page]:bg-ivory/[0.07] aria-[current=page]:text-ivory">
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-4 border-t hairline pt-4">
            <MadhhabSelector />
            <LanguageSwitcher />
            <SettingsMenu inline />
          </div>
        </div>
      )}
    </header>
  );
}
