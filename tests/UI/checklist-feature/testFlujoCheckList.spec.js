import { test, expect } from '@playwright/test';
const { allure } = require('allure-playwright');
const BoardPage = require('../../../pages/BoardPageCardTre');
const CardModalPage = require('../../../pages/CardModalPage');
const testData = require('../../../data/checklistTestDataUI.json');
const logger = require('../../../utils/logger');

test.describe.configure({ mode: 'serial' });
test.describe('Agregar Checklist @smoke @positive ', () => {
  let boardPage;
  let cardModalPage;

  test.beforeEach(async ({ page }) => {
    allure.owner('Diego Lomar');
    allure.severity('normal');
    
    boardPage = new BoardPage(page);
    cardModalPage = new CardModalPage(page);
    
    logger.info('Navegando al tablero');
    await boardPage.navigateToBoard();
    await page.waitForLoadState('networkidle');
    logger.success('Tablero cargado correctamente');
  });

  for (const checklistData of testData.checklists) {
    test(`${checklistData.testName}`, async ({ page }) => {
      logger.info(`Iniciando test: ${checklistData.testName}`);
      
      logger.info(`Abriendo tarjeta: ${checklistData.cardName}`);
      await boardPage.openCard(checklistData.cardName);
      await expect(cardModalPage.addToCardButton).toBeVisible({ timeout: 15000 });
      logger.success('Tarjeta abierta correctamente');
      
      logger.info(`Creando checklist: ${checklistData.checklistName}`);
      await cardModalPage.createChecklist(checklistData.checklistName);
      logger.success('Checklist creada correctamente');
      
      logger.info(`Agregando ${checklistData.items.length} ítems al checklist`);
      for (const item of checklistData.items) {
        logger.info(`Agregando ítem: ${item}`);
        await cardModalPage.addCheckItem(item);
      }
      logger.success('Todos los ítems agregados correctamente');
      
      logger.info('Cancelando edición de ítem');
      await cardModalPage.cancelCheckItemEdition();
      
      logger.info('Verificando que los ítems sean visibles');
      for (const item of checklistData.items) {
        const checkItem = cardModalPage.getCheckItemByName(item);
        await expect(checkItem.first()).toBeVisible({ timeout: 10000 });
      }
      logger.success('Todos los ítems verificados correctamente');
      
      logger.info(`Eliminando checklist: ${checklistData.checklistName}`);
      await cardModalPage.deleteChecklist(checklistData.checklistName);
      logger.success('Checklist eliminada correctamente');
      
      logger.info('Cerrando modal de tarjeta');
      await page.keyboard.press('Escape');
      logger.success('Test completado exitosamente');
    });
  }
});

test.describe('Editar y Eliminar Checklist  @regression @positive', () => {
  let boardPage;
  let cardModalPage;

  test.beforeEach(async ({ page }) => {
    allure.owner('Diego Lomar');
    allure.severity('normal');
    
    boardPage = new BoardPage(page);
    cardModalPage = new CardModalPage(page);
    
    logger.info('Navegando al tablero');
    await boardPage.navigateToBoard();
    await page.waitForLoadState('networkidle');
    logger.success('Tablero cargado correctamente');
  });

  for (const editData of testData.editOperations) {
    test(`${editData.testName}`, async ({ page }) => {
      logger.info(`Iniciando test: ${editData.testName}`);
      
      logger.info(`Abriendo tarjeta: ${editData.cardName}`);
      await boardPage.openCard(editData.cardName);
      await page.waitForTimeout(2000);
      await expect(cardModalPage.addToCardButton).toBeVisible({ timeout: 15000 });
      logger.success('Tarjeta abierta correctamente');
      
      logger.info(`Creando checklist: ${editData.checklistName}`);
      await cardModalPage.createChecklist(editData.checklistName);
      await page.waitForTimeout(2000);
      logger.success('Checklist creada correctamente');
      
      const initialItems = [
        editData.originalItem,
        ...editData.itemsToCheck.filter(item => item !== editData.updatedItem)
      ];
      
      logger.info(`Agregando ${initialItems.length} ítems iniciales`);
      for (const item of initialItems) {
        logger.info(`Agregando ítem: ${item}`);
        await cardModalPage.addCheckItem(item);
        await page.waitForTimeout(1500);
      }
      logger.success('Ítems iniciales agregados correctamente');

      logger.info('Cancelando edición de ítem');
      await cardModalPage.cancelCheckItemEdition();
      await page.waitForTimeout(1500);
      
      const initialItem = cardModalPage.getCheckItemByName(editData.originalItem);
      
      logger.info(`Editando ítem: ${editData.originalItem} → ${editData.updatedItem}`);
      await cardModalPage.editCheckItem(editData.originalItem, editData.updatedItem);
      await page.waitForTimeout(2000);
      
      const updatedItem = cardModalPage.getCheckItemByName(editData.updatedItem);
      await expect(updatedItem.first()).toBeVisible({ timeout: 15000 });
      logger.success('Ítem editado correctamente');
      
      logger.info(`Marcando ${editData.itemsToCheck.length} ítems como completados`);
      for (const itemToCheck of editData.itemsToCheck) {
        logger.info(`Marcando ítem: ${itemToCheck}`);
        await cardModalPage.checkItem(itemToCheck);
      }
      logger.success('Ítems marcados como completados');
      
      logger.info('Ocultando ítems completados');
      await cardModalPage.hideCompletedItems();
      logger.success('Ítems completados ocultados');
      
      logger.info(`Eliminando checklist: ${editData.checklistName}`);
      await cardModalPage.deleteChecklist(editData.checklistName);
      
      logger.info('Verificando que el checklist fue eliminado');
      await expect(initialItem.first()).toBeHidden({ timeout: 10000 });
      logger.success('Checklist eliminado correctamente');
      
      logger.info('Cerrando modal de tarjeta');
      await page.keyboard.press('Escape');
      logger.success('Test completado exitosamente');
    });
  }
});