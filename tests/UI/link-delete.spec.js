// tests/UI/link-delete.spec.js
const { test, expect } = require('@playwright/test');
const BoardPage = require('../../pages/BoardPageCardTre'); 
const CardModalPage = require('../../pages/CardModalPage');
const testData = require('../../data/linkTestData.json');
const { shortWait, mediumWait, longWait } = require('../../utils/waits');

test.describe.configure({ mode: 'serial' });
test.describe('Eliminar adjuntos (URL)', () => {
  let boardPage;
  let cardModalPage;

  test.beforeEach(async ({ page }) => {
    boardPage = new BoardPage(page);
    cardModalPage = new CardModalPage(page);
    await boardPage.navigateToBoard();
    await page.waitForLoadState('networkidle');
  });

  for (const deleteData of testData.deleteOperations) {
    test(`${deleteData.testName}`, async ({ page }) => {
      await boardPage.openCard(deleteData.cardName);
      await mediumWait(page); 
      await expect(cardModalPage.addToCardButton).toBeVisible({ timeout: 15000 });


      const attachmentLocator = cardModalPage.getAttachmentByUrl(deleteData.linkToDelete);
      await attachmentLocator.first().scrollIntoViewIfNeeded().catch(() => {});

      await expect(attachmentLocator.first()).toBeVisible({ timeout: 15000 });

      await cardModalPage.deleteLinkAttachment();
      await longWait(page); 

      await expect(attachmentLocator.first()).toBeHidden({ timeout: 15000 });

      await page.keyboard.press('Escape');
      await mediumWait(page); 
    });
  }
});