import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const partnerNames = [
  'Brain Bar',
  'Déryné',
  'Madách Színház',
  'Magyar Nemzeti Bank',
  'Spirit FM',
  'Veszprém-Balaton 2023',
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
});

test('only one partner-logo set is exposed to assistive technology', async ({ page }) => {
  for (const name of partnerNames) {
    await expect(page.getByRole('img', { name, exact: true })).toHaveCount(1);
  }
});

test('has no serious or critical WCAG violations', async ({ page }) => {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const violations = results.violations.filter(({ impact }) => (
    impact === 'serious' || impact === 'critical'
  ));
  const summary = violations.map(({ help, id, impact, nodes }) => ({
    help,
    id,
    impact,
    targets: nodes.flatMap((node) => node.target),
  }));

  expect(violations, JSON.stringify(summary, null, 2)).toEqual([]);
});
