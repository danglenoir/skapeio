'use client';

import { useEffect, useState } from 'react';

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="copy" data-ui>
      <code>{command}</code>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(command).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); })}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span className="visually-hidden" aria-live="polite">{copied ? 'Command copied' : ''}</span>
    </div>
  );
}

/** Adds .is-in to [data-reveal] elements once they scroll into view. Content is visible without script. */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    document.querySelector('.fabrik')?.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
