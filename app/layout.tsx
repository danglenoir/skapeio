import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';

const siteUrl = new URL('https://skape.io');
const title = 'skape.io | Secure digital infrastructure';
const description = 'Secure, scalable web development, cloud infrastructure, DevOps, networking, privacy and AI solutions for critical operations.';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: title,
    template: '%s | skape.io',
  },
  description,
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'skape.io',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'skape.io Kft.',
  url: siteUrl.toString(),
  email: 'hello@skape.io',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Erkel u. 13/A',
    postalCode: '1092',
    addressLocality: 'Budapest',
    addressCountry: 'HU',
  },
};

type RootLayoutProps = {
  children: ReactNode
};

const fontVariables = `${jetbrainsMono.variable} ${geist.variable}`;

const RootLayout = ({ 
  children 
}: RootLayoutProps): ReactNode => (
  <html lang="en" className={fontVariables}>
    <body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replaceAll('<', '\\u003c'),
        }}
      />
      {children}
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);

export default RootLayout;
