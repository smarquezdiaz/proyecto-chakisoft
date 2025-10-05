// tests/UI/checklist-edit-delete.spec.js
import { test, expect } from '@playwright/test';
const BoardPage = require('../../../pages/BoardPageCardTre');
const CardModalPage = require('../../../pages/CardModalPage');
const testData = require('../../../data/checklistTestDataUI.json');
const { shortWait, mediumWait } = require('../../../utils/waits');

test.describe.configure({ mode: 'serial' });
test.describe('Checklist - Editar y Eliminar ', () => {
  let boardPage;
  let cardModalPage;

  test.beforeEach(async ({ page }) => {
    boardPage = new BoardPage(page);
    cardModalPage = new CardModalPage(page);
    await boardPage.navigateToBoard();
    await page.waitForLoadState('networkidle');
  });

  for (const editData of testData.editOperations) {
    test(`${editData.testName}`, async ({ page }) => {
      await boardPage.openCard(editData.cardName);
      // await mediumWait(page);
       await page.waitForTimeout(2000);

      await expect(cardModalPage.addToCardButton).toBeVisible({ timeout: 15000 });

      await cardModalPage.createChecklist(editData.checklistName);
      // await mediumWait(page);
       await page.waitForTimeout(2000);

      const initialItems = [
        editData.originalItem,
        ...editData.itemsToCheck.filter(item => item !== editData.updatedItem)
      ];

      for (const item of initialItems) {
        await cardModalPage.addCheckItem(item);
        // await shortWait(page);
         await page.waitForTimeout(2000);
      }

      await cardModalPage.cancelCheckItemEdition();
      // await shortWait(page);
       await page.waitForTimeout(2000);

      const initialItem = cardModalPage.getCheckItemByName(editData.originalItem);
      await expect(initialItem.first()).toBeVisible({ timeout: 15000 });

      await cardModalPage.editCheckItem(editData.originalItem, editData.updatedItem);
      // await mediumWait(page);
       await page.waitForTimeout(2000);

      const updatedItem = cardModalPage.getCheckItemByName(editData.updatedItem);
      await expect(updatedItem.first()).toBeVisible({ timeout: 15000 });

      for (const itemToCheck of editData.itemsToCheck) {
        await cardModalPage.checkItem(itemToCheck);
        // await shortWait(page);
         await page.waitForTimeout(2000);
      }

      await cardModalPage.hideCompletedItems();
      // await shortWait(page);
       await page.waitForTimeout(2000);

      await cardModalPage.deleteChecklist(editData.checklistName);
      // await shortWait(page);
       await page.waitForTimeout(2000);
      await page.keyboard.press('Escape');
      // await shortWait(page);
       await page.waitForTimeout(2000);
    });
  }
});
