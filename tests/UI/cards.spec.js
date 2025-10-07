// tests/UI/cards.spec.js
const { allure } = require("allure-playwright");
import { test, expect } from "../../fixtures/card.fixture.js";

test.use({
  storageState: "playwright/.auth/user.json",
  actionTimeout: 15000,
  navigationTimeout: 30000,
});

// ==================== PRUEBAS POSITIVAS ====================

test.describe("Suite de pruebas para crear tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar creacion exitosa de tarjeta con 6 caracteres", async ({
    createCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("smoke, regression, positive");

    // Llamar a la función pasando la longitud deseada
    const {
      pageObject: cardPage,
      cardTitle,
      listName,
    } = await createCardPage(6);

    await cardPage.createCard(listName, cardTitle);

    const exists = await cardPage.cardExists(cardTitle);
    expect(exists).toBe(true);
    expect(cardTitle.length).toBe(6);
  });

  test("Verificar creacion exitosa de tarjeta con 1 caracter", async ({
    createCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("smoke, regression, positive");

    // Llamar a la función pasando la longitud deseada
    const {
      pageObject: cardPage,
      cardTitle,
      listName,
    } = await createCardPage(1);

    await cardPage.createCard(listName, cardTitle);

    const exists = await cardPage.cardExists(cardTitle);
    expect(exists).toBe(true);
    expect(cardTitle.length).toBe(1);
  });

  test("Verificar que no permita crear tarjeta con nombre vacio", async ({
    negativeCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("smoke, regression, negative");

    const cardPage = negativeCardPage.pageObject;
    const listName = negativeCardPage.listName;
    const emptyName = "";

    const canCreate = await cardPage.attemptCreateEmptyCard(
      listName,
      emptyName
    );
    expect(canCreate).toBe(false);
  });

  test("Verificar creacion exitosa de tarjeta con 256 caracteres", async ({
    createCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("smoke, regression, positive");

    // Llamar a la función pasando la longitud deseada
    const {
      pageObject: cardPage,
      cardTitle,
      listName,
    } = await createCardPage(256);

    await cardPage.createCard(listName, cardTitle);

    const exists = await cardPage.cardExists(cardTitle);
    expect(exists).toBe(true);
    expect(cardTitle.length).toBe(256);
  });
});

test.describe("Suite de pruebas para editar tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar edicion exitosa de nombre de tarjeta", async ({
    updateCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("smoke, regression, positive");

    const cardPage = updateCardPage.pageObject;
    const originalTitle = updateCardPage.originalTitle;
    const newTitle = updateCardPage.newTitle;

    await cardPage.renameCard(originalTitle, newTitle);

    const newExists = await cardPage.cardExists(newTitle);
    expect(newExists).toBe(true);

    const oldExists = await cardPage.cardExists(originalTitle);
    expect(oldExists).toBe(false);
  });

  test("Verificar que no permita editar tarjeta a nombre vacio", async ({
    updateCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("smoke, regression, negative");

    const cardPage = updateCardPage.pageObject;
    const originalTitle = updateCardPage.originalTitle;
    const emptyTitle = "";

    const canRename = await cardPage.attemptRenameToEmpty(
      originalTitle,
      emptyTitle
    );

    expect(canRename).toBe(false);
    const stillExists = await cardPage.cardExists(originalTitle);
    expect(stillExists).toBe(true);
  });
});

test.describe("Suite de pruebas para visualizar tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar visualizacion de detalles de tarjeta", async ({
    readCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("smoke, regression, positive");

    const cardPage = readCardPage.pageObject;
    const cardTitle = readCardPage.cardTitle;

    await cardPage.openCard(cardTitle);

    const isModalVisible = await cardPage.isCardModalVisible();
    expect(isModalVisible).toBe(true);

    const displayedTitle = await cardPage.getCardTitleFromModal();
    expect(displayedTitle).toBe(cardTitle);

    await cardPage.closeCardModal();
  });
});

test.describe("Suite de pruebas para archivar tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar archivado exitoso de tarjeta", async ({
    archiveCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("smoke, regression, positive");

    const cardPage = archiveCardPage.pageObject;
    const cardTitle = archiveCardPage.cardTitle;

    let existsBefore = await cardPage.cardExists(cardTitle);
    expect(existsBefore).toBe(true);

    await cardPage.archiveCard(cardTitle);

    let existsAfter = await cardPage.cardExists(cardTitle);
    expect(existsAfter).toBe(false);
  });
});

// ==================== FLUJO E2E ====================

test.describe("Flujo completo de gestion de tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar flujo de crear, editar, visualizar y eliminar tarjeta", async ({
    initCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("e2e");

    const cardTitle = initCardPage.generateCardTitle(6);
    const newTitle = initCardPage.generateCardTitle(8) + "-EDITADA";
    const listName = "Tareas Asignadas";

    // Crear
    await initCardPage.createCard(listName, cardTitle);
    let exists = await initCardPage.cardExists(cardTitle);
    expect(exists).toBe(true);

    // Editar
    await initCardPage.renameCard(cardTitle, newTitle);
    exists = await initCardPage.cardExists(newTitle);
    expect(exists).toBe(true);

    // Visualizar
    await initCardPage.openCard(newTitle);
    const isVisible = await initCardPage.isCardModalVisible();
    expect(isVisible).toBe(true);
    await initCardPage.closeCardModal();

    // Eliminar
    await initCardPage.archiveCard(newTitle);
    exists = await initCardPage.cardExists(newTitle);
    expect(exists).toBe(false);
  });
});

// ==================== PRUEBAS NEGATIVAS ====================

test.describe("Casos Negativos - Tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar error al abrir tarjeta inexistente", async ({
    negativeCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("regression, negative");

    const cardPage = negativeCardPage.pageObject;
    const fakeCardName = "TARJETA_INEXISTENTE_XYZ123";

    const canOpen = await cardPage.attemptOpenNonExistentCard(fakeCardName);
    expect(canOpen).toBe(false);
  });

  test("Verificar error al actualizar tarjeta inexistente", async ({
    negativeCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("regression, negative");

    const cardPage = negativeCardPage.pageObject;
    const fakeCardName = "TARJETA_FALSA_ABC";
    const newName = "NUEVO_NOMBRE";

    const canRename = await cardPage.attemptRenameNonExistentCard(
      fakeCardName,
      newName
    );
    expect(canRename).toBe(false);
  });

  test("Verificar comportamiento con caracteres especiales", async ({
    negativeCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("regression, negative");

    const cardPage = negativeCardPage.pageObject;
    const listName = negativeCardPage.listName;
    const specialCharsName = "Test <>&\"'@#$%";

    const result = await cardPage.attemptCreateCardWithSpecialChars(
      listName,
      specialCharsName
    );

    if (result.created) {
      expect(result.exists).toBe(true);
    }
  });

  test("Verificar que tarjeta archivada no es visible en tablero", async ({
    archiveCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("regression, negative");

    const cardPage = archiveCardPage.pageObject;
    const cardTitle = archiveCardPage.cardTitle;

    await cardPage.archiveCard(cardTitle);

    const isVisible = await cardPage.cardExists(cardTitle);
    expect(isVisible).toBe(false);
  });
});
