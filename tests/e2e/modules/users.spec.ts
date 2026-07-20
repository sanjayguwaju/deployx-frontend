import { test, expect } from '@playwright/test';

test.describe('Users Module', () => {
  // This test suite automatically uses the global authentication state
  // So it starts already logged in as the admin.

  test.beforeEach(async ({ page }) => {
    // Navigate to the users page before each test
    await page.goto('/users');
  });

  test('should display the users list', async ({ page }) => {
    // Check if the page title or header is correct
    await expect(page.locator('h1').or(page.locator('h2')).filter({ hasText: /Users/i }).first()).toBeVisible();
    
    // Check if the users table is visible
    await expect(page.locator('table')).toBeVisible();
    
    // Check for the "Add New User" button
    await expect(page.getByRole('button', { name: /Add New User/i })).toBeVisible();
  });

  test('should open add user modal when clicking add new user', async ({ page }) => {
    // Click the add new user button
    await page.getByRole('button', { name: /Add New User/i }).click();

    // Verify modal is open (FormModal usually has a title or a save button)
    await expect(page.getByRole('dialog').or(page.locator('.fixed.inset-0')).first()).toBeVisible();
    
    // Verify specific input in the form
    await expect(page.getByPlaceholder('e.g. John Doe').or(page.locator('input[name="name"]'))).toBeVisible();
  });
});
