import { Flow } from './components/Flow';
import { Footer } from './components/Footer';
import { CopyCommand, Reveal } from './components/Interactive';
import { Story } from './components/Story';
import { Wordmark } from './components/Wordmark';

// A real terminal transcript (prompt glyphs included) inside a data-ui fragment.
const ONBOARDING = [
  '❯ run the fabrik-onboard skill',
  '● fabrik init --from proposal.yaml',
  '  ⎿ created ~/fabrik/acme with 3 agents',
  '● fabrik apply',
  '  ⎿ started: ada, cody, wren',
].join('\n');

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Reveal />
      {/* The page slides over the footer, which waits underneath (see .page / .footer). */}
      <div className="page">
      <header className="top">
        <a href="#main" className="top-mark"><Wordmark className="wordmark" /></a>
        <nav className="top-nav" aria-label="Sections">
          <a href="#story">Story</a>
          <a href="#how">How it works</a>
          <a href="#install">Installation</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <h1>An agent company in your terminal.</h1>
            <p className="lead">
              fabrik is a herdr plugin. It turns Claude Code, Codex and Grok into an org chart of named tabs and wakes each
              agent when it has a task. No complex configuration and no web UI.
            </p>
            <div className="hero-actions">
              <a className="button" href="#install">Install fabrik</a>
              <a className="textlink" href="#how">How it works</a>
            </div>
          </div>

          <ul className="parts" aria-label="What fabrik is made of">
            <li className="part part--herdr">
              <h2>A herdr plugin</h2>
              <p>Runs inside herdr, the terminal workspace for coding agents. Every agent gets its own tab, named for its role.</p>
              <div className="part-ui part-tabs" data-ui aria-hidden="true">
                <span>board</span><span className="on">● ada · ceo</span><span>○ cody · engineer</span><span>○ wren · ops</span>
              </div>
            </li>
            <li className="part part--plane">
              <h2>Project management with Plane</h2>
              <p>Tasks become Plane tickets that agents claim, comment on and close.</p>
              <div className="part-ui part-ticket" data-ui aria-hidden="true">
                <span>ACME-12</span><span>In Progress</span><span>agent:cody</span>
              </div>
              <p className="part-soon">More tools coming soon.</p>
            </li>
            <li className="part part--obsidian">
              <h2>Obsidian as its database</h2>
              <p>fabrik keeps your company in a folder of Markdown notes that you can open as an Obsidian vault.</p>
              <div className="part-ui part-files" data-ui aria-hidden="true">
                <span>Fabrik/</span><span>  agents/cody.md</span><span>  journal/cody/</span><span>  inbox/</span>
              </div>
              <p className="part-soon">More coming soon.</p>
            </li>
          </ul>
        </section>

        <Story />

        <section className="how" id="how" aria-labelledby="how-h">
          <div className="how-head" data-reveal>
            <h2 id="how-h">How it works</h2>
            <p>
              Three tools, one loop. herdr runs the agents, Plane holds the tasks, and your company lives in a folder of
              Markdown notes that opens as an Obsidian vault. Every agent is one note: its name, role, model and
              instructions. Edit the note and fabrik starts that agent the new way.
            </p>
          </div>
          <div data-reveal><Flow /></div>
          <p className="how-more" data-reveal>
            fabrik is built for <a href="https://herdr.dev">herdr</a> and today it works with{' '}
            <a href="https://plane.so">Plane</a> and <a href="https://obsidian.md">Obsidian</a>. But much more to come…
          </p>
        </section>

        <section className="install" id="install" aria-labelledby="install-h">
          <div className="install-head" data-reveal>
            <h2 id="install-h">Install in three steps</h2>
            <p>
              You need herdr 0.9.3 or newer, Node 24, and at least one of Claude Code, Codex or Grok. fabrik is open source
              under Apache-2.0, on <a href="https://github.com/danglenoir/fabrik">GitHub</a>.
            </p>
          </div>
          <ol className="install-steps">
            <li data-reveal>
              <h3>Add the plugin to herdr</h3>
              <CopyCommand command="herdr plugin install danglenoir/fabrik" />
            </li>
            <li data-reveal>
              <h3>Teach your agents the skills</h3>
              <CopyCommand command="npx skills add danglenoir/fabrik -g -a claude-code codex grok" />
            </li>
            <li data-reveal>
              <h3>Start your company</h3>
              <p>In any agent tab, ask for the onboarding. It interviews you, proposes an org and opens the tabs.</p>
              <pre className="install-term" data-ui><code>{ONBOARDING}</code></pre>
            </li>
          </ol>
        </section>
      </main>
      </div>

      <Footer />
    </>
  );
}
