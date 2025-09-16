//src/tests/register.spec.ts
import { test, expect } from '@playwright/test';

test('Register page shows password checklist, validates input, and measures performance', async ({ page }) => {
  await page.goto('/register');
  console.log('Navigating to:', await page.url());

  // Fill in form fields
  await page.fill('input[name="username"]', 'registerTest2');
  await page.fill('input[name="email"]', 'register2@example.com');
  await page.fill('input[name="password"]', 'Test123!');
  await page.fill('input[name="confirm"]', 'Test123!');
  await page.click('text=I agree to the Terms and Privacy Policy');

  // Check password checklist
  await expect(page.locator('text=✅ At least 8 characters')).toBeVisible();
  await expect(page.locator('text=✅ One uppercase letter')).toBeVisible();
  await expect(page.locator('text=✅ One lowercase letter')).toBeVisible();
  await expect(page.locator('text=✅ One number')).toBeVisible();

  // Submit form and start timing
  const start = performance.now();
  await page.click('button[type="submit"]');

  // Wait for success toast
  await expect(page.locator('text=Account created')).toBeVisible();
  const end = performance.now();
  const duration = end - start;

  console.log(`⏱️ Registration success toast appeared after ${duration.toFixed(2)} ms`);

  // Optional: assert that registration completes within acceptable threshold
  expect(duration).toBeLessThan(3000); // adjust threshold as needed
});
