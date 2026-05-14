/**
 * Global setup — runs once before all test projects.
 * Creates authenticated browser states for member & admin,
 * saving them to .auth/ so every test can reuse them.
 */
import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { loginAs, TEST_USERS } from './fixtures/auth.fixture';

const MEMBER_STATE = path.resolve(__dirname, '.auth/member.json');
const ADMIN_STATE = path.resolve(__dirname, '.auth/admin.json');

setup('authenticate as member', async ({ page }) => {
  await loginAs(page, TEST_USERS.member);

  // Wait for redirect to /dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

  // Save authenticated state
  await page.context().storageState({ path: MEMBER_STATE });
});

setup('authenticate as admin', async ({ page }) => {
  await loginAs(page, TEST_USERS.admin);

  // Wait for redirect to /admin
  await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });

  // Save authenticated state
  await page.context().storageState({ path: ADMIN_STATE });
});
