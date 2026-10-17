'use client';

import { useEffect, useRef, useState } from 'react';

type Anchor = 'you' | 'herdrTop' | 'herdrLeft' | 'herdrRight' | 'plane' | 'obsidian';
type Agent = 'ada' | 'cody' | 'wren';

// Positions in % of the stage (16:10).
const AT: Record<Anchor, [number, number]> = {
  you: [50, 7],
  herdrTop: [50, 24],
  herdrLeft: [33, 55],
  herdrRight: [67, 55],
  plane: [21, 55],
  obsidian: [79, 55],
};

interface Step {
  title: string;
  text: string;
  from: Anchor;
  to: Anchor;
  caption: string;
  working: Agent | null;
  ticket: string | null;
  note: boolean;
  line: 'you' | 'plane' | 'obsidian';
}

const STEPS: Step[] = [
  {
    title: 'You give your company a task.',
    text: 'Brief your CEO agent in its herdr tab, the way you would brief a person.',
    from: 'you', to: 'herdrTop', caption: '“Fix the pricing page on phones.”', working: 'ada', ticket: null, note: false, line: 'you',
  },
  {
    title: 'The CEO turns it into tickets.',
    text: 'It splits the work and files tickets in Plane, each labelled for the agent who should do it.',
    from: 'herdrLeft', to: 'plane', caption: 'fabrik task create … --assign cody', working: 'ada', ticket: 'Todo · agent:cody', note: false, line: 'plane',
  },
  {
    title: 'The heartbeat wakes the right agent.',
    text: 'fabrik watches Plane. When a ticket is labelled for cody, cody’s tab wakes up, as soon as cody is free.',
    from: 'plane', to: 'herdrLeft', caption: '[fabrik wake] ACME-12: assigned', working: 'cody', ticket: 'Todo · agent:cody', note: false, line: 'plane',
  },
  {
    title: 'The agent claims it and works.',
    text: 'Claims are exclusive, so two agents never do the same job. Progress goes on the ticket as comments.',
    from: 'herdrLeft', to: 'plane', caption: 'fabrik task claim ACME-12', working: 'cody', ticket: 'In Progress · cody', note: false, line: 'plane',
  },
  {
    title: 'It writes down what it learned.',
    text: 'Decisions and journals go into your Obsidian vault as plain notes. Chats can be reset; notes stay.',
    from: 'herdrRight', to: 'obsidian', caption: 'fabrik note "table needs a scroll wrapper"', working: 'cody', ticket: 'In Progress · cody', note: true, line: 'obsidian',
  },
  {
    title: 'It hands the work back.',
    text: 'The ticket moves to review for you or the CEO to check. The agent rests until its next task.',
    from: 'herdrLeft', to: 'plane', caption: 'fabrik task state ACME-12 in_review', working: null, ticket: 'In Review · cody', note: true, line: 'plane',
  },
];

const AGENTS: Array<[Agent, string]> = [['ada', 'ceo'], ['cody', 'engineer'], ['wren', 'ops']];

export function Flow() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [token, setToken] = useState<{ at: [number, number]; move: boolean }>({ at: AT.you, move: false });
  const stage = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const s = STEPS[step]!;

  // Each step: jump the task chip to its origin, then let it travel to the destination.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf2 = 0;
    let raf3 = 0;
    // Frame 1: jump without a transition. Frames 2-3: travel, once the jump has been painted.
    const raf1 = requestAnimationFrame(() => {
      setToken({ at: AT[reduce ? s.to : s.from], move: false });
      if (reduce) return;
      raf2 = requestAnimationFrame(() => { raf3 = requestAnimationFrame(() => setToken({ at: AT[s.to], move: true })); });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); cancelAnimationFrame(raf3); };
  }, [step, s.from, s.to]);

  // Auto-advance while the diagram is on screen, until the visitor takes over.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { visible.current = !!e?.isIntersecting; }, { threshold: 0.4 });
    io.observe(el);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setInterval(() => {
      if (auto && !reduce && visible.current && !document.hidden) setStep((i) => (i + 1) % STEPS.length);
    }, 3600);
    return () => { io.disconnect(); clearInterval(t); };
  }, [auto]);

  const pick = (i: number) => { setAuto(false); setStep(i); };

  return (
    <div className="flow">
      <div className="flow-visual">
      <div className="flow-stage" ref={stage} data-ui aria-hidden="true">
        <svg className="flow-lines" viewBox="0 0 100 62.5" preserveAspectRatio="none">
          <line x1="50" y1="9" x2="50" y2="15" className={s.line === 'you' ? 'on' : ''} />
          <line x1="27" y1="34.4" x2="33" y2="34.4" className={s.line === 'plane' ? 'on' : ''} />
          <line x1="67" y1="34.4" x2="73" y2="34.4" className={s.line === 'obsidian' ? 'on' : ''} />
        </svg>

        <div className={`flow-you${step === 0 || step === 5 ? ' is-on' : ''}`}>You, the board</div>

        <div className="flow-node flow-plane">
          <p className="flow-head">Plane</p>
          <p className="flow-sub">project management</p>
          <div className={`flow-ticket${s.ticket ? ' is-on' : ''}`}>
            <span>ACME-12</span>
            <span>{s.ticket ?? 'no ticket yet'}</span>
          </div>
          <div className="flow-ticket flow-ticket--old"><span>ACME-9</span><span>Done · wren</span></div>
        </div>

        <div className="flow-node flow-herdr">
          <p className="flow-head">herdr</p>
          <p className="flow-sub">one tab per agent</p>
          {AGENTS.map(([a, role]) => (
            <div key={a} className={`flow-agent${s.working === a ? ' is-on' : ''}`}>
              <span className="flow-glyph">{s.working === a ? '●' : '○'}</span>
              <span>{a} · {role}</span>
              <span className="flow-state">{s.working === a ? 'working' : 'idle'}</span>
            </div>
          ))}
        </div>

        <div className="flow-node flow-obsidian">
          <p className="flow-head">Obsidian</p>
          <p className="flow-sub">notes and memory</p>
          <div className="flow-file">Fabrik/agents/cody.md</div>
          <div className={`flow-file${s.note ? ' is-on' : ''}`}>journal/cody/2026-10-17.md</div>
        </div>

        <div
          className={`flow-token${token.move ? ' is-moving' : ''}`}
          style={{ '--x': token.at[0], '--y': token.at[1] } as React.CSSProperties}
        >
          ACME-12
        </div>
        <p className="flow-caption" key={step}>{s.caption}</p>
      </div>
      <button
        type="button"
        className="flow-play"
        onClick={() => setAuto((v) => !v)}
        aria-pressed={auto}
        aria-label={auto ? 'Pause the walkthrough' : 'Play the walkthrough'}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          {auto ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
      </div>

      <div className="flow-steps">
        <ol>
          {STEPS.map((x, i) => (
            <li key={x.title}>
              <button type="button" aria-current={i === step ? 'step' : undefined} onClick={() => pick(i)}>
                <span className="flow-num" aria-hidden="true">{i + 1}.</span>
                <span className="flow-step-title">{x.title}</span>
                <span className="flow-step-text">{x.text}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
