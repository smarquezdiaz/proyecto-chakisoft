import { test, expect } from '../../fixtures/ListUIFixture.js';
import { testData } from '../../data/dataList.js';
const logger = require("../../utils/logger.js");
const { allure } = require('allure-playwright');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('CRUD Básico de Listas Trello', () => {
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

  test('AE-UI-TC-01: Verificar que se pueda crear lista @Smoke @Regression @positive ', async ({ page, listPage }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('Creando una nueva lista via UI');
    
    await listPage.createList(testData.lists.test1);
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${testData.lists.test1}")`).first()).toBeVisible();
    expect(await listPage.listExists(testData.lists.test1)).toBe(true);
    
    logger.info(`Lista creada exitosamente: ${testData.lists.test1}`);
  });

  test('AE-UI-TC-02: Verificar la funcionalidad de renombrar lista @Smoke @Regression @positive', async ({ page, listPage }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('Renombrando una lista existente');
    
    await listPage.renameList(testData.lists.test1, testData.lists.renamed);
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${testData.lists.renamed}")`).first()).toBeVisible();
    expect(await listPage.listExists(testData.lists.renamed)).toBe(true);
    
    logger.info(`Lista renombrada exitosamente a: ${testData.lists.renamed}`);
  });

  test('AE-UI-TC-03: Verificar la funcionalidad mover lista por posicion @Smoke @Regression @positive ', async ({ page, listPage }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('Moviendo lista a una nueva posición');
    
    await listPage.createList(testData.lists.test2);
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${testData.lists.test2}")`).first()).toBeVisible();

    await listPage.moveListToPosition(testData.lists.renamed, testData.lists.positions.second);

    const allNames = await listPage.getAllListNames();
    expect(allNames.includes(testData.lists.renamed)).toBe(true);
    
    logger.info('Lista movida exitosamente a la nueva posición');
  });

  test('AE-UI-TC-04: Verificar la funcionalidad de copiar una lista @Smoke @Regression @positive ', async ({ page, listPage }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('Copiando lista existente');
    
    const initialCount = (await listPage.getAllListNames()).length;
    await listPage.copyList(testData.lists.renamed);

    const finalCount = (await listPage.getAllListNames()).length;
    expect(finalCount).toBeGreaterThan(initialCount);
    
    const copiedList = page.locator(`${listPage.selectors.listWrapper}:has-text("${testData.lists.renamed}")`).last();
    await expect(copiedList).toBeVisible();
    
    logger.info('Lista copiada exitosamente');
  });

  test('AE-UI-TC-05: Verificar la funcionalidad de archivar una lista @Smoke @Regression @positive', async ({ page, listPage }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('Archivando lista desde el tablero');

    await listPage.archiveList(testData.lists.test2);
    
    const archivedList = page.locator(`${listPage.selectors.listWrapper}:has-text("${testData.lists.test2}")`);
    await expect(archivedList).not.toBeVisible();
    expect(await listPage.listExists(testData.lists.test2)).toBe(false);
    
    logger.info('Lista archivada correctamente');
  });

  test('AE-UI-TC-06: Verificar la funcionalidad de eliminar una lista archivada @Smoke @Regression @positive ', async ({ listPage }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('Eliminando lista archivada');
    
    await listPage.deleteArchivedList(testData.lists.test2);
    
    expect(await listPage.listExists(testData.lists.test2)).toBe(false);
    
    logger.info('Lista archivada eliminada permanentemente');
  });

  test.afterAll(async ({ cleanup }) => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(' EJECUTANDO LIMPIEZA COMPLETA DEL TABLERO');
    console.log('═══════════════════════════════════════════════════════════\n');
    await cleanup();
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(' LIMPIEZA FINALIZADA - TABLERO LIMPIO');
    console.log('═══════════════════════════════════════════════════════════\n');
  });
});