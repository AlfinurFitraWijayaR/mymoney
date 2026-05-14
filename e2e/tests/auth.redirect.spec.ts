/**
 * E2E Tests: Auth Redirect
 */
import { test as base, expect } from '@playwright/test';
import { test } from '../fixtures/auth.fixture';

base.describe('Auth Redirect — Unauthenticated', () => {
  const protectedRoutes = ['/dashboard', '/transactions', '/admin', '/profile', '/statistics', '/targets'];

  for (const route of protectedRoutes) {
    base(`should redirect ${route} to /login`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
    });
  }

  base('should redirect / to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});

test.describe('Auth Redirect — Member', () => {
  test('should redirect / to /dashboard', async ({ memberPage: page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test('should redirect /login to /dashboard', async ({ memberPage: page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });
});

test.describe('Auth Redirect — Admin', () => {
  test('should redirect / to /admin', async ({ adminPage: page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/admin/, { timeout: 10_000 });
  });

  test('should redirect /login to /admin', async ({ adminPage: page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/admin/, { timeout: 10_000 });
  });
});
