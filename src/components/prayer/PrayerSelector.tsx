import { useL, useNum, useT } from '@/i18n';
import { PRAYERS } from '@/content/prayer';
import { PRAYER_IDS } from '@/content/types';
import type { LessonId } from '@/content/types';

/** Choose a lesson: basics, beginner path, or one of the five daily prayers. */
export function PrayerSelector({ value, onChange, includeBasics = true }: { value?: LessonId; onChange: (id: LessonId) => void; includeBasics?: boolean }) {
  const t = useT();
  const l = useL();
  const num = useNum();
  const items: { id: LessonId; title: string; sub: string; arabic?: string }[] = [
    ...(includeBasics
      ? [
          { id: 'beginner' as LessonId, title: t('learn.beginner'), sub: t('learn.beginnerDesc') },
          { id: 'basics' as LessonId, title: t('learn.basics'), sub: t('learn.basicsDesc') },
        ]
      : []),
    ...PRAYER_IDS.map((p) => ({
      id: p as LessonId,
      title: l(PRAYERS[p].name),
      arabic: PRAYERS[p].arabicName,
      sub: `${num(PRAYERS[p].fardRakahs)} ${t('quick.rakahs')} · ${t('quick.fard')}`,
    })),
  ];
  return (
    <div role="radiogroup" aria-label={t('learn.chooseLesson')} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((it) => {
        const on = value === it.id;
        return (
          <button
            key={it.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(it.id)}
            className={`rounded-xl border p-3 text-start transition-colors ${on ? 'border-emerald-glow/50 bg-emerald-deep/50' : 'hairline bg-ink/30 hover:border-line-strong'}`}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-medium text-ivory">{it.title}</span>
              {it.arabic && (
                <span lang="ar" className="arabic text-lg leading-none text-gold">
                  {it.arabic}
                </span>
              )}
            </span>
            <span className="mt-1 block text-xs text-muted">{it.sub}</span>
          </button>
        );
      })}
    </div>
  );
}
