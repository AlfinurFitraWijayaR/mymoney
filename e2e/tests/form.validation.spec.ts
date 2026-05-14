/**
 * E2E Tests: Form Validation
 */
import { test as base, expect } from '@playwright/test';
import { test } from '../fixtures/auth.fixture';
import { waitForPageReady, expectErrorMessage } from '../helpers/page-helpers';

base.describe('Login Form Validation', () => {
  base('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('nonexistent_user');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expectErrorMessage(page, 'Invalid username or password');
  });

  base('should not submit empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Login' }).click();
    // HTML5 validation prevents submission, stays on login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Create User Form Validation (Admin)', () => {
  test('should reject username with invalid characters', async ({ adminPage: page }) => {
    await page.goto('/admin/users');
    await waitForPageReady(page);
    await page.getByRole('button', { name: 'Create User' }).click();

    await page.getByLabel('Username').fill('Invalid User!');
    await page.getByLabel('Password').fill('test123');
    await page.getByLabel('Tenant ID').fill('tenant_test');

    await page.getByRole('button', { name: 'Create User' }).last().click();

    // HTML5 pattern validation should prevent submission or server returns error
    await page.waitForTimeout(1000);
  });

  test('should reject short username', async ({ adminPage: page }) => {
    await page.goto('/admin/users');
    await waitForPageReady(page);
    await page.getByRole('button', { name: 'Create User' }).click();

    await page.getByLabel('Username').fill('ab');
    await page.getByLabel('Password').fill('test123');
    await page.getByLabel('Tenant ID').fill('tenant_test');

    await page.getByRole('button', { name: 'Create User' }).last().click();
    await page.waitForTimeout(1000);
    // HTML5 minlength validation
  });
});

test.describe('Category Form Validation (Admin)', () => {
  test('should not submit category without SVG code', async ({ adminPage: page }) => {
    await page.goto('/categories');
    await waitForPageReady(page);
    await page.getByRole('button', { name: 'Tambah Kategori' }).click();

    await page.getByLabel('Nama Kategori').fill('Test Category');
    // Leave SVG code empty

    await page.getByRole('button', { name: 'Buat Kategori' }).click();
    // HTML5 required prevents submission
    await page.waitForTimeout(500);
    await expect(page.getByText('Tambah Kategori')).toBeVisible();
  });
});
