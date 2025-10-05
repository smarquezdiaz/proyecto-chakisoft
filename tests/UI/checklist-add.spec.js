import { test, expect } from '@playwright/test';
const BoardPage = require('../../pages/BoardPageCardTre');
const CardModalPage = require('../../pages/CardModalPage');
const testData = require('../../data/checklistTestDataUI.json');
const { shortWait, mediumWait } = require('../../utils/waits');

test.describe.configure({ mode: 'serial' });
test.describe('Checklist - Agregar ', () => {
  let boardPage;
  let cardModalPage;

  test.beforeEach(async ({ page }) => {
    boardPage = new BoardPage(page);
    cardModalPage = new CardModalPage(page);
    await boardPage.navigateToBoard();
    await page.waitForLoadState('networkidle');
  });

  for (const checklistData of testData.checklists) {
    test(`${checklistData.testName}`, async ({ page }) => {
      await boardPage.openCard(checklistData.cardName);
      await mediumWait(page); 

      await expect(cardModalPage.addToCardButton).toBeVisible({ timeout: 15000 });

      await cardModalPage.createChecklist(checklistData.checklistName);
      await mediumWait(page); 
      for (const item of checklistData.items) {
        await cardModalPage.addCheckItem(item);
        await shortWait(page); 
      }
      await cardModalPage.cancelCheckItemEdition();
      await shortWait(page); 
      for (const item of checklistData.items) {
        const checkItem = cardModalPage.getCheckItemByName(item);
        await expect(checkItem.first()).toBeVisible({ timeout: 10000 });
      }
      await cardModalPage.deleteChecklist(checklistData.checklistName);
      await shortWait(page); 
      await page.keyboard.press('Escape');
      await shortWait(page); 
    });
  }
});
