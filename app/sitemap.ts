import type { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => [{
  url: 'https://skape.io',
  changeFrequency: 'monthly',
  priority: 1,
}];

export default sitemap;
