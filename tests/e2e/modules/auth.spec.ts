import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  // We use test.use({ storageState: { cookies: [], origins: [] } }) to clear the state
  // because the global setup might have already logged us in. We want a clean slate for auth tests.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/signin');
    
    // Assert title or header
    await expect(page.locator('h1')).toHaveText('Sign In');

    // Fill out form
    await page.getByPlaceholder('info@gmail.com').fill('sanjay@demo.gov.np');
    await page.getByPlaceholder('Enter your password').fill('Test1234#');

    // Submit
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should redirect to a dashboard based on role (e.g. /administrator, /superadmindashboard, or /dashboard)
    await page.waitForURL(/\/(dashboard|administrator|superadmindashboard)/);
    
    // Should see success toast (if it stays long enough) or user menu
    await expect(page.getByText('Signed in successfully!')).toBeVisible();
  });

  test('should fail login with invalid credentials', async ({ page }) => {
    await page.goto('/signin');
    
    await page.getByPlaceholder('info@gmail.com').fill('invalid@demo.gov.np');
    await page.getByPlaceholder('Enter your password').fill('WrongPassword!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should display an error
    await expect(page.getByText('Failed to sign in.').or(page.locator('.text-red-500'))).toBeVisible();
  });
});
