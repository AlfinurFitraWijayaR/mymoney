/**
 * E2E Tests: Login Flow
 *
 * Tests:
 *  ✓ Successful member login → redirects to /dashboard
 *  ✓ Successful admin login → redirects to /admin
 *  ✓ Invalid credentials → shows error message
 *  ✓ Empty fields → shows validation
 *  ✓ Login page renders correctly
 */
import { test, expect } from '@playwright/test';
import { loginAs, TEST_USERS } from '../fixtures/auth.fixture';
import { expectUrl, expectErrorMessage, waitForPageReady } from '../helpers/page-helpers';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render login page correctly', async ({ page }) => {
    // Title
    await expect(page).toHaveTitle(/Sign In/);

    // Heading
    await expect(page.getByText('Selamat datang')).toBeVisible();
    await expect(
      page.getByText('Login ke akun Anda untuk melanjutkan'),
    ).toBeVisible();

    // Form elements
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should login as member and redirect to /dashboard', async ({ page }) => {
    await loginAs(page, TEST_USERS.member);

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await waitForPageReady(page);
  });

  test('should login as admin and redirect to /admin', async ({ page }) => {
    await loginAs(page, TEST_USERS.admin);

    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });
    await waitForPageReady(page);
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.getByLabel('Username').fill('wrong_user');
    await page.getByLabel('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expectErrorMessage(page, 'Invalid username or password');

    // Should remain on login page
    await expectUrl(page, '/login');
  });

  test('should show loading state while submitting', async ({ page }) => {
    await page.getByLabel('Username').fill(TEST_USERS.member.username);
    await page.getByLabel('Password').fill(TEST_USERS.member.password);

    const submitBtn = page.getByRole('button', { name: 'Login' });
    await submitBtn.click();

    // Button should show loading text
    await expect(page.getByText('Tunggu Sebentar...')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    await passwordInput.fill('test123');

    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle
    await page.locator('input#password ~ button').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again
    await page.locator('input#password ~ button').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should not submit with empty fields (HTML5 validation)', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    // Page should still be on login
    await expectUrl(page, '/login');
  });
});
