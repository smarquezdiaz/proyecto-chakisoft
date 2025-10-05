// fixtures/card.fixture.js
import { test as base } from "@playwright/test";
import { CardPage } from "../pages/CardPage.js";
import { ridApi } from "../utils/random.js";

export const test = base.extend({
  cardUI: async ({ page }, use) => {
    const cardPage = new CardPage(page);

    // Navegar al tablero de Trello antes de cada test
    await page.goto("https://trello.com/b/9ETDtbZp/wewe");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Función helper para crear tarjeta con nombre aleatorio
    async function createRandomCard(listName, length = 6) {
      const cardName = ridApi(length);
      await cardPage.createCard(listName, cardName);
      return cardName;
    }

    // Pasamos el objeto con helpers al test
    await use({
      page: cardPage,
      createRandomCard,
      archiveCard: async (cardTitle) => {
        try {
          await cardPage.archiveCard(cardTitle);
          console.log(`✓ Tarjeta archivada en teardown: ${cardTitle}`);
        } catch (err) {
          console.log("⚠ No se pudo archivar tarjeta:", err.message);
        }
      },
    });
  },
});
