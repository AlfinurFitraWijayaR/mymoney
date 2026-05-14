/**
 * Page-level helpers — reusable across all test files.
 */
import { Page, expect } from '@playwright/test';

/**
 * Wait for Next.js page to be fully hydrated.
 * Checks that the page has loaded and no pending navigation.
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Assert current URL matches expected path.
 */
export async function expectUrl(page: Page, path: string) {
  await expect(page).toHaveURL(new RegExp(`${path}(\\?.*)?$`));
}

/**
 * Assert a toast/success message is visible.
 */
export async function expectToast(page: Page, text: string) {
  const toast = page.getByText(text).first();
  await expect(toast).toBeVisible({ timeout: 10_000 });
}

/**
 * Assert a modal with given title is visible.
 */
export async function expectModalVisible(page: Page, title: string) {
  await expect(
    page.getByRole('heading', { name: title, level: 2 }),
  ).toBeVisible();
}

/**
 * Close a modal by clicking the X button.
 */
export async function closeModal(page: Page) {
  await page.locator('.fixed.inset-0 button svg path[d="M6 18L18 6M6 6l12 12"]').first().locator('..').click();
}

/**
 * Fill a form field by label text.
 */
export async function fillField(page: Page, label: string, value: string) {
  const field = page.getByLabel(label);
  await field.clear();
  await field.fill(value);
}

/**
 * Select an option from a <select> by its label text.
 */
export async function selectOption(
  page: Page,
  selectLabel: string,
  optionLabel: string,
) {
  await page.getByLabel(selectLabel).selectOption({ label: optionLabel });
}

/**
 * Assert an error message is displayed in the form/page.
 */
export async function expectErrorMessage(page: Page, text: string) {
  await expect(page.getByText(text).first()).toBeVisible({ timeout: 5_000 });
}

/**
 * Wait for a navigation to complete after an action.
 */
export async function waitForNavigation(page: Page, action: () => Promise<void>) {
  await Promise.all([
    page.waitForLoadState('networkidle'),
    action(),
  ]);
}
