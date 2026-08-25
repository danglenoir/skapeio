import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
  },
  sitemap: 'https://skape.io/sitemap.xml',
  host: 'https://skape.io',
});

export default robots;
