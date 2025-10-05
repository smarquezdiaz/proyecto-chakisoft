// tests/UI/listTest.spec.js
import { test, expect } from '../../fixtures/ListUIFixture.js';
import { testData } from '../../data/dataList.js';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Casos de prueba avanzados - Listas Trello', () => {
  test.describe.configure({ mode: 'serial' });

  //  Navegación inicial antes de cada test
  test.beforeEach(async ({ page, uiHelpers }) => {
    await page.goto(testData.board.url);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#board')).toBeVisible();
    await uiHelpers.closeAllForms();
  });

  test('UI-TC-07: Verificar límite de 512 caracteres en creación', async ({ page, listPage, uiHelpers }) => {
    const longName = testData.lists.maxLength;
    const tooLongName = testData.lists.overMaxLength;

    await uiHelpers.closeAllForms();

    const addButton = listPage.getAddListButton();
    await addButton.click();

    const textarea = page.locator('form.Iw4JfvN1O0a3Ol [data-testid="list-name-textarea"]');
    await expect(textarea).toBeVisible();

    await textarea.type(tooLongName, { delay: 1 });

    const actualValue = await textarea.inputValue();
    console.log(`Longitud ingresada: ${actualValue.length}`);
    expect(actualValue.length).toBeLessThanOrEqual(512);

    const submitButton = page.locator('[data-testid="list-composer-add-list-button"]');
    await submitButton.click();
    
    await expect(page.locator(`h2[data-testid="list-name"]:has-text("${longName}")`).first()).toBeVisible();

    const exists = await listPage.listExists(longName);
    expect(exists).toBe(true);
  });

  test('UI-TC-08: No permitir campo vacío', async ({ page, listPage, uiHelpers }) => {
    await uiHelpers.scrollToEnd();

    const addButton = listPage.getAddListButton('last');
    await expect(addButton).toBeVisible();
    await addButton.scrollIntoViewIfNeeded();
    await addButton.click();

    const textarea = page.locator(listPage.selectors.listNameInput).last();
    await expect(textarea).toBeVisible();

    await uiHelpers.clearInput(textarea);

    const initialValue = await textarea.inputValue();
    console.log(`Valor del campo: "${initialValue}" (longitud: ${initialValue.length})`);
    expect(initialValue.trim()).toBe('');

    const submitButton = page.locator(listPage.selectors.submitListButton).first();
    await expect(submitButton).toBeVisible();

    const isDisabled = await submitButton.isDisabled();

    if (isDisabled) {
      console.log(' Botón está deshabilitado con campo vacío');
      expect(isDisabled).toBe(true);
    } else {
      console.log(' Botón no está deshabilitado, verificando que no crea lista...');
      const listCountBefore = (await listPage.getAllListNames()).length;

      await submitButton.click();
      
      // Esperar un momento para que la UI se actualice
      await page.waitForTimeout(1500);

      const listCountAfter = (await listPage.getAllListNames()).length;
      expect(listCountAfter).toBe(listCountBefore);
      
    }

    await page.keyboard.press('Escape');
  });

  test('TC-09: Mover lista a otro tablero', async ({ listPage, uiHelpers }) => {
  
    await listPage.createList(testData.lists.moveTest);
    await uiHelpers.safeWait(1500);
    
    let exists = await listPage.listExists(testData.lists.moveTest);
    expect(exists).toBe(true);
   
    
  
    await listPage.moveListToBoard(testData.lists.moveTest, testData.board.targetBoard);
    
    exists = await listPage.listExists(testData.lists.moveTest);
    expect(exists).toBe(false);
    
});

  test('UI-TC-10: Desarchivar lista', async ({ page, listPage, uiHelpers }) => {
    await listPage.createList(testData.lists.archiveTest); // 'ejemplo3 archivar'
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
    
});
  test('UI-TC-11: Seguir lista', async ({ listPage, uiHelpers }) => {

    await listPage.createList(testData.lists.followTest); 
    await uiHelpers.safeWait(1500);
    
    let exists = await listPage.listExists(testData.lists.followTest);
    expect(exists).toBe(true);
    
    await listPage.followList(testData.lists.followTest);
    await uiHelpers.safeWait(1000);
    
    
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