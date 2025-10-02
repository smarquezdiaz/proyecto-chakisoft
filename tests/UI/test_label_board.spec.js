const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/shareBoardFixture');
const { BoardSharePage } = require('../../pages/boardShareAndLabelPage');
const { labelScenarios, editLabel } = require('../../data/labelBoardData');

test.use({ storageState: 'playwright/.auth/user.json' });

labelScenarios.forEach(({ title, input, color }) => {
    test(`Verificar crear etiqueta - ${title}`, async ({ createBoardPage }) => {
        const boardPage = new BoardSharePage(createBoardPage);
        await boardPage.menuLabel();
        await boardPage.createLabel(input);
        const ariaLabel = await boardPage.getLastLabelAria();
        switch (title) {
            case 'nombre normal':
                await expect(ariaLabel).toContain(input);
                await expect(ariaLabel).toContain(color);
                break;
            case 'nombre vacío':
                await expect(ariaLabel).toContain('ninguno');
                await expect(ariaLabel).toContain(color);
                break;
            case 'nombre especiales':
                await expect(ariaLabel).toContain(input);
                await expect(ariaLabel).toContain(color);
                break;
            default:
                throw new Error(`Escenario no manejado: ${title}`);
        }
    });
});

editLabel.forEach(({ input, color, ariaColor }) => {
    test(`Verificar edicion de etiqueta con nombre: ${input} y color: ${color}`, async ({ createBoardPage }) => {
        const boardPage = new BoardSharePage(createBoardPage);
        await boardPage.menuLabel();
        await boardPage.editLastLabel(input, color);
        const ariaLabel = await boardPage.getLastLabelAria();
        await expect(ariaLabel).toContain(input);
        await expect(ariaLabel).toContain(ariaColor);
    });
});

test("Verificar eliminar etiqueta", async ({ createBoardPage }) => {
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.menuLabel();
    await boardPage.deleteLabel();
    const ariaLabel = await boardPage.getLastLabelAria();
    await expect(ariaLabel).toContain('morado');
});

test("Verificar Habilitar/Deshabilitar modo daltónico", async ({ createBoardPage }) => {
    const boardPage = new BoardSharePage(createBoardPage);
    await boardPage.menuLabel();
    await boardPage.enableColorblindButton.click();
    await expect(boardPage.disableColorblindButton).toBeVisible();
    await boardPage.disableColorblindButton.click();
    await expect(boardPage.enableColorblindButton).toBeVisible();
});