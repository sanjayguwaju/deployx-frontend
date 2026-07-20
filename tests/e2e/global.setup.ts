import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to the app's sign-in page
  await page.goto('/signin');

  // Fill in the login credentials
  // Ensure these match a real user in your local backend testing database.
  await page.getByPlaceholder('info@gmail.com').fill('sanjay@demo.gov.np');
  await page.getByPlaceholder('Enter your password').fill('Test1234#');

  // Click the sign-in button
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait until the page actually signs in (you could wait for a specific URL like /dashboard, or an element on the dashboard)
  await page.waitForURL('**/dashboard*');

  // Alternatively, just ensure the dashboard heading or sidebar is visible
  // await expect(page.locator('text=Dashboard')).toBeVisible();

  // Save the state of the page (cookies, localStorage) to the authFile
  await page.context().storageState({ path: authFile });
});
