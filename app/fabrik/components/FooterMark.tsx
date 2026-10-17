'use client';

import { useEffect, useRef, useState } from 'react';

import { bitmap } from './Wordmark';

const { cells, width, height } = bitmap();

/** The wordmark at full width. Every second a few random pixels turn red; paused offscreen and under reduced motion. */
export function FooterMark() {
  const ref = useRef<SVGSVGElement>(null);
  const [red, setRed] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; });
    io.observe(el);
    const t = window.setInterval(() => {
      if (!visible || document.hidden) return;
      const next = new Set<number>();
      const n = 3 + Math.floor(Math.random() * 5);
      while (next.size < n) next.add(Math.floor(Math.random() * cells.length));
      setRed(next);
    }, 1000);
    return () => { io.disconnect(); clearInterval(t); };
  }, []);

  return (
    <svg ref={ref} className="footer-mark" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="fabrik" shapeRendering="crispEdges">
      {cells.map(([x, y], i) => (
        <rect key={`${x}-${y}`} className={red.has(i) ? 'is-red' : undefined} x={x + 0.06} y={y + 0.06} width={0.88} height={0.88} />
      ))}
    </svg>
  );
}
