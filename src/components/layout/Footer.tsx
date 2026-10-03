import { useT } from '@/i18n';
import { hrefFor } from '@/hooks/useRoute';
import { Logo } from './Logo';

export function Footer({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const links: [string, string][] = [
    ['learn', 'nav.learn'],
    ['practice', 'nav.practice'],
    ['recitations', 'nav.recitations'],
    ['quick', 'nav.quick'],
    ['sources', 'nav.sources'],
    ['about', 'nav.about'],
  ];
  return (
    <footer className={`relative z-10 border-t hairline bg-ink/95 ${compact ? 'mt-10' : ''}`}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1.4fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted">{t('hero.tagline')}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {links.map(([href, key]) => (
              <li key={href}>
                <a className="text-ivory-2 hover:text-ivory" href={hrefFor(href)}>
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 text-sm leading-relaxed text-muted">
          <p>{t('footer.disclaimer')}</p>
          <p className="text-dim">{t('footer.status')}</p>
          <p className="text-dim">{t('footer.copyright')}</p>
          <p className="text-ivory-2" lang="en">
            Made By Zadeed Haque
          </p>
        </div>
      </div>
    </footer>
  );
}
