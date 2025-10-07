const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/shareBoardFixture');
const { BoardSharePage } = require('../../pages/boardShareAndLabelPage');
const { labelScenarios, editLabel } = require('../../data/labelBoardAndShareData');

const { allure } = require('allure-playwright');
const logger = require('../../utils/logger');

test.use({ storageState: 'playwright/.auth/user.json' });
test.describe.configure({ mode: 'serial' });

labelScenarios.forEach(({ title, input, color, id, tag, mark }) => {
    test(`DR-UI-TC-${id} Verificar crear etiqueta con un ${title} ${mark}`, async ({ createBoardPage }) => {
        allure.tag('UI');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity(tag);
        logger.info('Iniciando test');
        const boardPage = new BoardSharePage(createBoardPage);
        logger.info('abriendo menu de etiquetas');
        await boardPage.menuLabel();
        logger.info('abriendo menu de crear etiqueta');
        await boardPage.createLabel(input);
        logger.info('introduciendo nombre y color de etiqueta');
        await boardPage.typeLabel(input, color);
        logger.success('etiqueta creada');
    });
});

editLabel.forEach(({ input, color, ariaColor }) => {
    test(`DR-UI-TC-10/11 Verificar editar el nombre: ${input} y color: ${ariaColor} de una etiqueta @positive @regression`, async ({ createBoardPage }) => {
        allure.tag('UI');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('media'); 
        logger.info('Iniciando test');
        const boardPage = new BoardSharePage(createBoardPage);
        logger.info('abriendo menu de etiquetas');
        await boardPage.menuLabel();
        logger.info('editando el nombre y color de una etiqueta');
        await boardPage.editLastLabel(input, color);
        const ariaLabel = await boardPage.getLastLabelAria();
        logger.info('obteniendo la etiqueta');
        await boardPage.expectInputAndColor(ariaLabel, input, ariaColor);
        logger.success('la etiqueta actualizo su nombre y color');
    });
});

test("DR-UI-TC-12 Verificar eliminar una etiqueta del board @positive @regression", async ({ createBoardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const boardPage = new BoardSharePage(createBoardPage);
    logger.info('abriendo menu de etiquetas');
    await boardPage.menuLabel();
    logger.info('eliminando una etiqueta');
    await boardPage.deleteLabel();
    logger.info('buscando la ultima etiqueta');
    const ariaLabel = await boardPage.getLastLabelAria();
    await expect(ariaLabel).toContain('morado');
    logger.success('la etiqueta fue eliminada');
});

test("DR-UI-TC-13 Verificar que se pueda Habilitar/Deshabilitar modo daltónico @positive @regression", async ({ createBoardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const boardPage = new BoardSharePage(createBoardPage);
    logger.info('abriendo menu de etiquetas');
    await boardPage.menuLabel();
    await boardPage.enableColorblind();
    logger.success('habilitando el modo daltónico');
    await boardPage.disableColorblind();
    logger.success('deshabilitando el modo daltónico');
});