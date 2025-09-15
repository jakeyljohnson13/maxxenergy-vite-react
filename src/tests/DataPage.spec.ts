/*import { test, expect } from '@playwright/test';

test('DataPage loads for authenticated user and displays charts', async ({ page }) => {
  const username = 'registerTest1';
  const password = 'Test123!';

  // Step 1: Log in
  await page.goto('/login');
  await page.fill('input[placeholder="Enter your username"]', username);
  await page.fill('input[placeholder="Enter your password"]', password);
  await page.click('button:has-text("Log In")');

  // Wait for login toast
  await expect(page.getByText(`Logged in as ${username}`)).toBeVisible();

  // Step 2: Navigate to DataPage
  await page.goto('/data-page');

  // Step 3: Wait for loading spinner to disappear
  await expect(page.getByText('Loading your data…')).toHaveCount(0);

  // Step 4: Verify user greeting
  await expect(page.getByText(`Welcome, ${username}.`)).toBeVisible();

  // Step 5: Verify Plant Generation Dashboard charts (already expanded)
  //await page.waitForTimeout(1000);
  await expect(page.getByRole('heading', { name: /Plant Generation Dashboard/i })).toBeVisible();
  await expect(page.getByText('Loading...')).toHaveCount(0);

  // Scroll and verify each chart title
  const chartTitles = [
    'Daily Energy (kWh)',
    'Day Profile (15-min) — 4135001 · 2020-01-06',
    'Cumulative Energy',
    'Data Completeness (intervals/day)'
  ];

  for (const title of chartTitles) {
    const chartLocator = page.getByText(title, { exact: false });
    await chartLocator.scrollIntoViewIfNeeded();
    await expect(chartLocator).toBeVisible();
  }
 
  const bodyText = await page.locator('body').innerText();
  console.log(bodyText);


  // Count charts after scrolling
  await page.waitForSelector('.apexcharts-canvas', { state: 'visible', timeout: 10000 })
  const plantChartCount = await page.locator('.apexcharts-canvas').count();
  expect(plantChartCount).toBeGreaterThan(0);


  // Step 6: Expand "Time of Use (Weekday/Weekend)" dropdown
  
  //await page.waitForSelector('button:has-text("Time of Use Rates (Weekday/Weekend)")', { state: 'attached', timeout: 10000 });
  const touDropdown = page.getByRole('button', { name: 'Time of Use (Weekday/Weekend)' });
  await touDropdown.scrollIntoViewIfNeeded();
  await touDropdown.click();


  // Step 7: Verify Time-of-Use Rates chart
  await page.getByText('Time-of-Use Rates').scrollIntoViewIfNeeded();
  await expect(page.getByText('Time-of-Use Rates')).toBeVisible();

  const touChartCount = await page.locator('.apexcharts-canvas').count();
  expect(touChartCount).toBeGreaterThan(plantChartCount); // Ensures new chart was added
});
*/
import { test, expect } from '@playwright/test';

test('DataPage loads for authenticated user and displays charts', async ({ page }) => {
  const username = 'registerTest1';
  const password = 'Test123!';

  // Step 1: Log in
  await page.goto('/login');
  await page.fill('input[placeholder="Enter your username"]', username);
  await page.fill('input[placeholder="Enter your password"]', password);
  await page.click('button:has-text("Log In")');

  // Wait for login toast
  await expect(page.getByText(`Logged in as ${username}`)).toBeVisible();

  // Step 2: Navigate to DataPage
  await page.goto('/data-page');

  // Step 3: Wait for loading spinner to disappear
  await expect(page.getByText('Loading your data…')).toHaveCount(0);

  // Step 4: Verify user greeting
  await expect(page.getByText(`Welcome, ${username}.`)).toBeVisible();

  // Step 5: Verify Plant Generation Dashboard charts (already expanded)
  await expect(page.getByRole('heading', { name: /Plant Generation Dashboard/i })).toBeVisible();

  // Chart titles and chart canvases
  const chartChecks = [
    { title: 'Daily Energy (kWh)', canvasIndex: 0 },
    { title: 'Day Profile (15-min)', canvasIndex: 1 },
    { title: 'Cumulative Energy', canvasIndex: 2 },
    { title: 'Data Completeness', canvasIndex: 3 }
  ];

  for (const { title, canvasIndex } of chartChecks) {
    const chartTitle = page.getByText(title, { exact: false });
    await chartTitle.scrollIntoViewIfNeeded();
    await expect(chartTitle).toBeVisible();

    const chartCanvas = page.locator('.apexcharts-canvas').nth(canvasIndex);
    await chartCanvas.scrollIntoViewIfNeeded();
    await expect(chartCanvas).toBeVisible();
  }

  const bodyText = await page.locator('body').innerText();
  console.log(bodyText);

  // Step 6: Expand "Time of Use (Weekday/Weekend)" dropdown
  const touDropdown = page.getByText('Time of Use Rates (Weekday/Weekend)', { exact: false });
  await touDropdown.scrollIntoViewIfNeeded();
  await expect(touDropdown).toBeVisible();
  await touDropdown.click();

  // Step 7: Verify Time-of-Use Rates chart
  const touChartTitle = page.getByText('Time-of-Use Rates', { exact: false });
  await touChartTitle.scrollIntoViewIfNeeded();
  await expect(touChartTitle).toBeVisible();

  // Step 8: Verify the Time-of-Use Rates chart itself (Recharts SVG)
  const touChartSvg = page.locator('svg.recharts-surface');
  await touChartSvg.scrollIntoViewIfNeeded();
  await expect(touChartSvg).toBeVisible();
});
