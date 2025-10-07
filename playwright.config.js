// @ts-check
import { defineConfig, devices } from '@playwright/test';
require('dotenv').config();


export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ["line"], ["allure-playwright"]],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  
  timeout: 30000, // 30 segundos por test
  expect: {
    timeout: 15000 // 15 segundos para assertions
  },
  
  /* Configure projects for major browsers */
  projects: [
     // Setup project
      // { name: 'setup', testMatch: /.*\.setup\.js/ },
    // ========================================
    // TESTS API - Ejecución en PARALELO
    // ========================================
    {
      name: 'api-tests',
      testMatch: /.*\/API\/.*\.spec\.js$/,
      use: {
        ...devices['Desktop Chrome'],
      },
      fullyParallel: true, // Ejecuta tests API en paralelo
      workers: process.env.CI ? 4 : 6, // Más workers para tests API
       // dependencies: ['setup'],
    },
    
    // ========================================
    // TESTS UI - Ejecución en SERIE (headed)
    // ========================================
    {
      name: 'ui-tests-chromium',
      testMatch: /.*\/UI\/.*\.spec\.js$/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
        headless: false, // Modo headed para tests UI
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          slowMo: 100, // Ralentiza las acciones para mejor visualización
        },
      },
      fullyParallel: false, // Ejecuta tests UI en serie
      workers: 1, // Solo 1 worker para ejecución serial
      //  dependencies: ['setup'],
    },

    // {
    //   name: 'chromium',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     // Use prepared auth state.
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   // dependencies: ['setup'],
    // },
    
    // ========================================
    // TESTS UI - Firefox (opcional)
    // ========================================
    /* {
      name: 'ui-tests-firefox',
      testMatch: /.*\/UI\/.*\.spec\.js$/,
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
        headless: false,
        viewport: { width: 1920, height: 1080 },
      },
      fullyParallel: false,
      workers: 1,
    }, */
  ],
});
