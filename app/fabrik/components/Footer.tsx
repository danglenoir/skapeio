import { FooterMark } from './FooterMark';

// Marks shared with skape.io client sites (from jord-wiki's footer): the skape.io wordmark and the flag of Europe.

// Five-pointed star centred on (cx, cy), point up.
function starPoints(cx: number, cy: number, outer: number, inner: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

// Twelve stars on a circle with a radius of a third of the flag's height.
function EuFlag() {
  return (
    <svg className="footer-flag" viewBox="0 0 27 18" aria-hidden="true">
      <rect width="27" height="18" fill="#039" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI) / 6;
        return <polygon key={i} fill="#fc0" points={starPoints(13.5 + 6 * Math.sin(angle), 9 - 6 * Math.cos(angle), 1, 0.38)} />;
      })}
    </svg>
  );
}

function SkapeLogo() {
  return (
    <svg className="footer-skape" viewBox="0 0 161 33" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M151 27c-5.504 0-10-4.496-10-10s4.496-10 10-10c5.543 0 10 4.496 10 10s-4.457 10-10 10zm0-4.5c2.885 0 5-2.312 5-5.5s-2.115-5.5-5-5.5c-2.923 0-5 2.312-5 5.5s2.077 5.5 5 5.5zM135 27V13.5l5-2V27h-5zm0-20h5v3l-5 2V7zm-6 20v-5h5v5h-5zm-4-8l4 1.5c-.349.891-3.256 6.5-10 6.5-3.876 0-7.79-2.48-9.302-6.395A9.475 9.475 0 0 1 109 17c0-5.543 4.457-10 10-10 5.388 0 9.806 4.651 10 10l-14.5 3c.698 1.59 2.484 2.504 4.5 2.504 3.333 0 5.729-2.69 6-3.504zm-10.9-4l-.1 1 9.5-2c-.93-1.86-2.984-2.694-5-2.5-2.054.155-3.974 1.407-4.4 3.5zM97.7 7c5.709 0 10.3 4.588 10.3 10.293 0 5.664-4.591 10.292-10.3 10.292-2.076 0-4.103-.598-5.7-1.675V33l-5-2V7.5h5v1.136C93.597 7.598 95.624 7 97.7 7zm.05 15.5c3.029 0 5.25-2.28 5.25-5.48 0-3.24-2.221-5.52-5.25-5.52-3.07 0-5.25 2.28-5.25 5.52 0 3.2 2.18 5.48 5.25 5.48zM80.5 7.5h5v19h-5v-1.09c-1.6 1.009-3.96 1.59-6 1.59-5.72 0-10-4.496-10-10s4.28-10 10-10c2.04 0 4.4.581 6 1.59V7.5zm-5.75 15C77.9 22.5 80 20.188 80 17s-2.1-5.5-5.25-5.5-5.25 2.312-5.25 5.5 2.1 5.5 5.25 5.5zM68.5 7l-9 9.25 9 10.75h-6.25l-6.5-8L54 20.75V27h-5V3l5-2v13.799L62.25 7h6.25zM39.27 27C33.41 27 30 23.163 30 23.163l3.367-2.83s2.536 2.365 6.028 2.365c2.037 0 3.326-.62 3.326-1.59 0-2.054-12.43-1.782-12.43-8.217 0-3.45 2.951-5.891 8.397-5.891C44.591 7 48 10.837 48 10.837l-3.367 2.83s-2.578-2.365-6.07-2.365c-1.995 0-3.325.62-3.325 1.59 0 2.054 12.471 1.782 12.471 8.217 0 3.45-2.993 5.891-8.439 5.891zM28 8.001V24l-14 8-14-8V8l14-8 14 8.001zm-22.554.945l3.64 2.004 4.946-2.75 5.134 2.852L22.8 9.034 14.047 4.03 5.446 8.946zm19.101 3.238l-3.15 1.75v6.536l-5.527 3.07c.002 1.495.002 2.645 0 3.45l8.677-4.959v-9.847zM12.153 26.95l.008-3.43L6.67 20.47v-6.74l-3.122-1.718V22.03l8.605 4.918zm2.101-6.499l3.246-1.889v-4.075L14 12.45l-3.5 2.037v4.073l3.243 1.887c.17-.024.341-.023.51.003h.001z"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <FooterMark />
      <div className="footer-line">
        <p className="footer-what">fabrik, agent companies for herdr</p>
        <p className="footer-year">© 2026</p>
        <div className="footer-marks">
          <a href="https://skape.io/" className="footer-powered">
            <span>built by</span>
            <span className="visually-hidden"> skape.io</span>
            <SkapeLogo />
          </a>
          <span className="footer-eu">
            made in the <EuFlag />
            <span className="visually-hidden">EU</span>
          </span>
        </div>
      </div>
      <p className="footer-credits">
        Pictures: <a href="https://commons.wikimedia.org/w/index.php?curid=101987184">“Telephone operators at Weiss Collection”</a>, Anamosa Library and Learning Center, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>;{' '}
        <a href="https://commons.wikimedia.org/wiki/File:Simplex-Time-Recorder-time-clock.png">“Simplex time recorder”</a>, Jonathan Mauer, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>;{' '}
        <a href="https://wordpress.org/photos/photo/70654a1876/">punch clock and card rack</a> (cropped), Javier Casares, <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>;{' '}
        <a href="https://commons.wikimedia.org/w/index.php?curid=66686359">“1940s N935 telephone exchange”</a>, Rodhullandemu, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. All via Wikimedia Commons or the WordPress Photo Directory.
      </p>
    </footer>
  );
}
