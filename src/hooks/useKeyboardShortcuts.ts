import { useEffect } from 'react';

type Handlers = Partial<Record<'prev' | 'next' | 'toggle' | 'front' | 'side' | 'threeQuarter', () => void>>;

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

function isInteractive(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button');
}

/**
 * Optional, unobtrusive shortcuts: ← → steps, Space play/pause, F / S / T camera.
 * Ignored while typing, and Space is left alone on buttons and links.
 */
export function useKeyboardShortcuts(handlers: Handlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const map: Record<string, keyof Handlers> = {
        ArrowLeft: 'prev',
        ArrowRight: 'next',
        f: 'front',
        F: 'front',
        s: 'side',
        S: 'side',
        t: 'threeQuarter',
        T: 'threeQuarter',
      };
      if (e.key === ' ' && !isInteractive(e.target)) {
        e.preventDefault();
        handlers.toggle?.();
        return;
      }
      const action = map[e.key];
      if (action && handlers[action]) {
        e.preventDefault();
        handlers[action]!();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers, enabled]);
}
