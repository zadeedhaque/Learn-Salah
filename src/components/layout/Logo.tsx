export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4c98f" />
          <stop offset="1" stopColor="#a8884d" />
        </linearGradient>
      </defs>
      <path d="M7 29V15.5C7 9.5 11 6 16 3c5 3 9 6.5 9 12.5V29" fill="none" stroke="url(#logo-g)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11.5 29V17.5c0-3 2-5 4.5-6.5 2.5 1.5 4.5 3.5 4.5 6.5V29" fill="none" stroke="url(#logo-g)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[1.45rem] font-semibold leading-none tracking-tight text-ivory" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Learn Salah
      </span>
    </span>
  );
}
