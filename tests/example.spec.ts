import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/UrAi/);
});

test('login page link', async ({ page }) => {
  await page.goto('/');

  // The home page should redirect to login for unauthenticated users.
  await expect(page).toHaveURL(/.*login/);

  // Check for a key element on the login page.
  await expect(page.getByRole('heading', { name: 'Welcome to UrAi' })).toBeVisible();
});
