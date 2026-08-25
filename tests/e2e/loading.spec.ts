import { expect, test } from '@playwright/test';

test.use({
  contextOptions: {
    reducedMotion: 'no-preference',
  },
});

test('does not request the below-fold Earth texture during initial load', async ({ page }) => {
  const requestedPaths: string[] = [];

  page.on('request', (request) => {
    requestedPaths.push(new URL(request.url()).pathname);
  });

  await page.goto('/');
  await expect(page.locator('#home h1')).toBeVisible();
  await page.waitForTimeout(2_000);

  const earthRequests = requestedPaths.filter((path) => (
    path.includes('/textures/earth/') || path.includes('roughness-')
  ));

  expect(earthRequests).toEqual([]);
});
