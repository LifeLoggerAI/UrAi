import { test, expect } from '@playwright/test';

// Placeholder test to ensure the test suite is not empty.
// This prevents the CI/CD pipeline from failing.
test('homepage has expected title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/UrAi - Your Personal AI for Life Logging & Self-Reflection/);
});
