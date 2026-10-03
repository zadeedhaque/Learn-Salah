import { createJSONStorage } from 'zustand/middleware';

/**
 * localStorage can throw (private windows, blocked site data, previews), so every
 * access is guarded and falls back to an in-memory store.
 */
const memory = new Map<string, string>();

const safe = {
  getItem(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },
  setItem(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  },
  removeItem(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      memory.delete(key);
    }
  },
};

export const safeJSONStorage = createJSONStorage(() => safe);
