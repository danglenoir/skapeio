const MarkAndWordmark = () => (
  <>
    <g transform="translate(-1.818 -5.818) scale(.90909)">
      <path fill="currentColor" d="M38.451 19.486A19 19 0 1 1 28.514 9.549A10.5 10.5 0 0 0 38.451 19.486Z" />
      <circle className="moon" fill="#fff" cx="39" cy="9" r="7" />
    </g>
    <g transform="translate(51 0)">
      <g fill="none" stroke="currentColor" strokeWidth="6">
        <path d="M20 0V21A8 8 0 0 1 4 21V19" />
        <circle cx="44.5" cy="16" r="13.5" />
        <path d="M69 0V32M69 3H78A7.5 7.5 0 0 1 78 18H69" />
        <path d="M96 0V32M96 3H102A13 13 0 0 1 102 29H96" />
      </g>
      <path fill="currentColor" d="M72.6 15H79.5L89 32H82.1Z" />
    </g>
  </>
);

// The JORD wiki logo, shown in the header and footer (design/logo/jord-wiki-lockup.svg).
export const Logo = () => (
  <svg className="wiki-logo" viewBox="0 -4 245 40" width="147" height="24" role="img" aria-label="JORD wiki">
    <MarkAndWordmark />
    <g transform="translate(181.75 0)">
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="bevel">
        <path d="M0 10 6.5 31 13 12 19.5 31 26 10" />
        <path d="M34 10V32M42 0V32M54 10 42.5 22M46.5 18.5 54.5 32M61 10V32" />
      </g>
      <circle fill="currentColor" cx="34" cy="3.5" r="2.4" />
      <circle fill="currentColor" cx="61" cy="3.5" r="2.4" />
    </g>
  </svg>
);

// The base JORD logo, for the product rather than the wiki.
export const JordLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 -4 169 40" width="203" height="48" role="img" aria-label="JORD">
    <MarkAndWordmark />
  </svg>
);
