const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/shareBoardFixture');
const { BoardSharePage } = require('../../pages/boardShareAndLabelPage');
const scenarios = [{ input: 'David Gregori Rodriguez Calle', ok: true }, { input: 'www.str_hpl@hotmail.com', ok: true }, { input: 'usuarioquenoexiste', ok: false }];

test.use({ storageState: 'playwright/.auth/user.json' });

scenarios.forEach(({ input, ok }) => {
    test(`Asignar usuario a tablero ${input}`, async ({ createBoardPage }) => {
        const boardPage = new BoardSharePage(createBoardPage);
        await boardPage.writeUser(input, ok);
        if (ok === true) {
            await expect(boardPage.nameMembers.last()).toHaveText('David Gregori Rodriguez Calle');
        } else {
            await expect(boardPage.unregistered).toBeVisible();
        }
    });
});

test('Verificar que se puede copiar enlace', async ({ createBoardPage }) => {
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.shareButton.click();
    await boardPage.createLink.click();
    await expect(boardPage.linkCopied).toBeVisible();
});

test('Verificar que se puede eliminar enlace', async ({ createBoardPage }) => {
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.shareButton.click();
    await boardPage.createLink.click();
    await boardPage.deleteLink.click();
    await boardPage.confirmDelete.click();
    await expect(boardPage.createLink).toBeVisible();
});

test('Verificar que solo usuarios con acceso', async ({ createBoardPage }) => {
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.shareButton.click();
    await expect(boardPage.nameMembers.last()).toHaveText('Chakisoft (tú)');
});
