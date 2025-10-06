// tests/UI/listFlujoCompleto.spec.js
import { test, expect } from '../../fixtures/ListUIFixture.js';
import { testData } from '../../data/dataList.js';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('flujo de Listas Trello', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
    });
    const page = await context.newPage();
    await page.goto(testData.board.url);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#board')).toBeVisible();
    await page.close();
    await context.close();
  });

  test.beforeEach(async ({ page, uiHelpers }) => {
    await page.goto(testData.board.url);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#board')).toBeVisible();
    await uiHelpers.closeAllForms();
  });

  test('UI-TC-01: Crear lista', async ({ page, listPage }) => {
    await listPage.createList(testData.lists.test1);
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${testData.lists.test1}")`).first()).toBeVisible();
    expect(await listPage.listExists(testData.lists.test1)).toBe(true);
  });

  test('UI-TC-02: Renombrar lista', async ({ page, listPage }) => {
    await listPage.renameList(testData.lists.test1, testData.lists.renamed);
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${testData.lists.renamed}")`).first()).toBeVisible();
    expect(await listPage.listExists(testData.lists.renamed)).toBe(true);
  });

  test('UI-TC-03: Mover lista', async ({ page, listPage }) => {
    await listPage.createList(testData.lists.test2);
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${testData.lists.test2}")`).first()).toBeVisible();

    await listPage.moveListToPosition(testData.lists.renamed, testData.lists.positions.second);

    const allNames = await listPage.getAllListNames();
    expect(allNames.includes(testData.lists.renamed)).toBe(true);
  });

  test('UI-TC-04: Copiar lista', async ({ page, listPage }) => {
    const initialCount = (await listPage.getAllListNames()).length;
    await listPage.copyList(testData.lists.renamed);

    const finalCount = (await listPage.getAllListNames()).length;
    expect(finalCount).toBeGreaterThan(initialCount);
    
    // Verificar que existe una copia de la lista
    const copiedList = page.locator(`${listPage.selectors.listWrapper}:has-text("${testData.lists.renamed}")`).last();
    await expect(copiedList).toBeVisible();
  });

  test('UI-TC-05: Archivar lista', async ({ page, listPage }) => {
    await listPage.archiveList(testData.lists.test2);
    
    const archivedList = page.locator(`${listPage.selectors.listWrapper}:has-text("${testData.lists.test2}")`);
    await expect(archivedList).not.toBeVisible();
    expect(await listPage.listExists(testData.lists.test2)).toBe(false);
  });

  test('UI-TC-06: Eliminar lista archivada', async ({ page, listPage }) => {
    await listPage.deleteArchivedList(testData.lists.test2);
    
    // Verificar que la lista no existe ni visible ni archivada
    expect(await listPage.listExists(testData.lists.test2)).toBe(false);
  });
});