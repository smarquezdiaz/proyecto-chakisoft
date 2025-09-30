const { test : base} = require('@playwright/test');

export const test = base.extend({
  boardUrl: async ({ page }, use) => {
    // Usamos el estado de login
    await page.goto('https://trello.com/u/lomardiego17/boards'),{delay:2000};

    // Crear tablero
    await page.getByTestId('header-create-menu-button').click();
    await page.getByTestId('header-create-board-button').click();

    //const boardName = `Tablero QA ${Date.now()}`;
    await page.fill('[data-testid="create-board-title-input"]', 'pruebadesdeui');
    await page.getByTestId('create-board-submit-button').click();

    // 👉 Pasamos la URL al test
    await use(page);

    // --- TEARDOWN: borrar el tablero ---
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.locator('[aria-label="Mostrar menú"]').click();
    await page.locator('span[aria-label="Cerrar tablero"]').click();
    await page.getByTestId('popover-close-board-confirm').click();
    await page.locator('[aria-label="Mostrar menú"]').click();
    await page.getByTestId('close-board-delete-board-button').click();
    await page.getByTestId('close-board-delete-board-confirm-button').click();
  },
});