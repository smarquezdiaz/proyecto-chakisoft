import { expect } from '@playwright/test';
import { test as createBoardPage } from './shareBoardFixture';

export const test = createBoardPage.extend({
    createCardPage: async ({ createBoardPage }, use) => {

        await expect(createBoardPage.getByTestId('list-name-textarea')).toBeVisible(); 
        await createBoardPage.getByTestId('list-name-textarea').fill('Lista QA');

        await expect(createBoardPage.getByRole('button', { name: 'Añadir lista' })).toBeEnabled(); 
        await createBoardPage.getByRole('button', { name: 'Añadir lista' }).click();

        await createBoardPage.keyboard.press('Escape');

        await expect(createBoardPage.getByTestId('list-add-card-button')).toBeVisible(); 
        await createBoardPage.getByTestId('list-add-card-button').click();
        await createBoardPage.getByTestId('list-add-card-button').click();

        await expect(createBoardPage.getByTestId('list-card-composer-textarea')).toBeVisible(); 
        await createBoardPage.getByTestId('list-card-composer-textarea').fill('Tarjeta QA');

        await expect(createBoardPage.getByRole('button', { name: 'Añadir tarjeta' })).toBeEnabled(); 
        await createBoardPage.getByRole('button', { name: 'Añadir tarjeta' }).click();

        await createBoardPage.keyboard.press('Escape');
        await expect(createBoardPage.getByText('Tarjeta QA')).toBeVisible();
        await createBoardPage.waitForTimeout(1000);
        await createBoardPage.getByTestId('card-done-state').click();
        //await createBoardPage.getByText('Tarjeta QA').click();

        await use(createBoardPage);
    },
});