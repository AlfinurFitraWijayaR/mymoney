/**
 * E2E Tests: User Registration (Admin creates users)
 *
 * Tests:
 *  ✓ Admin can create a new member user
 *  ✓ Admin can see newly created user in the table
 *  ✓ Duplicate username shows error
 *  ✓ Admin can delete a user
 *  ✓ Admin can reset user password
 */
import { test, expect } from '../fixtures/auth.fixture';
import { createTestUser } from '../helpers/test-data';
import { expectModalVisible, waitForPageReady } from '../helpers/page-helpers';

test.describe('User Registration (Admin)', () => {
  test('should create a new user successfully', async ({
    adminPage: page,
  }) => {
    const testUser = createTestUser();

    await page.goto('/admin/users');
    await waitForPageReady(page);

    // Click "Create User" button
    await page.getByRole('button', { name: 'Create User' }).click();
    await expectModalVisible(page, 'Create New User');

    // Fill the form
    await page.getByLabel('Username').fill(testUser.username);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByLabel('Tenant ID').fill(testUser.tenantId);
    await page.getByLabel('Role').selectOption('MEMBER');

    // Submit
    await page.getByRole('button', { name: 'Create User' }).last().click();

    // Should show success toast
    await expect(page.getByText('User created successfully')).toBeVisible({
      timeout: 10_000,
    });

    // Should see the new user in the table
    await expect(page.getByText(testUser.username)).toBeVisible();
  });

  test('should show error for duplicate username', async ({
    adminPage: page,
  }) => {
    await page.goto('/admin/users');
    await waitForPageReady(page);

    // Try creating with existing username
    await page.getByRole('button', { name: 'Create User' }).click();
    await expectModalVisible(page, 'Create New User');

    await page.getByLabel('Username').fill('demo_member');
    await page.getByLabel('Password').fill('Test1234!');
    await page.getByLabel('Tenant ID').fill('tenant_duplicate');
    await page.getByLabel('Role').selectOption('MEMBER');

    await page.getByRole('button', { name: 'Create User' }).last().click();

    // Should show error message (username already exists)
    const errorLocator = page.locator('.bg-red-50, .error-text');
    await expect(errorLocator.first()).toBeVisible({ timeout: 10_000 });
  });

  test('should delete a user', async ({ adminPage: page }) => {
    // First, create a user to delete
    const testUser = createTestUser();

    await page.goto('/admin/users');
    await waitForPageReady(page);

    await page.getByRole('button', { name: 'Create User' }).click();
    await page.getByLabel('Username').fill(testUser.username);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByLabel('Tenant ID').fill(testUser.tenantId);
    await page.getByRole('button', { name: 'Create User' }).last().click();
    await expect(page.getByText('User created successfully')).toBeVisible({
      timeout: 10_000,
    });

    // Wait for table to update
    await expect(page.getByText(testUser.username)).toBeVisible();

    // Click delete button for the user
    const row = page.locator('tr', { hasText: testUser.username });
    await row.getByTitle('Delete User').click();

    // Confirm deletion
    await expectModalVisible(page, 'Delete User');
    await page.getByRole('button', { name: 'Delete User' }).click();

    // User should be removed
    await expect(page.getByText(testUser.username)).not.toBeVisible({
      timeout: 10_000,
    });
  });

  test('should reset a user password', async ({ adminPage: page }) => {
    await page.goto('/admin/users');
    await waitForPageReady(page);

    // Find demo_member in the table
    const row = page.locator('tr', { hasText: 'demo_member' });
    await row.getByTitle('Reset Password').click();

    await expectModalVisible(page, 'Reset Password');
    await expect(page.getByText('demo_member')).toBeVisible();

    // Fill new password
    await page.getByLabel('New Password').fill('member123');
    await page.getByRole('button', { name: 'Reset Password' }).click();

    // Should show success toast
    await expect(page.getByText('Password reset successfully')).toBeVisible({
      timeout: 10_000,
    });
  });
});
