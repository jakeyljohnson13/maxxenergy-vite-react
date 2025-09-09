//src/tests/register.spec.ts
import { test, expect } from '@playwright/test';

test('Register page shows password checklist and validates input', async ({ page }) => {
  await page.goto('/api/auth/register');
  console.log('Navigating to:', await page.url());

  // Fill in form fields
  await page.fill('input[name="username"]', 'jakeylTest');
  await page.fill('input[name="email"]', 'jakeyl@example.com');
  await page.fill('input[name="password"]', 'Test123!');
  await page.fill('input[name="confirm"]', 'Test123!');
  await page.check('input[name="agree"]');

  
  await expect(page.locator('text=✅ At least 8 characters')).toBeVisible();
  await expect(page.locator('text=✅ Contains uppercase letter')).toBeVisible();
  await expect(page.locator('text=✅ Contains lowercase letter')).toBeVisible();
  await expect(page.locator('text=✅ Contains number')).toBeVisible();
  await expect(page.locator('text=✅ Passwords match')).toBeVisible();


  // Check password checklist updates
  const checklistItems = await page.locator('text=✅').allTextContents();
  expect(checklistItems.length).toBeGreaterThanOrEqual(4); // Should meet most requirements

  // Submit form
  await page.click('button[type="submit"]');

  // Expect success toast
  await expect(page.locator('text=Account created')).toBeVisible();
});