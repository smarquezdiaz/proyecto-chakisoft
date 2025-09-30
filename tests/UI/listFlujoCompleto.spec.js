// tests/UI/list.spec.js
const { test, expect } = require('@playwright/test');
const { ListPage } = require('../../pages/ListPage');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('CRUD Listas Trello', () => {
    test.describe.configure({ mode: 'serial' });
    
    let page, listPage;
    
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        listPage = new ListPage(page);
        await page.goto('https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello');
    });
    
    test('Crear lista', async () => {
        await listPage.createList('Test Lista 1');
        expect(await listPage.listExists('Test Lista 1')).toBe(true);
    });
    
    test('Renombrar lista', async () => {
        await listPage.renameList('Test Lista 1', 'Test Lista Renombrada');
        expect(await listPage.listExists('Test Lista Renombrada')).toBe(true);
    });
    
    test('Mover lista', async () => {
        await listPage.createList('Test Lista 2');
        await page.waitForTimeout(1000);
        
        await listPage.moveList('Test Lista Renombrada', 2);
        await page.waitForTimeout(1000);
        
        const allNames = await listPage.getAllListNames();
        expect(allNames.includes('Test Lista Renombrada')).toBe(true);
    });
    
    test('Copiar lista', async () => {
        const initialCount = (await listPage.getAllListNames()).length;
        await listPage.copyList('Test Lista Renombrada');
        await page.waitForTimeout(2000);
        
        const finalCount = (await listPage.getAllListNames()).length;
        expect(finalCount).toBeGreaterThan(initialCount);
    });
    
    test('Archivar lista', async () => {
        await listPage.archiveList('Test Lista 2');
        await page.waitForTimeout(1000);
        expect(await listPage.listExists('Test Lista 2')).toBe(false);
    });
    
    test('Eliminar lista archivada', async () => {
        await listPage.deleteArchivedList('Test Lista 2');
        await page.waitForTimeout(1000);
        expect(await listPage.listExists('Test Lista 2')).toBe(false);
    });
    

    test.afterAll(async () => {
        try {
            console.log('Cerrando navegador...');
            await page.close();
        } catch (e) {
            console.log('Navegador cerrado');
        }
    });
});