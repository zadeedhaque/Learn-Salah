import type { ReactNode } from 'react';

/** Page section with consistent width and rhythm. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24 ${className ?? ''}`}>
      {(eyebrow || title) && (
        <header className="mb-10 max-w-2xl">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {title && <h2 className="font-display text-4xl leading-tight text-ivory md:text-5xl">{title}</h2>}
          {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
