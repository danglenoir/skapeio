import { expect, test } from '@playwright/test';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'references', label: 'References' },
  { id: 'jord', label: 'JORD' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
});

test('JORD keeps its CTA visible while the website is pending', async ({ page }) => {
  const jord = page.locator('#jord');
  const cta = jord.getByRole('button', {
    name: 'Explore JORD. JORD website coming soon.',
  });

  await expect(jord.getByRole('heading', { name: 'JORD' })).toBeVisible();
  await expect(jord).toContainText('The ultimate cloud-based CMS.');
  await expect(jord.getByRole('link')).toHaveCount(0);
  await expect(cta).toBeVisible();
  await expect(cta).toBeDisabled();
  await expect(cta).toHaveAttribute('title', 'JORD website coming soon.');
  await expect(page.getByText('Explore JORD', { exact: true })).toBeVisible();
});

test('section navigation targets every rendered section', async ({ page }) => {
  const navigation = page.getByRole('navigation', { name: 'Section navigation' });

  for (const { id, label } of sections) {
    const link = navigation.getByRole('link', { name: label, exact: true });

    await expect(link).toHaveAttribute('href', `#${id}`);
    await expect(page.locator(`#${id}`)).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test('contact link opens the visitor email client', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'hello@skape.io' }))
    .toHaveAttribute('href', 'mailto:hello@skape.io');
});

test('native dialogs are named, dismiss with Escape, and return focus', async ({ page }) => {
  const dialogs = [
    { id: 'privacy-policy', name: 'Privacy Policy' },
    { id: 'imprint', name: 'Imprint' },
  ] as const;

  for (const { id, name } of dialogs) {
    const trigger = page.getByRole('button', { name, exact: true });
    const dialog = page.getByRole('dialog', { name, exact: true });

    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect.poll(() => page.evaluate(() => (
      document.activeElement?.closest('dialog')?.id
    ))).toBe(id);

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});
