
import { test, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

//test.use({ storageState: authFile });

test('abrir boards y verificar título', async ({ page }) => {
  await page.goto('https://trello.com/u/lomardiego17/boards');


  // También puedes validar que el botón de crear tablero esté visible
  await expect(page.locator('[data-testid="header-create-menu-button"]')).toBeVisible();
});


test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
