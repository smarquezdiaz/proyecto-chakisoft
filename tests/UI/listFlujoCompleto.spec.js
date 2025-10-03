// tests/UI/listFlujoCompleto.spec.js
import { test, expect } from '../../fixtures/listFixturesUI.js';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('flujo de Listas Trello', () => {
    test.describe.configure({ mode: 'serial' });
    
    // ✅ NAVEGACIÓN AL TABLERO ANTES DE TODOS LOS TESTS
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext({
            storageState: 'playwright/.auth/user.json'
        });
        const page = await context.newPage();
        await page.goto('https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        await page.close();
        await context.close();
    });

    test.beforeEach(async ({ page, uiHelpers }) => {
        // ✅ Navegar al tablero en cada test
        await page.goto('https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);
        await uiHelpers.closeAllForms();
    });

    test('TC-01: Crear lista', async ({ listPage }) => {
        await listPage.createList('Test Lista 1');
        expect(await listPage.listExists('Test Lista 1')).toBe(true);
    });

    test('TC-02: Renombrar lista', async ({ listPage }) => {
        await listPage.renameList('Test Lista 1', 'Test Lista RenombradaUI');
        expect(await listPage.listExists('Test Lista RenombradaUI')).toBe(true);
    });

    test('TC-03: Mover lista', async ({ listPage, uiHelpers }) => {
        await listPage.createList('Test Lista 2');
        await uiHelpers.safeWait(1000);
        
        await listPage.moveListToPosition('Test Lista RenombradaUI', 2);
        await uiHelpers.safeWait(1000);
        
        const allNames = await listPage.getAllListNames();
        expect(allNames.includes('Test Lista RenombradaUI')).toBe(true);
    });

    test('TC-04: Copiar lista', async ({ listPage, uiHelpers }) => {
        const initialCount = (await listPage.getAllListNames()).length;
        await listPage.copyList('Test Lista RenombradaUI');
        await uiHelpers.safeWait(2000);
        
        const finalCount = (await listPage.getAllListNames()).length;
        expect(finalCount).toBeGreaterThan(initialCount);
    });

    test('TC-05: Archivar lista', async ({ listPage, uiHelpers }) => {
        await listPage.archiveList('Test Lista 2');
        await uiHelpers.safeWait(1000);
        expect(await listPage.listExists('Test Lista 2')).toBe(false);
    });

    test('TC-06: Eliminar lista archivada', async ({ listPage, uiHelpers }) => {
        await listPage.deleteArchivedList('Test Lista 2');
        await uiHelpers.safeWait(1000);
        expect(await listPage.listExists('Test Lista 2')).toBe(false);
    });

    // ✅ CORRECCIÓN: No usar fixtures en afterAll
    test.afterAll(async ({ browser }) => {
        try {
            console.log('Tests completados');
        } catch (e) {
            console.log('Cleanup finalizado');
        }
    });
});