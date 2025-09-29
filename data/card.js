
import { expect } from '@playwright/test';
import { test as boardUrl } from './board'; // tu fixture de board

export const test = boardUrl.extend({
    cardUrl: async ({ boardUrl }, use) => {

        // Introducir el nombre de la lista
        await boardUrl.getByTestId('list-name-textarea').fill('Lista QA');
        await boardUrl.getByRole('button', { name: 'Añadir lista' }).click();
        // Crear tarjeta dentro de la lista
        await boardUrl.keyboard.press('Escape');
        await boardUrl.getByTestId('list-add-card-button').click();
        await boardUrl.getByTestId('list-add-card-button').click();

        await boardUrl.getByTestId('list-card-composer-textarea').fill('Tarjeta QA');
        await boardUrl.getByRole('button', { name: 'Añadir tarjeta' }).click();

        // Abrir la tarjeta recién creada
        await boardUrl.keyboard.press('Escape');
        await boardUrl.getByTestId('card-name').click();
        await boardUrl.getByTestId('card-name').click();
        // Verificar que estamos en la vista de la tarjeta
        //await expect(boardUrl.locator('[data-testid="card-back-title-input"]')).toHaveValue('Tarjeta QA');

        // Pasar la URL de la tarjeta al test
        await use(boardUrl);

        // --- TEARDOWN opcional ---
        // Aquí podrías cerrar/eliminar la tarjeta o la lista si quieres limpiar
    },
});