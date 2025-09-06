import { test, expect } from '@playwright/test';

test('redirects unauthenticated users from notifications', async ({ page }) => {
  await page.goto('/notifications');
  await expect(page).toHaveURL(/login/);
});
