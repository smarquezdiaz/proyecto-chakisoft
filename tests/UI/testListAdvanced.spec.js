
import { test, expect } from '../../fixtures/ListUIFixture.js';
import { testData } from '../../data/dataList.js';
const logger = require ("../../utils/logger.js");
const { allure } = require('allure-playwright');
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Casos de prueba avanzados - Listas Trello', () => {
  test.describe.configure({ mode: 'serial' });

  
  test.beforeEach(async ({ page, uiHelpers }) => {
    await page.goto(testData.board.url);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#board')).toBeVisible();
    await uiHelpers.closeAllForms();
  });

  test('AE-UI-TC-07: Verificar límite de 512 caracteres en nombre de lista @Smoke @Regression  ', async ({ page, listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('medium');
    logger.info(' Iniciando prueba: Verificar límite de 512 caracteres');
    
    const longName = testData.lists.maxLength;
    const tooLongName = testData.lists.overMaxLength;

    await uiHelpers.closeAllForms();
    logger.info('Formulario cerrado correctamente.');
    const addButton = listPage.getAddListButton();
    await addButton.click();

    const textarea = page.locator('form.Iw4JfvN1O0a3Ol [data-testid="list-name-textarea"]');
    await expect(textarea).toBeVisible();

    await textarea.type(tooLongName, { delay: 1 });
    const actualValue = await textarea.inputValue();
    logger.info(`Longitud ingresada: ${actualValue.length}`);
    expect(actualValue.length).toBeLessThanOrEqual(512);

    const submitButton = page.locator('[data-testid="list-composer-add-list-button"]');
    await submitButton.click();
    
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${longName}")`).first()).toBeVisible();

    const exists = await listPage.listExists(longName);
    expect(exists).toBe(true);
    logger.info(' Prueba finalizada: Límite de 512 caracteres verificado correctamente.');
  });

  test('AE-UI-TC-08: Verificar restricción al crear lista con campo vacío @Smoke @Regression', async ({ page, listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('high');
    logger.info(' Iniciando prueba: No permitir crear lista con campo vacío.');
    
    
    await uiHelpers.scrollToEnd();

    const addButton = listPage.getAddListButton('last');
    await expect(addButton).toBeVisible();
    await addButton.scrollIntoViewIfNeeded();
    await addButton.click();

    const textarea = page.locator(listPage.selectors.listNameInput).last();
    await expect(textarea).toBeVisible();

    await uiHelpers.clearInput(textarea);

    const initialValue = await textarea.inputValue();
    logger.info(`Valor del campo: "${initialValue}" (longitud: ${initialValue.length})`);

    expect(initialValue.trim()).toBe('');

    const submitButton = page.locator(listPage.selectors.submitListButton).first();
    await expect(submitButton).toBeVisible();

    const isDisabled = await submitButton.isDisabled();

    if (isDisabled) {
      logger.info(' [AE-UI-TC-08] Botón "Añadir lista" deshabilitado correctamente con campo vacío.')
      expect(isDisabled).toBe(true);
    } else {
      console.log('Botón "Añadir lista" deshabilitado correctamente con campo vacío.');
      const listCountBefore = (await listPage.getAllListNames()).length;
      await submitButton.click();
      
      await page.waitForTimeout(1500);
      const listCountAfter = (await listPage.getAllListNames()).length;
      expect(listCountAfter).toBe(listCountBefore);
      logger.info(' Lista no creada con campo vacío.');
      
    }

    await page.keyboard.press('Escape');
  });

  test('AE-UI-TC-09: Verificar la funcionalidad mover lista a otro tablero @Smoke @Regression ', async ({ listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('medium');
    logger.info('Iniciando prueba: Mover lista a otro tablero.');
  
    await listPage.createList(testData.lists.moveTest);
    await uiHelpers.safeWait(1500);
    
    let exists = await listPage.listExists(testData.lists.moveTest);
    expect(exists).toBe(true);
   
    logger.info('Lista creada, procediendo a mover al tablero destino.');
  
    await listPage.moveListToBoard(testData.lists.moveTest, testData.board.targetBoard);
    
    exists = await listPage.listExists(testData.lists.moveTest);
    expect(exists).toBe(false);
   logger.info(' Lista movida correctamente al tablero destino.'); 
});

  test('AE-UI-TC-10: Verificar la funcionalidad de desarchivar una lista @Smoke @Regression', async ({ page, listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('medium');
    logger.info('Iniciando prueba: Desarchivar lista.');
    
    
    await listPage.createList(testData.lists.archiveTest); 
    await uiHelpers.safeWait(1500);
    
    let exists = await listPage.listExists(testData.lists.archiveTest);
    expect(exists).toBe(true);
    
    await listPage.archiveList(testData.lists.archiveTest);
    await uiHelpers.safeWait(1000);
    
    const archivedList = page.locator(`${listPage.selectors.listWrapper}:has-text("${testData.lists.archiveTest}")`);
    await expect(archivedList).not.toBeVisible();
    exists = await listPage.listExists(testData.lists.archiveTest);
    expect(exists).toBe(false);
   
    await listPage.unarchiveList(testData.lists.archiveTest);
    await uiHelpers.safeWait(2000);
    
    exists = await listPage.listExists(testData.lists.archiveTest);
    expect(exists).toBe(true);
     logger.info(' Lista desarchivada correctamente.');
});
  test('AE-UI-TC-11: Verificar la funcionalidad de seguir una lista @Smoke @Regression', async ({ listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('low');
    logger.info(' Iniciando prueba: Seguir lista.');
    await listPage.createList(testData.lists.followTest); 
    await uiHelpers.safeWait(1500);
    
    let exists = await listPage.listExists(testData.lists.followTest);
    expect(exists).toBe(true);
    
    await listPage.followList(testData.lists.followTest);
    await uiHelpers.safeWait(1000);
     logger.info(' Lista seguida correctamente.');
    
    
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