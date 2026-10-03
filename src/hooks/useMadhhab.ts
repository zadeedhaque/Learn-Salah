import { usePrayerStore } from '@/store/prayerStore';
import { MADHHABS } from '@/content/madhabs';

/** The selected school of law, its practice profile and a setter. */
export function useMadhhab() {
  const id = usePrayerStore((s) => s.madhhab);
  const setMadhhab = usePrayerStore((s) => s.setMadhhab);
  return { id, madhhab: MADHHABS[id], practice: MADHHABS[id].practice, setMadhhab };
}
