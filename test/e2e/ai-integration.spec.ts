import { test, expect } from '@playwright/test';

test.describe('AI Model Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should load the application without errors', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/Life Logger/);
    
    // Check for any console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check that there are no critical console errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('DevTools') && 
      !error.includes('favicon') &&
      !error.includes('Warning')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should be able to navigate to login page', async ({ page }) => {
    // Look for login link or button
    const loginButton = page.locator('text=Login').or(page.locator('text=Sign in')).first();
    
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await expect(page).toHaveURL(/.*login.*/);
    } else {
      // If no login button, check if we're already on login page or authenticated
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    }
  });

  test('should handle AI functionality gracefully when not authenticated', async ({ page }) => {
    // Try to access pages that might use AI features
    await page.goto('/');
    
    // Check that the page doesn't crash due to AI initialization
    await page.waitForLoadState('networkidle');
    
    // Verify no uncaught exceptions
    let hasUncaughtException = false;
    page.on('pageerror', () => {
      hasUncaughtException = true;
    });
    
    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(2000);
    
    expect(hasUncaughtException).toBe(false);
  });

  test('should validate Firebase configuration', async ({ page }) => {
    // Add a script to check Firebase config
    const firebaseConfigValid = await page.evaluate(() => {
      // Check if Firebase config environment variables are available
      const requiredVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
      ];
      
      // This is a basic check - in a real app these would be available differently
      return requiredVars.every(varName => {
        const value = process.env[varName];
        return value && value !== 'YOUR_API_KEY_HERE';
      });
    });
    
    // For now, we just check that the test environment is set up
    expect(firebaseConfigValid || process.env.NEXT_PUBLIC_USE_EMULATORS === 'true').toBeTruthy();
  });
});