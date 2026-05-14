/**
 * E2E Tests: Logout Flow
 *
 * Tests:
 *  ✓ Member can logout from sidebar
 *  ✓ Member can logout from profile page
 *  ✓ After logout, user is redirected to /login
 *  ✓ After logout, accessing protected routes redirects to /login
 */
import { test, expect } from '../fixtures/auth.fixture';
import { expectUrl, waitForPageReady } from '../helpers/page-helpers';

test.describe('Logout', () => {
  test('should logout from sidebar and redirect to login', async ({
    memberPage: page,
  }) => {
    await page.goto('/dashboard');
    await waitForPageReady(page);

    // Click sidebar logout (desktop view)
    await page.setViewportSize({ width: 1280, height: 720 });
    const logoutButton = page.locator('aside form button', {
      hasText: 'Log Out',
    });
    await logoutButton.click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('should logout from profile page and redirect to login', async ({
    memberPage: page,
  }) => {
    await page.goto('/profile');
    await waitForPageReady(page);

    // Click "Keluar" button on profile page
    const logoutBtn = page.locator('form button', { hasText: 'Keluar' });
    await logoutBtn.click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('should not access protected routes after logout', async ({
    memberPage: page,
  }) => {
    await page.goto('/dashboard');
    await waitForPageReady(page);

    // Logout
    await page.setViewportSize({ width: 1280, height: 720 });
    const logoutButton = page.locator('aside form button', {
      hasText: 'Log Out',
    });
    await logoutButton.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });

    // Try to access protected route
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
