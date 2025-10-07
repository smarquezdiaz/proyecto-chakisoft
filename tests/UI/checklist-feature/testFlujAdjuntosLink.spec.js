const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const BoardPage = require('../../../pages/BoardPageCardTre'); 
const CardModalPage = require('../../../pages/CardModalPage');
const testData = require('../../../data/linkTestData.json');
const logger = require('../../../utils/logger');

test.describe.configure({ mode: 'serial' });
test.describe('Agregar y editar adjuntos', () => {
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

  for (const linkData of testData.linkOperations) {
    test(`${linkData.testName}`, async ({ page }) => {
      logger.info(`Iniciando test: ${linkData.testName}`);
      
      logger.info(`Abriendo tarjeta: ${linkData.cardName}`);
      await boardPage.openCard(linkData.cardName);
      await page.waitForTimeout(2000);
      await expect(cardModalPage.addToCardButton).toBeVisible({ timeout: 15000 });
      logger.success('Tarjeta abierta correctamente');

      logger.info('Abriendo modal de adjuntos');
      await cardModalPage.openAttachmentModal();
      await page.waitForTimeout(1500);
      await expect(cardModalPage.linkUrlInput).toBeVisible({ timeout: 15000 });
      logger.success('Modal de adjuntos abierto');

      logger.info(`Agregando link inicial: ${linkData.initialLink.url}`);
      await cardModalPage.addOrEditLink(
        linkData.initialLink.url, 
        linkData.initialLink.text
      );
      await page.waitForTimeout(3000);
      logger.success(`Link agregado: ${linkData.initialLink.text}`);

      logger.info('Editando adjunto de link');
      await cardModalPage.editLinkAttachment();
      await page.waitForTimeout(1500);
      await expect(cardModalPage.linkUrlInput).toBeVisible({ timeout: 15000 });
      
      logger.info(`Actualizando link a: ${linkData.editedLink.url}`);
      await cardModalPage.addOrEditLink(
        linkData.editedLink.url, 
        linkData.editedLink.text, 
        true
      );
      await page.waitForTimeout(3000);
      logger.success(`Link editado correctamente: ${linkData.editedLink.text}`);

      logger.info('Cerrando modal de tarjeta');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      logger.success('Test completado exitosamente');
    });
  }
});

test.describe('Eliminar adjuntos ', () => {
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

  for (const deleteData of testData.deleteOperations) {
    test(`${deleteData.testName}`, async ({ page }) => {
      logger.info(`Iniciando test: ${deleteData.testName}`);
      
      logger.info(`Abriendo tarjeta: ${deleteData.cardName}`);
      await boardPage.openCard(deleteData.cardName);
      await page.waitForTimeout(2000);
      await expect(cardModalPage.addToCardButton).toBeVisible({ timeout: 15000 });
      logger.success('Tarjeta abierta correctamente');

      logger.info(`Buscando adjunto a eliminar: ${deleteData.linkToDelete}`);
      const attachmentLocator = cardModalPage.getAttachmentByUrl(deleteData.linkToDelete);
      await attachmentLocator.first().scrollIntoViewIfNeeded().catch(() => {});
      
      logger.info('Eliminando adjunto de link');
      await cardModalPage.deleteLinkAttachment();
      await page.waitForTimeout(3000);
      
      logger.info('Verificando que el adjunto fue eliminado');
      await expect(attachmentLocator.first()).toBeHidden({ timeout: 15000 });
      logger.success('Adjunto eliminado correctamente');

      logger.info('Cerrando modal de tarjeta');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      logger.success('Test completado exitosamente');
    });
  }
});