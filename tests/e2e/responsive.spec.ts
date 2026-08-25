import { expect, test } from '@playwright/test';

const viewports = [
  { label: '320px phone', width: 320, height: 720 },
  { label: '375px phone', width: 375, height: 812 },
  { label: '768px tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  test(`${viewport.label} keeps the page and hero inside the viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const bounds = await page.evaluate(() => {
      const title = document.querySelector<HTMLElement>('#home h1');
      const visibleWord = title?.querySelector<HTMLElement>(
        ':scope > span[aria-hidden="true"] > span > span:first-child',
      );

      if (!title || !visibleWord) throw new Error('Hero title is incomplete');

      const titleBounds = title.getBoundingClientRect();
      const wordBounds = visibleWord.getBoundingClientRect();

      return {
        documentWidth: Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth,
        ),
        titleLeft: titleBounds.left,
        titleRight: titleBounds.right,
        viewportWidth: window.innerWidth,
        wordLeft: wordBounds.left,
        wordRight: wordBounds.right,
      };
    });

    expect.soft(bounds.documentWidth).toBeLessThanOrEqual(bounds.viewportWidth);
    expect.soft(bounds.titleLeft).toBeGreaterThanOrEqual(-1);
    expect.soft(bounds.titleRight).toBeLessThanOrEqual(bounds.viewportWidth + 1);
    expect.soft(bounds.wordLeft).toBeGreaterThanOrEqual(-1);
    expect.soft(bounds.wordRight).toBeLessThanOrEqual(bounds.viewportWidth + 1);
  });
}

test('reduced motion keeps the hero stable and disables smooth scrolling', async ({ page }) => {
  await page.goto('/');

  const visibleWord = page.locator(
    '#home h1 > span[aria-hidden="true"] > span > span:first-child',
  );
  const initialWord = await visibleWord.textContent();

  await page.waitForTimeout(3_250);

  await expect(visibleWord).toHaveText(initialWord ?? '');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => (
    getComputedStyle(document.documentElement).scrollBehavior
  ))).toBe('auto');
});

test('mobile hides section navigation and keeps legal controls available', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

  const legalTrigger = page.getByRole('button', {
    name: 'Privacy Policy',
    exact: true,
  });
  const sectionNavigation = page.getByRole('navigation', {
    name: 'Section navigation',
  });

  await expect(sectionNavigation).toBeHidden();
  await expect(legalTrigger).toBeVisible();

  await legalTrigger.click();
  await expect(page.getByRole('dialog', { name: 'Privacy Policy' })).toBeVisible();
  await page.keyboard.press('Escape');
});
