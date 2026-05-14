import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration for mymoney
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // ── Test directory ─────────────────────────────────────────────────────────
  testDir: './e2e',

  // ── Parallelism ────────────────────────────────────────────────────────────
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,

  // ── Retry & Timeout ────────────────────────────────────────────────────────
  retries: process.env.CI ? 2 : 1,
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // ── Reporter ───────────────────────────────────────────────────────────────
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github']]
    : [['html', { open: 'on-failure' }], ['list']],

  // ── Global settings ────────────────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    locale: 'id-ID',
    timezoneId: 'Asia/Jakarta',
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  projects: [
    // Setup project — runs global auth setup once and stores state
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },

    // Desktop Chrome
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // Mobile viewport (responsive tests)
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
      testMatch: /.*mobile.*/,
    },
  ],

  // ── Dev server ─────────────────────────────────────────────────────────────
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },

  // ── Output ─────────────────────────────────────────────────────────────────
  outputDir: 'e2e/test-results',
});
