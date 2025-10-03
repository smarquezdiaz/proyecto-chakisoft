const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/shareBoardFixture');
const { BoardSharePage } = require('../../pages/boardShareAndLabelPage');
const { boardUsers } = require('../../data/labelBoardAndShareData');

test.use({ storageState: 'playwright/.auth/user.json' });

boardUsers.forEach(({ input, ok }) => {
    test(`Verificar que ${input} al tablero`, async ({ createBoardPage }) => {
        const boardPage = new BoardSharePage(createBoardPage);
        await boardPage.writeUser(input, ok);
        if (ok === true) {
            await expect(boardPage.nameMembers.last()).toHaveText(process.env.NAME_SHARE);
        } else {
            await expect(boardPage.unregistered).toBeVisible();
        }
    });
});

test('Verificar que se puede copiar enlace de tablero', async ({ createBoardPage }) => {
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.copyLink();
    await expect(boardPage.linkCopied).toBeVisible();
});

test('Verificar que se puede eliminar enlace de tablero', async ({ createBoardPage }) => {
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.copyLink();
    await boardPage.deleteLinkCopy();
    await expect(boardPage.createLink).toBeVisible();
});

test('Verificar que solo usuarios con acceso esten en el tablero', async ({ createBoardPage }) => {
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.shareButton.click();
    await expect(boardPage.nameMembers.last()).toHaveText(process.env.NAME_USER);
});
