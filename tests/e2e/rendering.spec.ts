import { expect, test } from '@playwright/test';

test.use({
  contextOptions: {
    reducedMotion: 'no-preference',
  },
});

test('decodes the versioned 3D assets and mounts the planet on demand', async ({ page }) => {
  const requestedPaths: string[] = [];
  const renderingErrors: string[] = [];

  page.on('request', (request) => {
    requestedPaths.push(new URL(request.url()).pathname);
  });
  page.on('pageerror', (error) => renderingErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    if (/gltf|meshopt|shader|webgl/i.test(message.text())) {
      renderingErrors.push(message.text());
    }
  });

  await page.goto('/');

  await expect(page.locator('#home canvas')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(
    '#home [data-scene-fallback="sculpture"][data-scene-state="ready"]',
  )).toBeAttached({ timeout: 15_000 });
  await expect.poll(() => requestedPaths).toContain(
    '/models/discobolus-mesh.19f72baea8.glb',
  );
  expect(requestedPaths).not.toContain('/models/discobolus-mesh.glb');

  await page.locator('#jord').scrollIntoViewIfNeeded();

  await expect(page.locator('#jord canvas')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(
    '#jord [data-scene-fallback="planet"][data-scene-state="ready"]',
  )).toBeAttached({ timeout: 15_000 });
  await expect.poll(() => requestedPaths).toContain(
    '/textures/earth/roughness-2048.7cc8aefdf3.jpg',
  );
  expect(requestedPaths).not.toContain('/textures/earth/roughness-2048.jpg');
  expect(renderingErrors).toEqual([]);
});
