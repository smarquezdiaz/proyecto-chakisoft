import { expect } from '@playwright/test';
import { test as createBoardPage } from './shareBoardFixture'; // tu fixture de board

export const test = createBoardPage.extend({
    createCardPage: async ({ createBoardPage }, use) => {

        // Introducir el nombre de la lista
        await expect(createBoardPage.getByTestId('list-name-textarea')).toBeVisible(); // agregado
        await createBoardPage.getByTestId('list-name-textarea').fill('Lista QA');

        await expect(createBoardPage.getByRole('button', { name: 'Añadir lista' })).toBeEnabled(); // agregado
        await createBoardPage.getByRole('button', { name: 'Añadir lista' }).click();

        await createBoardPage.keyboard.press('Escape');

        await expect(createBoardPage.getByTestId('list-add-card-button')).toBeVisible(); // agregado
        await createBoardPage.getByTestId('list-add-card-button').click();
        await createBoardPage.getByTestId('list-add-card-button').click();

        await expect(createBoardPage.getByTestId('list-card-composer-textarea')).toBeVisible(); // agregado
        await createBoardPage.getByTestId('list-card-composer-textarea').fill('Tarjeta QA');

        await expect(createBoardPage.getByRole('button', { name: 'Añadir tarjeta' })).toBeEnabled(); // agregado
        await createBoardPage.getByRole('button', { name: 'Añadir tarjeta' }).click();

        await createBoardPage.keyboard.press('Escape');
        
        await expect(createBoardPage.getByText('Tarjeta QA')).toBeVisible();
        await createBoardPage.getByText('Tarjeta QA').click();
        await createBoardPage.getByText('Tarjeta QA').click();

        await use(createBoardPage);
    },
});