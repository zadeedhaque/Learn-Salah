import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useL, useNum, useT } from '@/i18n';
import { RECITATIONS, RECITATION_ORDER, STEPS } from '@/content/prayer';
import type { LessonStep, RecitationId } from '@/content/types';
import { Icon } from '@/components/ui/Icon';

/**
 * Persistent recitation sidebar inside the lesson: selecting a recitation jumps
 * to the step where it is said, which moves the 3D figure there too.
 */
export function RecitationDrawer({
  open,
  onClose,
  steps,
  onJump,
}: {
  open: boolean;
  onClose: () => void;
  steps: LessonStep[];
  onJump: (index: number) => void;
}) {
  const t = useT();
  const l = useL();
  const num = useNum();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector('button')?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const indexFor = (id: RecitationId) => steps.findIndex((s) => STEPS[s.stepId].recitations.includes(id));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={t('recitation.library')}
            className="glass fixed inset-y-0 end-0 z-50 flex w-[min(92vw,380px)] flex-col rounded-s-2xl p-5"
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] } }}
            exit={{ x: '100%' }}
            style={{ insetInlineEnd: 0 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="eyebrow">{t('nav.recitations')}</h2>
              <button type="button" onClick={onClose} aria-label={t('common.close')} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-ivory/5">
                <Icon name="close" size={18} />
              </button>
            </div>
            <ol className="-mx-2 flex-1 space-y-1 overflow-y-auto">
              {RECITATION_ORDER.map((id, i) => {
                const idx = indexFor(id);
                const r = RECITATIONS[id];
                return (
                  <li key={id}>
                    <button
                      type="button"
                      disabled={idx < 0}
                      onClick={() => {
                        onJump(idx);
                        onClose();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start hover:bg-ivory/5 disabled:opacity-40"
                    >
                      <span className="w-6 text-xs tabular-nums text-dim">{num(i + 1).padStart(2, num(0))}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-ivory">{l(r.title)}</span>
                        <span lang="ar" className="arabic block truncate text-base leading-normal text-gold/80">
                          {r.lines[0].arabic}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
