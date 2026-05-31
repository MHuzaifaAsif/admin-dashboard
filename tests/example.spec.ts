import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const EMAIL = 'testadmin@example.com';
const PASSWORD = 'TestAdmin123!';
const ORG_NAME = `Test Org ${Date.now()}`;
const INVITE_EMAIL = `member${Date.now()}@example.com`;

test('sign-in → create org → invite member', async ({ page }) => {

  // Sign In
  await page.goto(`${BASE_URL}/signin`);
  await expect(page.getByText('Welcome Back')).toBeVisible();
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');

  // Should land on dashboard
  await expect(page).toHaveURL(`${BASE_URL}/`);
  await expect(page.getByText('My Organizations')).toBeVisible();

  //Open Create Organization dialog
  await page.locator('button', { hasText: 'Create Organization' }).first().click();
  await expect(page.getByText('New Organization')).toBeVisible();

  // Fill in the form
  await page.fill('input[placeholder="Enter organization name"]', ORG_NAME);

  // Click School button inside the dialog (the one with the emoji grid)
  await page.locator('div').filter({ hasText: /^New Organization$/ })
    .locator('..').locator('button', { hasText: 'School' }).click();

  await page.fill('input[placeholder="Enter school district"]', 'Test District');

  // Submit form
  await page.locator('form button[type="submit"]').click();

  // Org should appear in list
  await expect(page.getByText(ORG_NAME)).toBeVisible({ timeout: 10000 });

  // Click into org
  await page.getByText(ORG_NAME).click();
  await expect(page.getByText('Invite Member')).toBeVisible();

  // Invite a member
  await page.fill('input[type="email"]', INVITE_EMAIL);
  await page.locator('button', { hasText: 'Invite' }).click();

  // Member should appear with invited status
  await expect(page.getByText(INVITE_EMAIL)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('invited')).toBeVisible();
});