const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/shareBoardFixture');
const { BoardSharePage } = require('../../pages/boardShareAndLabelPage');
const { boardUsers } = require('../../data/labelBoardAndShareData');

const { allure } = require('allure-playwright');
const logger = require('../../utils/logger');

test.use({ storageState: 'playwright/.auth/user.json' });

boardUsers.forEach(({ input, ok }) => {
    test(`Verificar que ${input} al board`, async ({ createBoardPage }) => {
        allure.tag('API');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('normal');
        const boardPage = new BoardSharePage(createBoardPage);
        await boardPage.writeUser(input, ok);
        await boardPage.expectUser(ok);
    });
});

test('Verificar que se puede copiar el enlace para compartir el board', async ({ createBoardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.copyLink();
    await expect(boardPage.linkCopied).toBeVisible();
});

test('Verificar que se puede eliminar el enlace para compartir el board', async ({ createBoardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.copyLink();
    await boardPage.deleteLinkCopy();
    await expect(boardPage.createLink).toBeVisible();
});

test('Verificar que solo usuarios con acceso esten en el board', async ({ createBoardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal'); const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.shareButton.click();
    await expect(boardPage.nameMembers.last()).toHaveText(process.env.NAME_USER);
});
