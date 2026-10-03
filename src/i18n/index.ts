import { useCallback, useMemo } from 'react';
import en from '@/locales/en.json';
import bn from '@/locales/bn.json';
import ar from '@/locales/ar.json';
import { usePrayerStore } from '@/store/prayerStore';
import type { L10n, Lang } from '@/content/types';

type Dict = { [k: string]: string | Dict };
const DICTS: Record<Lang, Dict> = { en, bn, ar };

export const DIRECTION: Record<Lang, 'ltr' | 'rtl'> = { en: 'ltr', bn: 'ltr', ar: 'rtl' };
export const HTML_LANG: Record<Lang, string> = { en: 'en', bn: 'bn', ar: 'ar' };
export const LANGUAGE_NAMES: Record<Lang, string> = { en: 'English', bn: 'বাংলা', ar: 'العربية' };

function lookup(dict: Dict, key: string): string | undefined {
  let cur: string | Dict | undefined = dict;
  for (const part of key.split('.')) {
    if (typeof cur !== 'object' || cur === null) return undefined;
    cur = cur[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export type TFunc = (key: string, vars?: Record<string, string | number>) => string;

export function makeT(lang: Lang): TFunc {
  return (key, vars) => {
    let s = lookup(DICTS[lang], key) ?? lookup(DICTS.en, key) ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replaceAll(`{${k}}`, typeof v === 'number' ? fmtNum(v, lang) : v);
      }
    }
    return s;
  };
}

/** Format numbers with the script's own digits (Bengali / Arabic-Indic). */
export function fmtNum(n: number, lang: Lang): string {
  const nu = lang === 'bn' ? 'beng' : lang === 'ar' ? 'arab' : 'latn';
  try {
    return new Intl.NumberFormat(`${lang}-u-nu-${nu}`).format(n);
  } catch {
    return String(n);
  }
}

/** UI strings for the current language. */
export function useT(): TFunc {
  const lang = usePrayerStore((s) => s.lang);
  return useMemo(() => makeT(lang), [lang]);
}

export function useLang(): Lang {
  return usePrayerStore((s) => s.lang);
}

/** Pick localised content text, falling back to English. */
export function pickL10n(text: L10n | undefined, lang: Lang): string {
  if (!text) return '';
  return text[lang] ?? text.en;
}

export function isFallback(text: L10n | undefined, lang: Lang): boolean {
  return !!text && lang !== 'en' && !text[lang];
}

export function useL() {
  const lang = useLang();
  return useCallback((text: L10n | undefined) => pickL10n(text, lang), [lang]);
}

export function useNum() {
  const lang = useLang();
  return useCallback((n: number) => fmtNum(n, lang), [lang]);
}
