import { test, expect } from '@playwright/test';

test('Login page validates input and logs in successfully with performance check', async ({ page }) => {
  const username = 'registerTest1';
  const wrongPassword = 'Test1234';
  const correctPassword = 'Test123!';

  await page.goto('/login');

  // Fill in username and wrong password
  await page.fill('input[placeholder="Enter your username"]', username);
  await page.fill('input[placeholder="Enter your password"]', wrongPassword);
  await page.click('button:has-text("Log In")');

  // Expect error toast to appear
  await expect(page.getByText('Invalid username or password')).toBeVisible();

  // Try again with correct password
  await page.fill('input[placeholder="Enter your password"]', correctPassword);

  // Start timing
  const start = performance.now();

  await page.click('button:has-text("Log In")');

  // Escape special characters in username for regex
  const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const loginMessageRegex = new RegExp(`Logged in as ${escapedUsername}`);

  // Wait for success toast
  await expect(page.getByText(loginMessageRegex)).toBeVisible();

  // End timing
  const end = performance.now();
  const duration = end - start;

  console.log(`⏱️ Login success toast appeared after ${duration.toFixed(2)} ms`);

  // Optional: assert that login completes within acceptable threshold
  expect(duration).toBeLessThan(2000); // adjust threshold as needed
});
