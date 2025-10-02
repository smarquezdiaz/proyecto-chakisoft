// fixtures/card.fixture.js
import { test as base, expect } from "@playwright/test";
import data from "../data/cards.json" assert { type: "json" };
import { rid } from "../utils/random.js";
import { CardPage } from "../pages/CardPage.js";

const BOARD_URL = data.boardUrl;
const LIST_NAME = data.listName || "Tareas Asignadas";

export const test = base.extend({
  // Inyecta el Page Object
  cardPage: async ({ page }, use) => {
    await use(new CardPage(page));
  },

  // Genera un título único para usar en los tests
  uniqueTitle: async ({}, use) => {
    const title = rid("TC");
    await use(title);
  },
});

export { expect };
