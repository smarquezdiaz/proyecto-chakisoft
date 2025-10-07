import { test, expect } from '@playwright/test';
const { allure } = require('allure-playwright');
const BoardPage = require('../../../pages/BoardPageCardTre');
const CardModalPage = require('../../../pages/CardModalPage');
const testData = require('../../../data/datesTestData.json');
const logger = require('../../../utils/logger');

test.describe.configure({ mode: 'serial' });
test.describe('Flujo fechas @smoke @regression @positive', () => {
  let boardPage;
  let cardModalPage;

  test.beforeEach(async ({ page }) => {
    allure.owner('Diego Lomar');
    allure.severity('normal');
    
    boardPage = new BoardPage(page);
    cardModalPage = new CardModalPage(page);
    
    logger.info('Navegando al tablero');
    await boardPage.navigateToBoard();
    logger.success('Tablero cargado correctamente');
  });

  for (const scenario of testData.dateScenarios) {
    test(`${scenario.testName}`, async ({ page }) => {
      logger.info(`Iniciando test: ${scenario.testName}`);
      
      logger.info('Abriendo tarjeta para agregar fechas');
      await boardPage.openAgregarCard();
      logger.success('Tarjeta abierta correctamente');
      
      logger.info('Abriendo modal de fechas');
      await cardModalPage.openDatesModal();
      logger.success('Modal de fechas abierto');
      
      logger.info(`Estableciendo fecha de inicio: ${scenario.startDate}`);
      await cardModalPage.setStartDate(scenario.startDate);
      await expect(cardModalPage.startDateCheckbox).toHaveAttribute('aria-checked', 'true');
      logger.success('Fecha de inicio establecida correctamente');
      
      logger.info(`Estableciendo fecha de vencimiento: ${scenario.dueDate}`);
      await cardModalPage.setDueDate(scenario.dueDate);
      logger.success('Fecha de vencimiento establecida correctamente');
      
      logger.info(`Estableciendo hora: ${scenario.time}`);
      await cardModalPage.setTime(scenario.time);
      logger.success('Hora establecida correctamente');
      
      logger.info(`Seleccionando recordatorio: ${scenario.reminder}`);
      await cardModalPage.selectReminder(scenario.reminder);
      logger.success('Recordatorio seleccionado correctamente');
      
      logger.info('Guardando configuración de fechas');
      await cardModalPage.saveButton.click();
      await expect(cardModalPage.dueDateMenuButton).toBeHidden({ timeout: 10000 });
      await expect(cardModalPage.dueDateBadge).toBeVisible({ timeout: 10000 });
      logger.success('Fechas guardadas correctamente');
      
      logger.info('Removiendo fecha de vencimiento');
      await cardModalPage.removeDate();
      
      logger.info('Verificando que la fecha fue removida');
      await expect(cardModalPage.cardBackDueDateBadge).toBeHidden({ timeout: 10000 });
      logger.success('Fecha removida correctamente');
      
      logger.success('Test completado exitosamente');
    });
  }
});