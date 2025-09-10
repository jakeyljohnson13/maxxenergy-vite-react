//src/tests/register.spec.ts
import { test, expect } from '@playwright/test';

test('Register page shows password checklist and validates input', async ({ page }) => {
  await page.goto('/register');
  console.log('Navigating to:', await page.url());

  // Fill in form fields
  await page.fill('input[name="username"]', 'registerTest1');
  await page.fill('input[name="email"]', 'register1@example.com');
  await page.fill('input[name="password"]', 'Test123!');
  await page.fill('input[name="confirm"]', 'Test123!');
  await page.click('text=I agree to the Terms and Privacy Policy');
  await page.fill('input[name="password"]', 'Test123!');
  await page.fill('input[name="confirm"]', 'WrongPass');

  await expect(page.locator('text=✅ At least 8 characters')).toBeVisible();
  await expect(page.locator('text=✅ One uppercase letter')).toBeVisible();
  await expect(page.locator('text=✅ One lowercase letter')).toBeVisible();
  await expect(page.locator('text=✅ One number')).toBeVisible();
  await expect(page.locator('text=Passwords do not match.')).toBeVisible();

  await page.fill('input[name="confirm"]', 'Test123!');

  await expect(page.locator('text=Passwords do not match.')).toHaveCount(0);


  // Check password checklist updates
  const checklistItems = await page.locator('text=✅').allTextContents();
  expect(checklistItems.length).toBeGreaterThanOrEqual(4); // Should meet most requirements

  // Submit form
  await page.click('button[type="submit"]');

  // Expect success toast
  await expect(page.locator('text=Account created')).toBeVisible();
});