// fixtures/listFixturesUI.js
const { test: base, expect } = require('@playwright/test');
const { ListPage } = require('../pages/ListPage');
const { UIHelpers } = require('../utils/UI-ListHelpers');

const BOARD_URL = 'https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello';

const test = base.extend({
  listPage: async ({ page }, use) => {
    await use(new ListPage(page));
  },

  uiHelpers: async ({ page }, use) => {
    await use(new UIHelpers(page));
  },

  boardPage: async ({ page }, use) => {
    await page.goto(BOARD_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#board')).toBeVisible();
    await use(page);
  },
  cleanup: async ({ browser }, use) => {
  const context = await browser.newContext({
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  const cleanupFn = async () => {
    try {
      if (page.isClosed()) return;

      console.log('  → Navegando al tablero...');
      await page.goto(BOARD_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      // Archivar todas las listas visibles
      console.log('  → Archivando listas...');
      let listCount = await page.locator('li[data-testid="list-wrapper"]').count();
      console.log(`  → Listas encontradas: ${listCount}`);
      
      while (listCount > 0) {
        try {
          const firstList = page.locator('li[data-testid="list-wrapper"]').first();
          const menuButton = firstList.locator('button[data-testid="list-edit-menu-button"]');
          
          await menuButton.waitFor({ state: 'visible', timeout: 5000 });
          await menuButton.click();
          await page.waitForTimeout(1500);
          
          const archiveButton = page.locator('button[data-testid="list-actions-archive-list-button"]').first();
          await archiveButton.waitFor({ state: 'visible', timeout: 5000 });
          await archiveButton.click();
          await page.waitForTimeout(1500);
          
          console.log(`  → Lista archivada`);
        } catch (err) {
          console.log(`  → Error archivando lista: ${err.message}`);
          break;
        }
        
        listCount = await page.locator('li[data-testid="list-wrapper"]').count();
      }

      // Abrir menú de elementos archivados
      console.log('  → Abriendo elementos archivados...');
      await page.waitForTimeout(1000);
      
      const menuButton = page.locator('button[aria-label="Mostrar menú"]');
      await menuButton.waitFor({ state: 'visible', timeout: 5000 });
      await menuButton.click();
      await page.waitForTimeout(1000);
      
      const archivedButton = page.locator('button:has-text("Elementos archivados")');
      await archivedButton.waitFor({ state: 'visible', timeout: 5000 });
      await archivedButton.click();
      await page.waitForTimeout(1500);
      
      // Cambiar a vista de listas si es necesario
      const listsTab = page.locator('button:has-text("Cambiar a listas")');
      const isListsTabVisible = await listsTab.isVisible().catch(() => false);
      if (isListsTabVisible) {
        await listsTab.click();
        await page.waitForTimeout(1000);
      }

      // Eliminar todas las listas archivadas
      console.log('  → Eliminando listas archivadas...');
      let deletedCount = 0;
      
      for (let i = 0; i < 50; i++) {
        try {
          const deleteBtn = page.locator('button:has([data-testid="TrashIcon"])').first();
          const isVisible = await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false);
          
          if (!isVisible) {
            console.log(`  → No hay más listas para eliminar`);
            break;
          }
          
          await deleteBtn.click();
          await page.waitForTimeout(500);
          
          const confirmButton = page.locator('button:has-text("Eliminar")').last();
          await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
          await confirmButton.click();
          await page.waitForTimeout(500);
          
          deletedCount++;
          console.log(`  → Listas eliminadas: ${deletedCount}`);
        } catch (err) {
          console.log(`  → Error eliminando: ${err.message}`);
          break;
        }
      }
      
      console.log(`   Cleanup completado. Total eliminadas: ${deletedCount}`);
      
    } catch (error) {
      console.log(`   Cleanup error: ${error.message}`);
    } finally {
      try {
        await context.close();
      } catch (e) {}
    }
  };

  await use(cleanupFn);
  await cleanupFn();
}
  
});

module.exports = { test, expect };