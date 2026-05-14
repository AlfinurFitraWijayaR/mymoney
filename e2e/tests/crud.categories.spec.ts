/**
 * E2E Tests: Category CRUD (Admin-only)
 *
 * Tests:
 *  ✓ Admin can view categories
 *  ✓ Admin can create a new category
 *  ✓ Admin can edit a category
 *  ✓ Admin can delete a category
 */
import { test, expect } from '../fixtures/auth.fixture';
import { createTestCategory } from '../helpers/test-data';
import { expectModalVisible, waitForPageReady } from '../helpers/page-helpers';

test.describe('Category CRUD (Admin)', () => {
  test('should display categories list', async ({ adminPage: page }) => {
    await page.goto('/categories');
    await waitForPageReady(page);

    // Should see table headers
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Type' })).toBeVisible();

    // Should have the "Tambah Kategori" button
    await expect(
      page.getByRole('button', { name: 'Tambah Kategori' }),
    ).toBeVisible();
  });

  test('should create a new category', async ({ adminPage: page }) => {
    const testCat = createTestCategory();

    await page.goto('/categories');
    await waitForPageReady(page);

    // Open create modal
    await page.getByRole('button', { name: 'Tambah Kategori' }).click();
    await expectModalVisible(page, 'Tambah Kategori');

    // Fill form
    await page.getByLabel('Nama Kategori').fill(testCat.name);
    await page.getByLabel('Jenis Transaksi').selectOption('EXPENSE');
    await page.getByLabel('Kode Ikon SVG').fill(testCat.svgCode);

    // Submit
    await page.getByRole('button', { name: 'Buat Kategori' }).click();

    // Category should appear in list
    await expect(page.getByText(testCat.name)).toBeVisible({ timeout: 10_000 });
  });

  test('should edit a category', async ({ adminPage: page }) => {
    // First create one
    const testCat = createTestCategory();

    await page.goto('/categories');
    await waitForPageReady(page);

    await page.getByRole('button', { name: 'Tambah Kategori' }).click();
    await page.getByLabel('Nama Kategori').fill(testCat.name);
    await page.getByLabel('Jenis Transaksi').selectOption('EXPENSE');
    await page.getByLabel('Kode Ikon SVG').fill(testCat.svgCode);
    await page.getByRole('button', { name: 'Buat Kategori' }).click();
    await expect(page.getByText(testCat.name)).toBeVisible({ timeout: 10_000 });

    // Now edit it
    const row = page.locator('tr', { hasText: testCat.name });
    await row.getByTitle('Edit').click();

    await expectModalVisible(page, 'Edit Kategori');

    const updatedName = `${testCat.name}_updated`;
    await page.getByLabel('Nama Kategori').clear();
    await page.getByLabel('Nama Kategori').fill(updatedName);

    await page.getByRole('button', { name: 'Simpan Perubahan' }).click();

    // Updated name should appear
    await expect(page.getByText(updatedName)).toBeVisible({ timeout: 10_000 });
  });

  test('should delete a category', async ({ adminPage: page }) => {
    // First create one
    const testCat = createTestCategory();

    await page.goto('/categories');
    await waitForPageReady(page);

    await page.getByRole('button', { name: 'Tambah Kategori' }).click();
    await page.getByLabel('Nama Kategori').fill(testCat.name);
    await page.getByLabel('Jenis Transaksi').selectOption('EXPENSE');
    await page.getByLabel('Kode Ikon SVG').fill(testCat.svgCode);
    await page.getByRole('button', { name: 'Buat Kategori' }).click();
    await expect(page.getByText(testCat.name)).toBeVisible({ timeout: 10_000 });

    // Delete it
    const row = page.locator('tr', { hasText: testCat.name });
    await row.getByTitle('Delete').click();

    await expectModalVisible(page, 'Hapus Kategori');
    await page.getByRole('button', { name: 'Hapus' }).click();

    // Category should disappear
    await expect(page.getByText(testCat.name)).not.toBeVisible({
      timeout: 10_000,
    });
  });
});
