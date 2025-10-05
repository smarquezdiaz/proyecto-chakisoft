import { test as base } from "@playwright/test";
import { CardPageApi } from "../pages/CardPageApi.js";
import { ridApi } from "../utils/random.js";

export const test = base.extend({
  card: async ({}, use) => {
    const cardPage = new CardPageApi();

    // Función helper para crear tarjeta con longitud dinámica
    async function createRandomCard(length = 6) {
      const name = ridApi(length);
      const card = await cardPage.createCard(name, "Tarjeta de prueba");
      return card;
    }

    // Pasamos el objeto card con helpers al test
    await use({
      createRandomCard,
      deleteCard: async (cardId) => {
        try {
          const res = await cardPage.deleteCard(cardId);
          return res;
        } catch (err) {
          console.log("⚠ No se pudo eliminar tarjeta:", err.message);
          return null;
        }
      },
    });
  },
});
