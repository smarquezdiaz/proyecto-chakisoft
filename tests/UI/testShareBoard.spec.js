const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/shareBoardFixture');
const { BoardSharePage } = require('../../pages/boardShareAndLabelPage');
const { boardUsers } = require('../../data/labelBoardAndShareData');

const { allure } = require('allure-playwright');
const logger = require('../../utils/logger');
const { title } = require('process');

test.use({ storageState: 'playwright/.auth/user.json' });
test.describe.configure({ mode: 'serial' });

boardUsers.forEach(({ input, title, ok, id, tag }) => {
    test(`DR-UI-TC-${id} Verificar que ${title} al board @smoke @regression`, async ({ createBoardPage }) => {
        allure.tag('UI');
        allure.tag(tag);
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('alta');
        logger.info('Iniciando test');
        const boardPage = new BoardSharePage(createBoardPage);
        logger.info('abriendo menu para añadir miembros al board');
        await boardPage.writeUser(input, ok);
        logger.info('agregando miembro');
        await boardPage.expectUser(ok);
    });
});

test('DR-UI-TC-04 Verificar que se puede copiar el enlace para compartir el board @positive @regression', async ({ createBoardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const boardPage = new BoardSharePage(createBoardPage);
    logger.info('abriendo menu para añadir miembros al board');
    await boardPage.copyLink();
    logger.info('creando enlace');
    await expect(boardPage.linkCopied).toBeVisible();
    logger.success('enlace copiado');
});

test('DR-UI-TC-05 Verificar que se puede eliminar el enlace para compartir el board @positive @regression', async ({ createBoardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const boardPage = new BoardSharePage(createBoardPage);
    logger.info('abriendo menu para añadir miembros al board');
    await boardPage.copyLink();
    logger.info('creando enlace');
    await boardPage.deleteLinkCopy();
    logger.info('elimininando enlace');
    await expect(boardPage.createLink).toBeVisible();
    logger.success('enlace eliminado');
});

test('DR-UI-TC-06 Verificar que solo usuarios con acceso esten en el board @smoke @positive @regression', async ({ createBoardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('alta');
    logger.info('Iniciando test');
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.shareButton.click();
    logger.info('abriendo menu para añadir miembros al board');
    await expect(boardPage.nameMembers.last()).toHaveText(process.env.NAME_USER);
    logger.success('solo hay usuarios con acceso en el board');
});
