const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/shareBoardFixture');
const { BoardSharePage } = require('../../pages/boardShareAndLabelPage');
const { labelScenarios, editLabel } = require('../../data/labelBoardAndShareData');

const { allure } = require('allure-playwright');
const logger = require('../../utils/logger');

test.use({ storageState: 'playwright/.auth/user.json' });
test.describe.configure({ mode: 'serial' });

labelScenarios.forEach(({ title, input, color }) => {
    test(`Verificar crear etiqueta un ${title}`, async ({ createBoardPage }) => {
        allure.tag('API');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('normal');
        const boardPage = new BoardSharePage(createBoardPage);
        await boardPage.menuLabel();
        await boardPage.createLabel(input);
        await boardPage.typeLabel(input, color);
    });
});

editLabel.forEach(({ input, color, ariaColor }) => {
    test(`Verificar edicion de etiqueta con nombre: ${input} y color: ${ariaColor}`, async ({ createBoardPage }) => {
        allure.tag('API');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('normal'); const boardPage = new BoardSharePage(createBoardPage);
        await boardPage.menuLabel();
        await boardPage.editLastLabel(input, color);
        const ariaLabel = await boardPage.getLastLabelAria();
        await boardPage.expectInputAndColor(ariaLabel, input, ariaColor);
    });
});

test("Verificar eliminar etiqueta", async ({ createBoardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.menuLabel();
    await boardPage.deleteLabel();
    const ariaLabel = await boardPage.getLastLabelAria();
    await expect(ariaLabel).toContain('morado');
});

test("Verificar Habilitar/Deshabilitar modo daltónico", async ({ createBoardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.menuLabel();
    await boardPage.enableColorblind();
    await boardPage.disableColorblind();
});