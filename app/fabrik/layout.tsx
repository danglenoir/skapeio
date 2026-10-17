import { ReactNode } from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './fabrik.css';

// The fabrik one-pager lives inside skape.io but is its own page: own fonts, colours and metadata.
// JetBrains Mono comes from the root layout (--font-jetbrains-mono).
const switzer = localFont({
  src: [
    { path: './fonts/switzer-400.woff2', weight: '400' },
    { path: './fonts/switzer-500.woff2', weight: '500' },
    { path: './fonts/switzer-600.woff2', weight: '600' },
  ],
  variable: '--font-text',
  display: 'swap',
});

const title = 'fabrik — an agent company in your terminal';
const description = 'fabrik is a herdr plugin that runs Claude Code, Codex and Grok as an org chart of terminal agents and wakes each agent when it has a task.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/fabrik' },
  openGraph: { type: 'website', url: '/fabrik', siteName: 'fabrik', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

type FabrikLayoutProps = {
  children: ReactNode
};

const FabrikLayout = ({ children }: FabrikLayoutProps): ReactNode => (
  <div className={`fabrik ${switzer.variable}`}>{children}</div>
);

export default FabrikLayout;
