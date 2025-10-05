const { test, expect } = require('@playwright/test');
const BoardPage = require('../../pages/BoardPage'); 
const CardModalPage = require('../../pages/CardModalPage');
const testData = require('../../data/linkTestData.json');
const { shortWait, mediumWait, longWait } = require('../../utils/waits');

test.describe.configure({ mode: 'serial' });
test.describe('Agregar y editar adjuntos (URL)', () => {
  let boardPage;
  let cardModalPage;

  test.beforeEach(async ({ page }) => {
    boardPage = new BoardPage(page);
    cardModalPage = new CardModalPage(page);
    await boardPage.navigateToBoard();
    await page.waitForLoadState('networkidle');
  });

  for (const linkData of testData.linkOperations) {
    test(`${linkData.testName}`, async ({ page }) => {
      
      await boardPage.openCard(linkData.cardName);
      await mediumWait(page);

      await expect(cardModalPage.addToCardButton).toBeVisible({ timeout: 15000 });

      await cardModalPage.openAttachmentModal();
      await shortWait(page);

      await expect(cardModalPage.linkUrlInput).toBeVisible({ timeout: 15000 });

      await cardModalPage.addOrEditLink(
        linkData.initialLink.url,
        linkData.initialLink.text
      );
      await longWait(page);

      const initialAttachment = cardModalPage.getAttachmentByUrl(linkData.initialLink.url);
      await expect(initialAttachment.first()).toBeVisible({ timeout: 15000 });

      await cardModalPage.editLinkAttachment();
      await shortWait(page);

      await expect(cardModalPage.linkUrlInput).toBeVisible({ timeout: 15000 });

      await cardModalPage.addOrEditLink(
        linkData.editedLink.url,
        linkData.editedLink.text,
        true 
      );
      await longWait(page);

      await page.keyboard.press('Escape');
      await shortWait(page);
    });
  }
});
