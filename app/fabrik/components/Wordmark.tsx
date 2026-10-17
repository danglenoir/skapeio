// The fabrik wordmark: a hand-drawn 7-row bitmap, rendered as SVG cells.
// Cells appear in 4x4 Bayer order on load (CSS only), so the mark "dithers in".
const GLYPHS: Record<string, string[]> = {
  f: ['..##', '.#..', '####', '.#..', '.#..', '.#..', '.#..'],
  a: ['....', '....', '.###', '#..#', '#..#', '#..#', '.###'],
  b: ['#...', '#...', '###.', '#..#', '#..#', '#..#', '###.'],
  r: ['....', '....', '#.##', '##..', '#...', '#...', '#...'],
  i: ['#', '.', '#', '#', '#', '#', '#'],
  k: ['#...', '#...', '#..#', '#.#.', '##..', '#.#.', '#..#'],
};

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function bitmap(word = 'fabrik'): { cells: Array<[number, number]>; width: number; height: number } {
  const cells: Array<[number, number]> = [];
  let x0 = 0;
  for (const ch of word) {
    const g = GLYPHS[ch];
    if (!g) continue;
    g.forEach((row, y) => [...row].forEach((c, x) => { if (c === '#') cells.push([x0 + x, y]); }));
    x0 += (g[0]?.length ?? 0) + 1;
  }
  return { cells, width: x0 - 1, height: 7 };
}

export function Wordmark({ className, animate = true }: { className?: string; animate?: boolean }) {
  const { cells, width, height } = bitmap();
  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="fabrik" shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          className={animate ? 'px' : undefined}
          x={x + 0.06}
          y={y + 0.06}
          width={0.88}
          height={0.88}
          style={animate ? ({ '--d': BAYER[y % 4]![x % 4]! } as React.CSSProperties) : undefined}
        />
      ))}
    </svg>
  );
}
