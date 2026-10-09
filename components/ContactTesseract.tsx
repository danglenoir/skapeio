'use client';

import { ReactNode, useEffect, useRef } from 'react';

import { LOGO_MARK_HEIGHT, LOGO_MARK_PATH, LOGO_MARK_WIDTH } from '@/lib/brand';

import styles from '@/components/Contact.module.css';

type Ripple = { x: number; y: number; startedAt: number; strength: number };
type Pointer = { x: number; y: number; strength: number };

const GLYPHS = ' .:-=+*#%@';
const FRAME_INTERVAL = 1000 / 30;

const ContactTesseract = ({ children }: { children: ReactNode }): ReactNode => {
  const stageRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const art = artRef.current;
    if (!stage || !art) return;

    // Rasterize the actual vector mark once; every frame samples this same flat silhouette.
    const source = document.createElement('canvas');
    source.width = 512;
    source.height = Math.ceil(source.width * LOGO_MARK_HEIGHT / LOGO_MARK_WIDTH);
    const context = source.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    context.scale(source.width / LOGO_MARK_WIDTH, source.height / LOGO_MARK_HEIGHT);
    context.fill(new Path2D(LOGO_MARK_PATH), 'evenodd');
    const pixels = context.getImageData(0, 0, source.width, source.height).data;

    const coverageAt = (x: number, y: number): number => {
      if (x < 0 || y < 0 || x >= LOGO_MARK_WIDTH || y >= LOGO_MARK_HEIGHT) return 0;
      const column = Math.min(source.width - 1, Math.floor(x / LOGO_MARK_WIDTH * source.width));
      const row = Math.min(source.height - 1, Math.floor(y / LOGO_MARK_HEIGHT * source.height));
      return pixels[(row * source.width + column) * 4 + 3] / 255;
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let rootFontSize = 16;
    let cellWidth = 0;
    let cellHeight = 0;
    let columns = 0;
    let rows = 0;
    let ripples: Ripple[] = [];
    let pointer: Pointer | null = null;
    let pointerTarget: { x: number; y: number } | null = null;
    let lastRipple: { x: number; y: number; time: number } | null = null;
    let lastFrameAt = 0;
    let rotation = 0;
    let frame: number | null = null;
    let isVisible = false;
    let disposed = false;

    const draw = (now: number) => {
      if (!columns || !rows) return;

      ripples = ripples.filter((ripple) => now - ripple.startedAt < 2400);
      const scale = width / LOGO_MARK_WIDTH;
      const centerY = LOGO_MARK_HEIGHT * scale / 2 - 5 * rootFontSize;
      const cosine = Math.cos(rotation);
      const sine = Math.sin(rotation);
      const pointerRadius = Math.min(86, Math.max(48, width * 0.065)) / 3;
      const lines: string[] = [];

      for (let row = 0; row < rows; row += 1) {
        let line = '';
        for (let column = 0; column < columns; column += 1) {
          const x = (column + 0.5) * cellWidth;
          const y = (row + 0.5) * cellHeight;
          let offsetX = 0;
          let offsetY = 0;
          let reveal = 1;

          if (pointer && pointer.strength > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const distance = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - distance / (pointerRadius * 2));
            const push = influence ** 2 * 52 * pointer.strength;
            offsetX += dx / Math.max(distance, 1) * push;
            offsetY += dy / Math.max(distance, 1) * push;

            // An inverse flashlight: a clear center with a soft rim, even at rest.
            const rim = Math.max(0, Math.min(1, (distance / pointerRadius - 0.62) / 0.38));
            reveal = 1 - pointer.strength * (1 - rim * rim * (3 - 2 * rim));
          }

          for (const ripple of ripples) {
            const age = (now - ripple.startedAt) / 1000;
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const distance = Math.hypot(dx, dy);
            const front = distance - age * 145;
            if (Math.abs(front) > 190) continue;
            const envelope = Math.exp(-(front * front) / 14000 - age * 1.9);
            const wave = Math.sin(distance / 22 - age * 10) * envelope * ripple.strength;
            offsetX += dx / Math.max(distance, 1) * wave;
            offsetY += dy / Math.max(distance, 1) * wave;
          }

          // Keep the full-width logo's top at -5rem, independent of the section height.
          // A single uniform scale and in-plane rotation preserve the SVG's proportions.
          const localX = (x - Math.max(-48, Math.min(48, offsetX)) - width / 2) / scale;
          const localY = (y - Math.max(-48, Math.min(48, offsetY)) - centerY) / scale;
          const sourceX = localX * cosine + localY * sine + LOGO_MARK_WIDTH / 2;
          const sourceY = -localX * sine + localY * cosine + LOGO_MARK_HEIGHT / 2;

          // Sample across the character cell to preserve the vector's precise edges and gaps.
          const coverage = (
            coverageAt(sourceX, sourceY)
            + coverageAt(sourceX - cellWidth * 0.25 / scale, sourceY)
            + coverageAt(sourceX + cellWidth * 0.25 / scale, sourceY)
            + coverageAt(sourceX, sourceY - cellHeight * 0.25 / scale)
            + coverageAt(sourceX, sourceY + cellHeight * 0.25 / scale)
          ) / 5;
          const texture = 0.72 + ((column * 13 + row * 7) % 29) / 100;
          const density = coverage * reveal * texture;
          line += GLYPHS[Math.min(GLYPHS.length - 1, Math.round(density * (GLYPHS.length - 1)))];
        }
        lines.push(line);
      }
      art.textContent = lines.join('\n');
    };

    const animate = (now: number) => {
      frame = null;
      if (now - lastFrameAt >= FRAME_INTERVAL) {
        const delta = lastFrameAt ? Math.min(now - lastFrameAt, 100) / 1000 : 0;
        rotation += delta * 0.045;
        const smoothing = 1 - Math.exp(-delta * 12);
        if (pointer) {
          if (pointerTarget) {
            pointer.x += (pointerTarget.x - pointer.x) * smoothing;
            pointer.y += (pointerTarget.y - pointer.y) * smoothing;
          }
          pointer.strength += ((pointerTarget ? 1 : 0) - pointer.strength) * smoothing;
          if (!pointerTarget && pointer.strength < 0.01) pointer = null;
        }
        lastFrameAt = now;
        draw(now);
      }
      frame = window.requestAnimationFrame(animate);
    };

    const syncAnimation = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      lastFrameAt = 0;
      lastRipple = null;
      pointer = null;
      pointerTarget = null;
      ripples = [];
      draw(performance.now());
      if (isVisible && !document.hidden && !motionQuery.matches) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const fontSize = Math.max(7, width / 200 / 0.6);
      art.style.fontSize = `${fontSize}px`;
      art.style.lineHeight = `${fontSize * 1.15}px`;
      const computed = getComputedStyle(art);
      context.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
      cellWidth = context.measureText('M').width || fontSize * 0.6;
      cellHeight = fontSize * 1.15;
      columns = Math.max(1, Math.floor(width / cellWidth));
      rows = Math.max(1, Math.floor(height / cellHeight));
      draw(performance.now());
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (motionQuery.matches || event.pointerType === 'touch') return;
      const bounds = stage.getBoundingClientRect();
      const now = performance.now();
      pointerTarget = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (!pointer) pointer = { ...pointerTarget, strength: 0 };

      if (!lastRipple) {
        lastRipple = { ...pointerTarget, time: now };
      } else if (now - lastRipple.time >= 55) {
        const distance = Math.hypot(pointerTarget.x - lastRipple.x, pointerTarget.y - lastRipple.y);
        if (distance > 3) {
          const speed = distance / Math.max(1, now - lastRipple.time);
          ripples.push({
            ...pointerTarget,
            startedAt: now,
            strength: Math.min(26, 8 + speed * 12),
          });
          ripples = ripples.slice(-6);
          lastRipple = { ...pointerTarget, time: now };
        }
      }
    };

    const handlePointerLeave = () => {
      pointerTarget = null;
      lastRipple = null;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncAnimation();
    });
    intersectionObserver.observe(stage);
    stage.addEventListener('pointermove', handlePointerMove, { passive: true });
    stage.addEventListener('pointerleave', handlePointerLeave);
    motionQuery.addEventListener('change', syncAnimation);
    document.addEventListener('visibilitychange', syncAnimation);
    resize();
    document.fonts.ready.then(() => { if (!disposed) resize(); });

    return () => {
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      stage.removeEventListener('pointermove', handlePointerMove);
      stage.removeEventListener('pointerleave', handlePointerLeave);
      motionQuery.removeEventListener('change', syncAnimation);
      document.removeEventListener('visibilitychange', syncAnimation);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={styles.Contact__Stage}
    >
      <pre ref={artRef} className={styles.Contact__Art} aria-hidden="true" />
      {children}
    </div>
  );
};

export default ContactTesseract;
