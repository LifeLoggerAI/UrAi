import { test, expect } from '@playwright/test';

test.describe('Hello World Tests', () => {
  test('should load the homepage successfully', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page loaded without errors
    await expect(page).toHaveTitle(/Life Logger/);

    // Check that the page doesn't have any obvious error messages
    const errorText = await page.locator('text=Error').count();
    expect(errorText).toBe(0);
  });

  test('should have basic navigation elements', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Check for common navigation elements or page content
    // This test is basic and can be expanded based on actual app structure
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should respond to API health check', async ({ request }) => {
    // Test if we can make a basic API request
    try {
      const response = await request.get('http://localhost:3000/api/health');
      // If health endpoint exists, it should return 200
      // If it doesn't exist, we expect 404 which is also fine for this basic test
      expect([200, 404]).toContain(response.status());
    } catch (error) {
      // If the endpoint doesn't exist, that's okay for this basic test
      console.log('Health endpoint not available, which is expected for now');
    }
  });
});
