/** Accessible switch. */
export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-lg px-2 py-1.5 text-start text-sm text-ivory-2 hover:bg-ivory/5"
    >
      <span>{label}</span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${checked ? 'border-emerald-glow/60 bg-emerald/70' : 'border-line-strong bg-ink-3'}`}>
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-ivory transition-all duration-300 ${checked ? 'start-[1.15rem]' : 'start-0.5'}`}
        />
      </span>
    </button>
  );
}
