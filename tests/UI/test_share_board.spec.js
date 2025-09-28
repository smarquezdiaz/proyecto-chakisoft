const { expect } = require('@playwright/test');
const { test } = require('../../data/board');
const { BoardSharePage } = require('../../pages/BoardForSharePAge');
const scenarios = [{ input: 'David Gregori Rodriguez Calle', ok: true }, { input: 'www.str_hpl@hotmail.com', ok: true }, { input: 'usuarioquenoexiste', ok: false }];

test.use({ storageState: 'playwright/.auth/user.json' });

scenarios.forEach(({ input, ok }) => {
    test(`Asignar usuario a tablero ${input}`, async ({ boardUrl }) => {
        const boardPage = new BoardSharePage(boardUrl);
        boardPage.writeUser(input, ok);
        if (ok === true) {
            await expect(boardPage.nameMembers.last()).toHaveText('David Gregori Rodriguez Calle');
        } else {
            //await expect(boardPage.unregistered).toHaveText('No se encontraron miembros');
            await expect(boardPage.unregistered).toBeVisible();
        }
    });
});

test('Verificar que se puede copiar enlace', async ({ boardUrl }) => {
    const boardPage = new BoardSharePage(boardUrl);
    await boardPage.shareButton.click();
    await boardPage.createLink.click();
    await expect(boardPage.linkCopied).toBeVisible();
});

test('Verificar que se puede eliminar enlace', async ({ boardUrl }) => {
    const boardPage = new BoardSharePage(boardUrl);
    await boardPage.shareButton.click();
    await boardPage.createLink.click();
    await boardPage.deleteLink.click();
    await boardPage.confirmDelete.click();
    await expect(boardPage.createLink).toBeVisible();
});

test('Verificar que solo usuarios con acceso', async ({ boardUrl }) => {
    const boardPage = new BoardSharePage(boardUrl);
    await boardPage.shareButton.click();
    await expect(boardPage.nameMembers.last()).toHaveText('Chakisoft (tú)');
});
