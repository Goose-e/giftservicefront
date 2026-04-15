import { test, expect } from '@playwright/test';

import { selectors } from './WaterPage';

test('water calculator page renders basic controls', async ({ page }) => {
  await page.goto('/water');

  await expect(page.locator(selectors.input)).toBeVisible();
  await expect(page.locator(selectors.result)).toBeVisible();
});
