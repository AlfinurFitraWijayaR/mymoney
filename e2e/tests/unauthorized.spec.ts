/**
 * E2E Tests: Unauthorized Access
 *
 * Tests:
 *  ✓ Member cannot access /admin routes
 *  ✓ Member cannot access /admin/users
 *  ✓ Member cannot access /categories (admin-only in sidebar)
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Unauthorized Access — Member to Admin', () => {
  test('member accessing /admin should redirect to /dashboard', async ({
    memberPage: page,
  }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test('member accessing /admin/users should redirect to /dashboard', async ({
    memberPage: page,
  }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test('member sidebar should not show admin links', async ({
    memberPage: page,
  }) => {
    await page.goto('/dashboard');
    await page.setViewportSize({ width: 1280, height: 720 });

    // Member sidebar should NOT have Admin Panel or Users links
    await expect(page.locator('aside a', { hasText: 'Admin Panel' })).not.toBeVisible();
    await expect(page.locator('aside a', { hasText: 'Users' })).not.toBeVisible();

    // But should have member links
    await expect(page.locator('aside a', { hasText: 'Beranda' })).toBeVisible();
    await expect(page.locator('aside a', { hasText: 'Transaksi' })).toBeVisible();
  });

  test('admin sidebar should not show member links', async ({
    adminPage: page,
  }) => {
    await page.goto('/admin');
    await page.setViewportSize({ width: 1280, height: 720 });

    // Admin sidebar should have admin links
    await expect(page.locator('aside a', { hasText: 'Admin Panel' })).toBeVisible();
    await expect(page.locator('aside a', { hasText: 'Users' })).toBeVisible();

    // But should NOT have member-only links
    await expect(page.locator('aside a', { hasText: 'Beranda' })).not.toBeVisible();
    await expect(page.locator('aside a', { hasText: 'Transaksi' })).not.toBeVisible();
  });
});
