const { test: base, expect } = require('@playwright/test');

export const test = base.extend({
  createBoardPage: async ({ page }, use) => {

    await page.goto('https://trello.com/u/lomardiego17/boards');

    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    await expect(page.getByTestId('header-create-menu-button')).toBeVisible();
    await page.getByTestId('header-create-menu-button').click();

    await expect(page.getByTestId('header-create-board-button')).toBeVisible();
    await page.getByTestId('header-create-board-button').click();

    await expect(page.getByTestId('create-board-title-input')).toBeVisible();
    await page.fill('[data-testid="create-board-title-input"]', 'pruebadesdeui');

    await expect(page.getByTestId('create-board-submit-button')).toBeEnabled();
    await page.getByTestId('create-board-submit-button').click();

    await use(page);

    // --- TEARDOWN: borrar el tablero ---
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);

    await expect(page.locator('[aria-label="Mostrar menú"]')).toBeVisible();
    await page.locator('[aria-label="Mostrar menú"]').click();

    await page.waitForTimeout(2000);

    await page.locator('span[aria-label="Cerrar tablero"]').click();
    await page.getByTestId('popover-close-board-confirm').click();

    await page.waitForTimeout(2000);

    await expect(page.locator('[aria-label="Mostrar menú"]')).toBeVisible();
    await page.locator('[aria-label="Mostrar menú"]').click();

    await page.waitForTimeout(2000);
    
    await page.getByTestId('close-board-delete-board-button').click();
    await page.getByTestId('close-board-delete-board-confirm-button').click();
  },
});