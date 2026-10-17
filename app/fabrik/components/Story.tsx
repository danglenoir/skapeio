'use client';

import { useEffect, useRef, useState } from 'react';

const BASE = '/fabrik';

// Ratios are width / height; each picture gets flex-grow by its ratio, so the row has one height.
const PICTURES = [
  { src: 'operators.webp', w: 1552, h: 1000, alt: 'Telephone operators in headsets at a wall of switchboard jacks, early twentieth century' },
  { src: 'time-clock.webp', w: 1000, h: 1000, alt: 'A blue Simplex time recorder, the clock workers punched at the start of a shift' },
  { src: 'card-rack.webp', w: 780, h: 1100, alt: 'A rack of time cards in numbered slots beside a punch clock' },
  { src: 'switchboard.webp', w: 1200, h: 1126, alt: 'A red wooden 1940s telephone exchange with rows of switches' },
];

const LINES = [
  'Every worker had a card in the rack',
  'and punched a clock to start the shift.',
  'Every call went where the switchboard said.',
  'fabrik gives your agents the same two things:',
  'a task that routes the work,',
  'and a heartbeat that starts the shift.',
];

/** Archival row with the story set over it; lines reveal one by one as the section scrolls into view. */
export function Story() {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [shown, setShown] = useState(0);
  const total = LINES.length + 1; // heading + lines

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the section's top reaches 85% of the viewport, 1 once it reaches 25%.
      const p = (vh * 0.85 - r.top) / (vh * 0.6);
      setShown(Math.max(0, Math.min(total, Math.ceil(p * total))));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    frame = requestAnimationFrame(() => { setLive(true); update(); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, [total]);

  const cls = (i: number) => `story-line${!live || i < shown ? ' is-shown' : ''}`;

  return (
    <section id="story" className={`story${live ? ' is-live' : ''}`} ref={ref} aria-labelledby="story-h">
      <div className="story-row">
        {PICTURES.map((p) => (
          <figure key={p.src} style={{ '--r': p.w / p.h } as React.CSSProperties}>
            <img src={`${BASE}/archive/${p.src}`} width={p.w} height={p.h} alt={p.alt} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
      <div className="story-text">
        <h2 id="story-h" className={cls(0)}><span>Factories had this figured out.</span></h2>
        <p>
          {LINES.map((l, i) => (
            <span key={l} className={cls(i + 1)}><span>{l}</span>{' '}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
