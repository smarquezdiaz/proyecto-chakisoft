import { test as base, expect } from '@playwright/test';
import { test as boardTest } from './boardFixture'; // tu fixture de board

export const test = boardTest.extend<{cardUrl: string}>({
  cardUrl: async ({ page, boardUrl }, use) => {
    // Ir al board recién creado
    await page.goto(boardUrl);

    // Crear lista
    await page.getByTestId('list-composer-button').click();
    await page.getByPlaceholder('Introduce el título de la lista…').fill('Lista QA');
    await page.getByRole('button', { name: 'Añadir lista' }).click();

    // Crear tarjeta dentro de la lista
    await page.getByTestId('list-card-composer-textarea').fill('Tarjeta QA');
    await page.getByRole('button', { name: 'Añadir tarjeta' }).click();

    // Abrir la tarjeta recién creada
    await page.getByText('Tarjeta QA').click();

    // Verificar que estamos en la vista de la tarjeta
    await expect(page.locator('[data-testid="card-back-title-input"]')).toHaveValue('Tarjeta QA');

    // Pasar la URL de la tarjeta al test
    await use(page.url());

    // --- TEARDOWN opcional ---
    // Aquí podrías cerrar/eliminar la tarjeta o la lista si quieres limpiar
  },
});