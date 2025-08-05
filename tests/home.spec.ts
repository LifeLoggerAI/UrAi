import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:9002');
  await expect(page).toHaveTitle(/Next/);
});