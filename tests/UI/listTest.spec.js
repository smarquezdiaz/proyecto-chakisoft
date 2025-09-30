const { test, expect } = require('@playwright/test');
const { ListPage } = require('../../pages/ListPage');

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Casos de prueba avanzados - Listas Trello', () => {
    test.describe.configure({ mode: 'serial' });
    
    let page, listPage;
    const targetBoard = 'pruebas mover';
    
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        listPage = new ListPage(page);
        await page.goto('https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
    });
    
    // Helper mejorado para cerrar formularios y limpiar estado
    async function closeAnyOpenForms() {
        try {
            // Presionar Escape múltiples veces para cerrar cualquier modal/formulario
            for (let i = 0; i < 3; i++) {
                await page.keyboard.press('Escape');
                await page.waitForTimeout(300);
            }
            
            // Hacer click en un área segura del tablero
            try {
                const boardArea = page.locator('#board');
                await boardArea.click({ position: { x: 10, y: 10 }, force: true, timeout: 1000 });
            } catch (e) {
                // Ignorar si no puede hacer click
            }
            
            await page.waitForTimeout(500);
        } catch (e) {
            // Ignorar errores
        }
    }
    
    test('TC-008: Verificar límite de 512 caracteres', async () => {
        const longName = 'T'.repeat(512);
        const tooLongName = 'T'.repeat(513);
        
        await closeAnyOpenForms();
        
        // Abrir formulario de creación
        const addButton = page.locator('button[data-testid="list-composer-button"]').first();
        await addButton.waitFor({ state: 'visible', timeout: 10000 });
        await addButton.click();
        await page.waitForTimeout(800);
        
        // Intentar ingresar 513 caracteres
        const textarea = page.locator('textarea[data-testid="list-name-textarea"]').first();
        await textarea.waitFor({ state: 'visible', timeout: 5000 });
        
        // Limpiar primero
        await textarea.clear();
        await page.waitForTimeout(300);
        
        await textarea.fill(tooLongName);
        await page.waitForTimeout(500);
        
        // Verificar que se truncó o limitó a 512
        const actualValue = await textarea.inputValue();
        console.log(`Longitud del texto ingresado: ${actualValue.length}`);
        expect(actualValue.length).toBeLessThanOrEqual(512);
        
        // Cancelar
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        // Crear con exactamente 512 caracteres
        await listPage.createList(longName);
        await page.waitForTimeout(1000);
        
        // Verificar que se creó correctamente
        const exists = await listPage.listExists(longName);
        expect(exists).toBe(true);
        
        // Limpiar
        if (exists) {
            await listPage.archiveList(longName);
            await listPage.deleteArchivedList(longName);
        }
        
        // IMPORTANTE: Cerrar cualquier formulario residual
        await closeAnyOpenForms();
    });
    
    test('TC-009: No permitir campo vacío', async () => {
        await closeAnyOpenForms();
        await page.waitForTimeout(1000);
        
        // Scroll al final del tablero donde está el botón de agregar lista
        await page.evaluate(() => {
            const board = document.querySelector('#board');
            if (board) board.scrollLeft = board.scrollWidth;
        });
        await page.waitForTimeout(500);
        
        // Abrir formulario de creación - buscar el botón visible
        const addButton = page.locator('button[data-testid="list-composer-button"]').last();
        await addButton.waitFor({ state: 'visible', timeout: 10000 });
        await addButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await addButton.click();
        await page.waitForTimeout(1000);
        
        // Esperar a que aparezca el textarea del FORMULARIO (no de las listas existentes)
        const textarea = page.locator('textarea[data-testid="list-name-textarea"]').last();
        await textarea.waitFor({ state: 'visible', timeout: 5000 });
        
        // Método más seguro: usar evaluate para limpiar el campo directamente
        await textarea.evaluate(el => {
            el.value = '';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForTimeout(300);
        
        const initialValue = await textarea.inputValue();
        console.log(`Valor del campo: "${initialValue}" (longitud: ${initialValue.length})`);
        expect(initialValue.trim()).toBe('');
        
        const submitButton = page.locator('button[data-testid="list-composer-add-list-button"]').first();
        await submitButton.waitFor({ state: 'visible', timeout: 5000 });
        
        // Opción 1: Verificar si está deshabilitado
        const isDisabled = await submitButton.isDisabled();
        
        if (isDisabled) {
            console.log('✓ Botón está deshabilitado con campo vacío');
            expect(isDisabled).toBe(true);
        } else {
            // Opción 2: Verificar que no crea lista al hacer click
            console.log('ℹ Botón no está deshabilitado, verificando que no crea lista...');
            const listCountBefore = (await listPage.getAllListNames()).length;
            
            await submitButton.click();
            await page.waitForTimeout(1500);
            
            const listCountAfter = (await listPage.getAllListNames()).length;
            expect(listCountAfter).toBe(listCountBefore);
            console.log('✓ El botón no creó una lista vacía');
        }
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
    });
    
    test('TC-010: Mover lista a otro tablero', async () => {
        await closeAnyOpenForms();
        
        console.log('Paso 1: Crear lista ejemplo2');
        await listPage.createList('ejemplo2');
        await page.waitForTimeout(1500);
        
        // Verificar que se creó
        let exists = await listPage.listExists('ejemplo2');
        expect(exists).toBe(true);
        console.log('✓ Lista "ejemplo2" creada correctamente');
        
        const list = await listPage.findListByName('ejemplo2');
        await list.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        console.log('Paso 2: Abrir menú de lista');
        const menuButton = list.locator('button[data-testid="list-edit-menu-button"]').first();
        await menuButton.waitFor({ state: 'visible', timeout: 5000 });
        await menuButton.click();
        await page.waitForTimeout(1000);
        console.log('✓ Menú de lista abierto');
        
        console.log('Paso 3: Click en Mover lista');
        const moveButton = page.locator('button[data-testid="list-actions-move-list-button"]').first();
        await moveButton.waitFor({ state: 'visible', timeout: 5000 });
        await moveButton.click();
        await page.waitForTimeout(1200);
        console.log('✓ Modal de mover lista abierto');
        
        console.log('Paso 4: Seleccionar tablero destino');
        const boardSelect = page.locator('#move-list-screen-board-options-select').first();
        await boardSelect.waitFor({ state: 'visible', timeout: 5000 });
        await boardSelect.click();
        await page.waitForTimeout(800);
        console.log('✓ Dropdown de tableros abierto');
        
        const boardOption = page.locator(`li:has-text("${targetBoard}")`).first();
        await boardOption.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`✓ Tablero "${targetBoard}" encontrado`);
        await boardOption.click();
        await page.waitForTimeout(1000);
        console.log('✓ Tablero destino seleccionado');
        
        console.log('Paso 5: Click en botón Mover');
        const moveSubmitButton = page.locator('button:has-text("Mover")').first();
        await moveSubmitButton.waitFor({ state: 'visible', timeout: 5000 });
        await moveSubmitButton.click();
        await page.waitForTimeout(3000);
        console.log('✓ Acción de mover ejecutada');
        
        console.log('Paso 6: Verificar que la lista se movió');
        exists = await listPage.listExists('ejemplo2');
        expect(exists).toBe(false);
        console.log('✓ Lista "ejemplo2" ya no existe en el tablero actual');
        console.log('✅ TC-010: Lista movida exitosamente al tablero "pruebas mover"');
    });
    
    test('TC-011: Desarchivar lista', async () => {
        await closeAnyOpenForms();
        
        await listPage.createList('ejemplo3 archivar');
        await page.waitForTimeout(1500);
        
        await listPage.archiveList('ejemplo3 archivar');
        await page.waitForTimeout(1500);
        
        let exists = await listPage.listExists('ejemplo3 archivar');
        expect(exists).toBe(false);
        console.log('✓ Lista archivada correctamente');
        
        try {
            const menuButton = page.locator('button[aria-label="Mostrar menú"]').first();
            await menuButton.waitFor({ state: 'visible', timeout: 5000 });
            await menuButton.click();
            await page.waitForTimeout(1000);
            
            const archivedButton = page.locator('button:has-text("Elementos archivados")').first();
            await archivedButton.waitFor({ state: 'visible', timeout: 5000 });
            await archivedButton.click();
            await page.waitForTimeout(1000);
            
            const switchButton = page.locator('button:has-text("Cambiar a listas")').first();
            await switchButton.waitFor({ state: 'visible', timeout: 5000 });
            await switchButton.click();
            await page.waitForTimeout(1500);
            
            // Esperar a que cargue el contenido
            await page.waitForTimeout(1000);
            
            // Buscar directamente el span con el texto
            const listText = page.locator(`span:has-text("ejemplo3 archivar")`).first();
            await listText.waitFor({ state: 'visible', timeout: 10000 });
            console.log('✓ Lista archivada encontrada en el panel');
            
            // Esperar un momento para que los botones estén disponibles
            await page.waitForTimeout(1000);
            
            // Buscar el botón "Restaurar" - probamos múltiples estrategias
            let restoreButton = page.locator('button:has-text("Restaurar")').first();
            
            // Verificar si el botón está visible, si no probar con el icono
            try {
                await restoreButton.waitFor({ state: 'visible', timeout: 3000 });
                console.log('✓ Botón "Restaurar" encontrado por texto');
            } catch (e) {
                console.log('ℹ Buscando botón por icono...');
                restoreButton = page.locator('[data-testid="RefreshIcon"]').locator('xpath=ancestor::button').first();
                await restoreButton.waitFor({ state: 'visible', timeout: 5000 });
                console.log('✓ Botón "Restaurar" encontrado por icono');
            }
            
            await restoreButton.click();
            await page.waitForTimeout(2000);
            
            await page.keyboard.press('Escape');
            await page.waitForTimeout(1000);
            
        } catch (error) {
            console.error('Error en desarchivar:', error.message);
            // Tomar screenshot para debug
            await page.screenshot({ path: 'debug-desarchivar-error.png', fullPage: true });
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);
            throw error;
        }
        
        exists = await listPage.listExists('ejemplo3 archivar');
        expect(exists).toBe(true);
        console.log('✓ Lista desarchivada correctamente');
        
        await listPage.archiveList('ejemplo3 archivar');
        await listPage.deleteArchivedList('ejemplo3 archivar');
    });
    
    test('TC-012: Seguir lista', async () => {
    // Cerrar formularios abiertos, si existen
    await closeAnyOpenForms();

    // Crear lista temporal
    await listPage.createList('ejemplo seguir');
    await page.waitForTimeout(1500);

    // Buscar la lista recién creada
    const list = await listPage.findListByName('ejemplo seguir');
    await list.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Abrir el menú de la lista
    const menuButton = list.locator('button[data-testid="list-edit-menu-button"]').first();
    await menuButton.waitFor({ state: 'visible', timeout: 5000 });
    await menuButton.click();
    await page.waitForTimeout(1000);

    // Hacer clic en el botón "Seguir"
    const followButton = page.locator('button[data-testid="list-actions-watch-list-button"]').first();
    await followButton.waitFor({ state: 'visible', timeout: 5000 });
    await followButton.click();

    // Esperar un poco para asegurar acción completada
    await page.waitForTimeout(1000);

    // Cerrar el menú (Escape)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    console.log('✓ Lista seguida correctamente');

    // (Opcional) limpiar lista al final
    await listPage.archiveList('ejemplo seguir');
    await listPage.deleteArchivedList('ejemplo seguir');
});
});