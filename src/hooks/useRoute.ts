import { useSyncExternalStore } from 'react';

/**
 * Minimal hash router: keeps the app deployable to any static host (no server
 * rewrites needed). Routes look like `#/learn`, `#/practice/fajr`.
 */
export type Page = 'home' | 'learn' | 'practice' | 'recitations' | 'quick' | 'about' | 'sources';
const PAGES: Page[] = ['home', 'learn', 'practice', 'recitations', 'quick', 'about', 'sources'];

export interface Route {
  page: Page;
  params: string[];
}

function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const page = (PAGES as string[]).includes(parts[0] ?? '') ? (parts[0] as Page) : 'home';
  return { page, params: parts.slice(1) };
}

let current = parse(typeof window === 'undefined' ? '' : window.location.hash);
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    current = parse(window.location.hash);
    listeners.forEach((l) => l());
  });
}

export function navigate(path: string) {
  const target = `#/${path.replace(/^\/+/, '')}`;
  if (window.location.hash === target) return;
  window.location.hash = target;
}

export function hrefFor(path: string) {
  return `#/${path.replace(/^\/+/, '')}`;
}

export function useRoute(): Route {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}
