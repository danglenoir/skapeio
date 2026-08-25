import { expect, test } from '@playwright/test';

test('publishes complete metadata and metadata routes', async ({ page, request }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('skape.io | Secure digital infrastructure');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /secure, scalable web development/i,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /^https:\/\/skape\.io\/?$/,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'skape.io | Secure digital infrastructure',
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('Sitemap: https://skape.io/sitemap.xml');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('<loc>https://skape.io</loc>');

  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBeTruthy();
  expect(await manifest.json()).toMatchObject({
    name: 'skape.io',
    start_url: '/',
  });

  const iconHref = await page.locator('link[rel~="icon"]').first().getAttribute('href');
  expect(iconHref).toBeTruthy();
  const icon = await request.get(new URL(iconHref!, 'http://local.test').pathname);
  expect(icon.ok()).toBeTruthy();

  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const imageUrl = await page.locator(selector).getAttribute('content');
    expect(imageUrl).toBeTruthy();

    const parsedImageUrl = new URL(imageUrl!);
    const image = await request.get(`${parsedImageUrl.pathname}${parsedImageUrl.search}`);
    expect(image.ok()).toBeTruthy();
    expect(image.headers()['content-type']).toContain('image/');
  }
});

test('serves the baseline security headers', async ({ request }) => {
  const response = await request.get('/');
  const headers = response.headers();

  expect(response.ok()).toBeTruthy();
  expect(headers['x-powered-by']).toBeUndefined();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['content-security-policy-report-only']).toContain("default-src 'self'");
  expect(headers['content-security-policy-report-only']).toContain("frame-ancestors 'none'");
  expect(headers['content-security-policy-report-only']).toContain("'wasm-unsafe-eval'");
});
