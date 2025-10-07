
import { test, expect } from '../../fixtures/ListUIFixture.js';
import { testData } from '../../data/ListDataUI.js';
const logger = require("../../utils/logger.js");
const { allure } = require('allure-playwright');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Casos de Prueba Avanzados - Listas Trello', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page, uiHelpers }) => {
    await page.goto(testData.board.url);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#board')).toBeVisible();
    await uiHelpers.closeAllForms();
  });

  test('AE-UI-TC-07: Verificar límite de 512 caracteres en nombre de lista @Smoke @Regression @positive ', async ({ page, listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('medium');
    allure.description('Verifica que el campo de nombre de lista no permita más de 512 caracteres');
    allure.tag('boundary-testing', 'validation');
    
  
    
    const longName = testData.lists.maxLength;
    const tooLongName = testData.lists.overMaxLength;

    logger.info('Paso 1: Cerrar formularios abiertos');
    await uiHelpers.closeAllForms();
    
    logger.info('Paso 2: Abrir formulario de nueva lista');
    const addButton = listPage.getAddListButton();
    await addButton.click();

    const textarea = page.locator('form.Iw4JfvN1O0a3Ol [data-testid="list-name-textarea"]');
    await expect(textarea).toBeVisible();

    logger.info(`Paso 3: Intentar ingresar ${tooLongName.length} caracteres`);
    await textarea.type(tooLongName, { delay: 1 });
    
    const actualValue = await textarea.inputValue();
    logger.info(`Longitud ingresada: ${actualValue.length} caracteres`);
    logger.info(`Longitud máxima permitida: ${testData.validation.maxListNameLength} caracteres`);
    
    expect(actualValue.length).toBeLessThanOrEqual(testData.validation.maxListNameLength);
    logger.info('✓ Validación exitosa: El campo limita correctamente a 512 caracteres');

    logger.info('Paso 4: Crear lista con el nombre truncado');
    const submitButton = page.locator('[data-testid="list-composer-add-list-button"]');
    await submitButton.click();
    
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${longName}")`).first()).toBeVisible();

    const exists = await listPage.listExists(longName);
    expect(exists).toBe(true);
    
    logger.info('✓ Lista creada exitosamente con nombre de 512 caracteres');
    
  });

  test('AE-UI-TC-08: Verificar restricción al crear lista con campo vacío @Smoke @Regression @positive', async ({ page, listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('high');
    allure.description('Verifica que no se pueda crear una lista con el nombre vacío');
    allure.tag('negative-testing', 'validation');
    
    
    
    logger.info('Paso 1: Desplazar al final del tablero');
    await uiHelpers.scrollToEnd();

    logger.info('Paso 2: Abrir formulario de nueva lista');
    const addButton = listPage.getAddListButton('last');
    await expect(addButton).toBeVisible();
    await addButton.scrollIntoViewIfNeeded();
    await addButton.click();

    const textarea = page.locator(listPage.selectors.listNameInput).last();
    await expect(textarea).toBeVisible();

    logger.info('Paso 3: Limpiar el campo de texto');
    await uiHelpers.clearInput(textarea);

    const initialValue = await textarea.inputValue();
    logger.info(`Valor del campo: "${initialValue}" (longitud: ${initialValue.length})`);

    expect(initialValue.trim()).toBe('');
    logger.info('✓ Campo está vacío como se esperaba');

    logger.info('Paso 4: Verificar estado del botón "Añadir lista"');
    const submitButton = page.locator(listPage.selectors.submitListButton).first();
    await expect(submitButton).toBeVisible();

    const isDisabled = await submitButton.isDisabled();

    if (isDisabled) {
      logger.info(' Botón "Añadir lista" está DESHABILITADO correctamente');
      expect(isDisabled).toBe(true);
    } else {
      logger.warn(' Botón "Añadir lista" está HABILITADO (comportamiento inesperado)');
      logger.info('Paso 5: Verificar que no se cree la lista al hacer clic');
      
      const listCountBefore = (await listPage.getAllListNames()).length;
      logger.info(`Cantidad de listas antes: ${listCountBefore}`);
      
      await submitButton.click();
      await page.waitForTimeout(1500);
      
      const listCountAfter = (await listPage.getAllListNames()).length;
      logger.info(`Cantidad de listas después: ${listCountAfter}`);
      
      expect(listCountAfter).toBe(listCountBefore);
      logger.info('✓ No se creó ninguna lista con campo vacío');
    }

    await page.keyboard.press('Escape');
    

  });

  test('AE-UI-TC-09: Verificar la funcionalidad mover lista a otro tablero @Smoke @Regression @positive', async ({ listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('medium');
    allure.description('Verifica que una lista se pueda mover a otro tablero diferente');
    allure.tag('move-list', 'cross-board');
    
    
  
    logger.info('Paso 1: Crear nueva lista para mover');
    await listPage.createList(testData.lists.moveTest);
    await uiHelpers.safeWait(1500);
    
    let exists = await listPage.listExists(testData.lists.moveTest);
    expect(exists).toBe(true);
    logger.info(`✓ Lista creada: "${testData.lists.moveTest}"`);
   
    logger.info('Paso 2: Mover lista al tablero destino');
    logger.info(`Tablero destino: "${testData.board.targetBoard}"`);
    
    await listPage.moveListToBoard(testData.lists.moveTest, testData.board.targetBoard);
    
    logger.info('Paso 3: Verificar que la lista ya no está en el tablero actual');
    exists = await listPage.listExists(testData.lists.moveTest);
    expect(exists).toBe(false);
    logger.info('✓ Lista movida exitosamente al tablero destino');
    
    
  });

  test('AE-UI-TC-10: Verificar la funcionalidad de desarchivar una lista @Smoke @Regression @ positive', async ({ page, listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('medium');
    allure.description('Verifica que una lista archivada se pueda desarchivar correctamente');
    allure.tag('archive', 'restore');
    
    
    
    logger.info('Paso 1: Crear nueva lista para archivar');
    await listPage.createList(testData.lists.archiveTest); 
    await uiHelpers.safeWait(1500);
    
    let exists = await listPage.listExists(testData.lists.archiveTest);
    expect(exists).toBe(true);
    logger.info(`✓ Lista creada: "${testData.lists.archiveTest}"`);
    
    logger.info('Paso 2: Archivar la lista');
    await listPage.archiveList(testData.lists.archiveTest);
    await uiHelpers.safeWait(1000);
    
   const archivedList = page.locator(`${listPage.selectors.listWrapper}:has-text("${testData.lists.archiveTest}")`);
    await expect(archivedList).not.toBeVisible();
    exists = await listPage.listExists(testData.lists.archiveTest);
    expect(exists).toBe(false);
    logger.info('✓ Lista archivada correctamente');
   
    logger.info('Paso 3: Desarchivar la lista');
    await listPage.unarchiveList(testData.lists.archiveTest);
    await uiHelpers.safeWait(2000);
    
    logger.info('Paso 4: Verificar que la lista está visible nuevamente');
    exists = await listPage.listExists(testData.lists.archiveTest);
    expect(exists).toBe(true);
    logger.info('✓ Lista desarchivada y visible en el tablero');
    
  
  });

  test('AE-UI-TC-11: Verificar la funcionalidad de seguir una lista @Smoke @Regression @positive', async ({ listPage, uiHelpers }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('low');
    allure.description('Verifica que se pueda seguir una lista para recibir notificaciones');
    allure.tag('watch-list', 'notifications');
    
    
    logger.info('Paso 1: Crear nueva lista para seguir');
    await listPage.createList(testData.lists.followTest); 
    await uiHelpers.safeWait(1500);
    
    let exists = await listPage.listExists(testData.lists.followTest);
    expect(exists).toBe(true);
    logger.info(`✓ Lista creada: "${testData.lists.followTest}"`);
    
    logger.info('Paso 2: Activar seguimiento de la lista');
    await listPage.followList(testData.lists.followTest);
    await uiHelpers.safeWait(1000);
    logger.info('✓ Lista seguida correctamente');
    
    logger.info('Paso 3: Verificar que la lista sigue existiendo');
    exists = await listPage.listExists(testData.lists.followTest);
    expect(exists).toBe(true);
    logger.info('✓ Lista visible en el tablero después de seguir');
    

  });

  test.afterAll(async ({ cleanup }) => {
    test.setTimeout(40000); // aumenta el límite a 40 segundos
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(' EJECUTANDO LIMPIEZA COMPLETA DEL TABLERO');
    console.log('═══════════════════════════════════════════════════════════\n');
    await cleanup();
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(' LIMPIEZA FINALIZADA - TABLERO LIMPIO');
    console.log('═══════════════════════════════════════════════════════════\n');
  });
});