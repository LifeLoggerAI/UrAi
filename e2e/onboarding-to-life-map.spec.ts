import { test, expect } from '@playwright/test';

test.describe('Onboarding journey', () => {
  test('guides dreamers into the life map ritual', async ({ page }) => {
    await page.goto('/onboarding');

    await expect(page.getByRole('heading', { name: 'URAI' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();

    await page.getByRole('button', { name: 'Get Started' }).click();
    await expect(page).toHaveURL(/\/home$/);

    await expect(page.getByRole('button', { name: 'Tap the sky' })).toBeVisible();
    await expect(page.getByText('Mirror')).toBeVisible();
    await expect(page.getByText('Narrator')).toBeVisible();
    await expect(page.getByText('Rituals')).toBeVisible();

    await page.getByRole('button', { name: 'Tap the sky' }).click();

    await expect(page).toHaveURL(/\/life-map$/);
    await expect(page.getByRole('heading', { name: 'Life Map' })).toBeVisible();
  });
});
