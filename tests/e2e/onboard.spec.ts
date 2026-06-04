import { test, expect } from '@playwright/test';

test('Teacher Trainer Onboarding Flow Validation', async ({ page }) => {
  await page.goto('/pijam');

  // Verify the page loaded
  await expect(page.getByRole('heading', { name: 'Pi Jam Staff Onboarding' })).toBeVisible();

  // Select Teacher Trainer role
  await page.getByRole('button', { name: /Teacher Trainer/i }).click();

  // Proceed to Step 2
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // Verify step 2 fields
  await expect(page.getByLabel('Full Name *')).toBeVisible();
  
  // Try proceeding without filling to trigger validation
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Trainer name required')).toBeVisible();
});
