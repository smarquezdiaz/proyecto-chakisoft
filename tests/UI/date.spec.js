import { test, expect } from '@playwright/test';
const BoardPage = require('../../pages/BoardPageCardTre');
const CardModalPage = require('../../pages/CardModalPage');
const testData = require('../../data/datesTestData.json');
const { shortWait } = require('../../utils/waits');

test.describe.configure({ mode: 'serial' });
test.describe('Flujo completo de fechas en tarjeta', () => {
  let boardPage;
  let cardModalPage;

  test.beforeEach(async ({ page }) => {
    boardPage = new BoardPage(page);
    cardModalPage = new CardModalPage(page);
    await boardPage.navigateToBoard();
  });

  for (const scenario of testData.dateScenarios) {
    test(`${scenario.testName}`, async ({ page }) => {
      
      await boardPage.openAgregarCard();
      
      await cardModalPage.openDatesModal();
      await shortWait(page);

      await cardModalPage.setStartDate(scenario.startDate);
      await expect(cardModalPage.startDateCheckbox).toHaveAttribute('aria-checked', 'true');

      await cardModalPage.setDueDate(scenario.dueDate);
      await cardModalPage.setTime(scenario.time);

      await cardModalPage.selectReminder(scenario.reminder);
      await shortWait(page);

      await cardModalPage.saveButton.click();
      await expect(cardModalPage.dueDateMenuButton).toBeHidden({ timeout: 10000 });

      await expect(cardModalPage.dueDateBadge).toBeVisible({ timeout: 10000 });

      await cardModalPage.removeDate();
      await shortWait(page);

      await expect(cardModalPage.cardBackDueDateBadge).toBeHidden({ timeout: 10000 });
    });
  }
});
