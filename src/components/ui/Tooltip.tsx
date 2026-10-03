import { useId, useState } from 'react';
import type { ReactNode } from 'react';

/** Lightweight tooltip that works on hover, focus and tap; content is also exposed to screen readers. */
export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={id} tabIndex={0} onClick={() => setOpen((o) => !o)} className="inline-flex cursor-help rounded-full">
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={`glass pointer-events-none absolute bottom-full start-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl px-3 py-2 text-xs leading-relaxed text-ivory-2 transition-opacity duration-200 rtl:translate-x-1/2 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {content}
      </span>
    </span>
  );
}
