// playwright.config.ts
// Description: Playwright E2E test configuration — chromium, webServer, temp database

import { defineConfig } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  globalSetup: './tests/e2e/globalSetup.ts',
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:5000',
    trace: 'on-first-retry',
    headless: false,
    launchOptions: { slowMo: 1000 },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'uv run python -m app',
    url: 'http://127.0.0.1:5000',
    reuseExistingServer: !process.env.CI,
    cwd: path.resolve(__dirname, '..'),
    env: {
      DB_PATH: path.resolve(__dirname, '..', 'data', 'e2e_test.db'),
    },
  },
});
