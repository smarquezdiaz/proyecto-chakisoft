const { test: base, expect } = require('@playwright/test'); // agregado expect

export const test = base.extend({
  createBoardPage: async ({ page }, use) => {
     // Usamos el estado de login
    await page.goto('https://trello.com/u/lomardiego17/boards'); 

    // Crear tablero
    await expect(page.getByTestId('header-create-menu-button')).toBeVisible(); // agregado
    await page.getByTestId('header-create-menu-button').click();

    await expect(page.getByTestId('header-create-board-button')).toBeVisible(); // agregado
    await page.getByTestId('header-create-board-button').click();

    // esperar a que el input esté visible antes de escribir
    await expect(page.getByTestId('create-board-title-input')).toBeVisible(); // agregado
    await page.fill('[data-testid="create-board-title-input"]', 'pruebadesdeui');
    
    // esperar a que el botón esté habilitado
    await expect(page.getByTestId('create-board-submit-button')).toBeEnabled(); // agregado
    await page.getByTestId('create-board-submit-button').click();

    // 👉 Pasamos la URL al test
    await use(page);

    // --- TEARDOWN: borrar el tablero ---
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');

    // agregado: esperar a que el menú esté visible antes de abrirlo
    await expect(page.locator('[aria-label="Mostrar menú"]')).toBeVisible(); // agregado
    await page.locator('[aria-label="Mostrar menú"]').click();

    await page.locator('span[aria-label="Cerrar tablero"]').click();
    await page.getByTestId('popover-close-board-confirm').click();

    // agregado: esperar a que el menú vuelva a estar visible
    await expect(page.locator('[aria-label="Mostrar menú"]')).toBeVisible(); // agregado
    await page.locator('[aria-label="Mostrar menú"]').click();

    await page.getByTestId('close-board-delete-board-button').click();
    await page.getByTestId('close-board-delete-board-confirm-button').click();
  },
});