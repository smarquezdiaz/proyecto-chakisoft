// tests/UI/listTest.spec.js
import { test, expect } from '../../fixtures/listFixturesUI.js';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Casos de prueba avanzados - Listas Trello', () => {
    test.describe.configure({ mode: 'serial' });
    
    const targetBoard = 'pruebas mover';
    
    // ✅ NAVEGACIÓN AL TABLERO
    test.beforeEach(async ({ page, uiHelpers }) => {
        await page.goto('https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        await uiHelpers.closeAllForms();
    });

    test('TC-07: Verificar límite de 512 caracteres', async ({ page, listPage, uiHelpers }) => {
        const longName = 'T'.repeat(512);
        const tooLongName = 'T'.repeat(513);
        
        await uiHelpers.closeAllForms();
        await page.waitForTimeout(500);
        
        const addButton = listPage.getAddListButton();
        await addButton.waitFor({ state: 'visible', timeout: 10000 });
        await addButton.click();
        await uiHelpers.safeWait(800);
        
        const textarea = page.locator(listPage.selectors.listNameInput).first();
        await textarea.waitFor({ state: 'visible', timeout: 5000 });
        
        await uiHelpers.clearInput(textarea);
        await textarea.fill(tooLongName);
        await uiHelpers.safeWait(500);
        
        const actualValue = await textarea.inputValue();
        console.log(`Longitud del texto ingresado: ${actualValue.length}`);
        expect(actualValue.length).toBeLessThanOrEqual(512);
        
        await page.keyboard.press('Escape');
        await uiHelpers.safeWait(500);
        
        await listPage.createList(longName);
        await uiHelpers.safeWait(1000);
        
        const exists = await listPage.listExists(longName);
        expect(exists).toBe(true);
        
        if (exists) {
            await listPage.archiveList(longName);
            await listPage.deleteArchivedList(longName);
        }
        
        await uiHelpers.closeAllForms();
    });

    test('TC-08: No permitir campo vacío', async ({ page, listPage, uiHelpers }) => {
        await uiHelpers.scrollToEnd();
        
        const addButton = listPage.getAddListButton('last');
        await addButton.waitFor({ state: 'visible', timeout: 10000 });
        await addButton.scrollIntoViewIfNeeded();
        await uiHelpers.safeWait(300);
        await addButton.click();
        await uiHelpers.safeWait(1000);
        
        const textarea = page.locator(listPage.selectors.listNameInput).last();
        await textarea.waitFor({ state: 'visible', timeout: 5000 });
        
        await uiHelpers.clearInput(textarea);
        
        const initialValue = await textarea.inputValue();
        console.log(`Valor del campo: "${initialValue}" (longitud: ${initialValue.length})`);
        expect(initialValue.trim()).toBe('');
        
        const submitButton = page.locator(listPage.selectors.submitListButton).first();
        await submitButton.waitFor({ state: 'visible', timeout: 5000 });
        
        const isDisabled = await submitButton.isDisabled();
        
        if (isDisabled) {
            console.log('✓ Botón está deshabilitado con campo vacío');
            expect(isDisabled).toBe(true);
        } else {
            console.log('ℹ Botón no está deshabilitado, verificando que no crea lista...');
            const listCountBefore = (await listPage.getAllListNames()).length;
            
            await submitButton.click();
            await uiHelpers.safeWait(1500);
            
            const listCountAfter = (await listPage.getAllListNames()).length;
            expect(listCountAfter).toBe(listCountBefore);
            console.log('✓ El botón no creó una lista vacía');
        }
        
        await page.keyboard.press('Escape');
        await uiHelpers.safeWait(500);
    });

    test('TC-09: Mover lista a otro tablero', async ({ listPage, uiHelpers }) => {
        console.log('Paso 1: Crear lista ejemplo2');
        await listPage.createList('ejemplo2');
        await uiHelpers.safeWait(1500);
        
        let exists = await listPage.listExists('ejemplo2');
        expect(exists).toBe(true);
        console.log('✓ Lista "ejemplo2" creada correctamente');
        
        console.log('Paso 2: Mover lista a otro tablero');
        await listPage.moveListToBoard('ejemplo2', targetBoard);
        
        console.log('Paso 3: Verificar que la lista se movió');
        exists = await listPage.listExists('ejemplo2');
        expect(exists).toBe(false);
        console.log('✓ Lista "ejemplo2" ya no existe en el tablero actual');
        console.log(`✅ TC-09: Lista movida exitosamente al tablero "${targetBoard}"`);
    });

    test('TC-10: Desarchivar lista', async ({ listPage, uiHelpers }) => {
        const listName = 'ejemplo3 archivar';
        
        await listPage.createList(listName);
        await uiHelpers.safeWait(1500);
        
        await listPage.archiveList(listName);
        await uiHelpers.safeWait(1500);
        
        let exists = await listPage.listExists(listName);
        expect(exists).toBe(false);
        console.log('✓ Lista archivada correctamente');
        
        await listPage.unarchiveList(listName);
        
        exists = await listPage.listExists(listName);
        expect(exists).toBe(true);
        console.log('✓ Lista desarchivada correctamente');
        
        // Limpieza
        await listPage.archiveList(listName);
        await listPage.deleteArchivedList(listName);
    });

    test('TC-11: Seguir lista', async ({ listPage, uiHelpers }) => {
        const listName = 'ejemplo seguir';
        
        await listPage.createList(listName);
        await uiHelpers.safeWait(1500);
        
        await listPage.followList(listName);
        
        console.log('✓ Lista seguida correctamente');
        
        // Limpieza
        await listPage.archiveList(listName);
        await listPage.deleteArchivedList(listName);
    });
});