// fixtures/card.fixture.js
import { test as base } from "@playwright/test";
import { CardPage } from "../pages/CardPage.js";
import { ridApi } from "../utils/random.js";

const BOARD_URL = "https://trello.com/b/9ETDtbZp/wewe";
const LIST_NAME = "Tareas Asignadas";

export const test = base.extend({
  // Fixture básica: solo navegación inicial
  initCardPage: async ({ page }, use, testInfo) => {
    const cardPage = new CardPage(page);
    await page.goto(BOARD_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await use(cardPage);
  },

  // Fixture para tests de creación (con teardown automático)
  // Ahora recibe la longitud del título como parámetro
  createCardPage: async ({ page }, use, testInfo) => {
    const cardPage = new CardPage(page);
    let cardTitle = null;
    let titleLength = 6; // Valor por defecto

    await page.goto(BOARD_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Función para crear tarjeta con longitud específica
    const createWithLength = async (length) => {
      titleLength = length;
      cardTitle = ridApi(length);
      return {
        pageObject: cardPage,
        cardTitle: cardTitle,
        listName: LIST_NAME,
        titleLength: length,
      };
    };

    await use(createWithLength);

    // Teardown: eliminar la tarjeta creada en el test
    if (cardTitle && !testInfo.title.includes("vacío")) {
      try {
        await cardPage.archiveCard(cardTitle);
        await page.waitForTimeout(2500);
        console.log(
          `✓ Teardown: Tarjeta eliminada - ${cardTitle} (${titleLength} chars)`
        );
      } catch (error) {
        console.log(`⚠ Teardown falló: ${error.message}`);
      }
    }
  },

  // Fixture para tests de actualización (crea tarjeta inicial y limpia la actualizada)
  updateCardPage: async ({ page }, use, testInfo) => {
    const cardPage = new CardPage(page);
    const originalTitle = ridApi(6);
    const newTitle = ridApi(8) + "-EDITADA";

    await page.goto(BOARD_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Setup: crear tarjeta inicial
    await cardPage.createCard(LIST_NAME, originalTitle);
    await page.waitForTimeout(1500);
    console.log(`✓ Setup: Tarjeta creada - ${originalTitle}`);

    await use({
      pageObject: cardPage,
      originalTitle: originalTitle,
      newTitle: newTitle,
      listName: LIST_NAME,
    });

    // Teardown: eliminar tarjeta actualizada o la original si el test falló
    try {
      const titleToDelete =
        testInfo.title === "Verificar edicion exitosa de nombre de tarjeta"
          ? newTitle
          : originalTitle;

      await cardPage.archiveCard(titleToDelete);
      await page.waitForTimeout(2500);
      console.log(`✓ Teardown: Tarjeta eliminada - ${titleToDelete}`);
    } catch (error) {
      console.log(`⚠ Teardown falló: ${error.message}`);
    }
  },

  // Fixture para tests de lectura (crea y limpia tarjeta)
  readCardPage: async ({ page }, use, testInfo) => {
    const cardPage = new CardPage(page);
    const cardTitle = ridApi(8);

    await page.goto(BOARD_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Setup: crear tarjeta
    await cardPage.createCard(LIST_NAME, cardTitle);
    await page.waitForTimeout(1500);
    console.log(`✓ Setup: Tarjeta creada - ${cardTitle}`);

    await use({
      pageObject: cardPage,
      cardTitle: cardTitle,
      listName: LIST_NAME,
    });

    // Teardown: eliminar tarjeta
    try {
      await cardPage.archiveCard(cardTitle);
      await page.waitForTimeout(2500);
      console.log(`✓ Teardown: Tarjeta eliminada - ${cardTitle}`);
    } catch (error) {
      console.log(`⚠ Teardown falló: ${error.message}`);
    }
  },

  // Fixture para test de archivado (solo crea, el test se encarga de archivar)
  archiveCardPage: async ({ page }, use, testInfo) => {
    const cardPage = new CardPage(page);
    const cardTitle = ridApi(6);

    await page.goto(BOARD_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Setup: crear tarjeta
    await cardPage.createCard(LIST_NAME, cardTitle);
    await page.waitForTimeout(1500);
    console.log(`✓ Setup: Tarjeta creada - ${cardTitle}`);

    await use({
      pageObject: cardPage,
      cardTitle: cardTitle,
      listName: LIST_NAME,
    });

    // No hay teardown porque el test mismo archiva la tarjeta
    console.log(`ℹ No teardown: Test archivó la tarjeta - ${cardTitle}`);
  },

  // Fixture para tests negativos (sin tarjeta real)
  negativeCardPage: async ({ page }, use, testInfo) => {
    const cardPage = new CardPage(page);

    await page.goto(BOARD_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await use({
      pageObject: cardPage,
      listName: LIST_NAME,
    });

    // Sin teardown: estos tests no crean tarjetas persistentes
    console.log(`ℹ No teardown: Test negativo sin tarjetas persistentes`);
  },
});

export { expect } from "@playwright/test";
