// tests/UI/cards.spec.js
const { allure } = require("allure-playwright");
import { test, expect } from "../../fixtures/card.fixture.js";
const logger = require("../../utils/logger");

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
    allure.severity("high");

    logger.info("Iniciando test: Creación de tarjeta con 6 caracteres");

    const {
      pageObject: cardPage,
      cardTitle,
      listName,
    } = await createCardPage(6);

    logger.info(`Creando tarjeta '${cardTitle}' en lista '${listName}'`);
    await cardPage.createCard(listName, cardTitle);

    const exists = await cardPage.cardExists(cardTitle);
    expect(exists).toBe(true);
    expect(cardTitle.length).toBe(6);

    logger.success("Tarjeta creada correctamente con 6 caracteres");
  });

  test("Verificar creacion exitosa de tarjeta con 1 caracter", async ({
    createCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test: Creación de tarjeta con 1 caracter");

    const {
      pageObject: cardPage,
      cardTitle,
      listName,
    } = await createCardPage(1);

    logger.info(`Creando tarjeta '${cardTitle}' en lista '${listName}'`);
    await cardPage.createCard(listName, cardTitle);

    const exists = await cardPage.cardExists(cardTitle);
    expect(exists).toBe(true);
    expect(cardTitle.length).toBe(1);

    logger.success("Tarjeta creada correctamente con 1 caracter");
  });

  test("Verificar que no permita crear tarjeta con nombre vacio", async ({
    negativeCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Creación de tarjeta con nombre vacío");

    const cardPage = negativeCardPage.pageObject;
    const listName = negativeCardPage.listName;
    const emptyName = "";

    const canCreate = await cardPage.attemptCreateEmptyCard(
      listName,
      emptyName
    );
    expect(canCreate).toBe(false);

    logger.success("Validación correcta: no se permite crear tarjeta vacía");
  });

  test("Verificar creacion exitosa de tarjeta con 256 caracteres", async ({
    createCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test: Creación de tarjeta con 256 caracteres");

    const {
      pageObject: cardPage,
      cardTitle,
      listName,
    } = await createCardPage(256);

    logger.info(`Creando tarjeta larga '${cardTitle.substring(0, 10)}...'`);
    await cardPage.createCard(listName, cardTitle);

    const exists = await cardPage.cardExists(cardTitle);
    expect(exists).toBe(true);
    expect(cardTitle.length).toBe(256);

    logger.success("Tarjeta creada correctamente con 256 caracteres");
  });
});

test.describe("Suite de pruebas para editar tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar edicion exitosa de nombre de tarjeta", async ({
    updateCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Edición de nombre de tarjeta");

    const cardPage = updateCardPage.pageObject;
    const originalTitle = updateCardPage.originalTitle;
    const newTitle = updateCardPage.newTitle;

    logger.info(`Renombrando tarjeta '${originalTitle}' a '${newTitle}'`);
    await cardPage.renameCard(originalTitle, newTitle);

    const newExists = await cardPage.cardExists(newTitle);
    expect(newExists).toBe(true);

    const oldExists = await cardPage.cardExists(originalTitle);
    expect(oldExists).toBe(false);

    logger.success("Tarjeta renombrada correctamente");
  });

  test("Verificar que no permita editar tarjeta a nombre vacio", async ({
    updateCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test: Intento de renombrar tarjeta a nombre vacío");

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

    logger.success("Validación correcta: no se permite renombrar a vacío");
  });
});

test.describe("Suite de pruebas para visualizar tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar visualizacion de detalles de tarjeta", async ({
    readCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("low");

    logger.info("Iniciando test: Visualización de detalles de tarjeta");

    const cardPage = readCardPage.pageObject;
    const cardTitle = readCardPage.cardTitle;

    await cardPage.openCard(cardTitle);

    const isModalVisible = await cardPage.isCardModalVisible();
    expect(isModalVisible).toBe(true);

    const displayedTitle = await cardPage.getCardTitleFromModal();
    expect(displayedTitle).toBe(cardTitle);

    await cardPage.closeCardModal();

    logger.success("Detalles de tarjeta visualizados correctamente");
  });
});

test.describe("Suite de pruebas para archivar tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  test("Verificar archivado exitoso de tarjeta", async ({
    archiveCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Archivado de tarjeta");

    const cardPage = archiveCardPage.pageObject;
    const cardTitle = archiveCardPage.cardTitle;

    let existsBefore = await cardPage.cardExists(cardTitle);
    expect(existsBefore).toBe(true);

    await cardPage.archiveCard(cardTitle);

    let existsAfter = await cardPage.cardExists(cardTitle);
    expect(existsAfter).toBe(false);

    logger.success("Tarjeta archivada correctamente");
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
    allure.severity("high");

    logger.info("Iniciando test E2E de gestión completa de tarjeta");

    const cardTitle = initCardPage.generateCardTitle(6);
    const newTitle = initCardPage.generateCardTitle(8) + "-EDITADA";
    const listName = "Tareas Asignadas";

    // Crear
    logger.info("Paso 1: Creando tarjeta inicial");
    await initCardPage.createCard(listName, cardTitle);
    let exists = await initCardPage.cardExists(cardTitle);
    expect(exists).toBe(true);

    // Editar
    logger.info("Paso 2: Editando tarjeta creada");
    await initCardPage.renameCard(cardTitle, newTitle);
    exists = await initCardPage.cardExists(newTitle);
    expect(exists).toBe(true);

    // Visualizar
    logger.info("Paso 3: Visualizando tarjeta");
    await initCardPage.openCard(newTitle);
    const isVisible = await initCardPage.isCardModalVisible();
    expect(isVisible).toBe(true);
    await initCardPage.closeCardModal();

    // Eliminar
    logger.info("Paso 4: Archivando tarjeta");
    await initCardPage.archiveCard(newTitle);
    exists = await initCardPage.cardExists(newTitle);
    expect(exists).toBe(false);

    logger.success("Flujo completo E2E ejecutado correctamente");
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
    allure.severity("high");

    logger.info("Iniciando test negativo: apertura de tarjeta inexistente");

    const cardPage = negativeCardPage.pageObject;
    const fakeCardName = "TARJETA_INEXISTENTE_XYZ123";

    const canOpen = await cardPage.attemptOpenNonExistentCard(fakeCardName);
    expect(canOpen).toBe(false);

    logger.success(
      "Validación correcta: no se puede abrir tarjeta inexistente"
    );
  });

  test("Verificar error al actualizar tarjeta inexistente", async ({
    negativeCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info(
      "Iniciando test negativo: actualización de tarjeta inexistente"
    );

    const cardPage = negativeCardPage.pageObject;
    const fakeCardName = "TARJETA_FALSA_ABC";
    const newName = "NUEVO_NOMBRE";

    const canRename = await cardPage.attemptRenameNonExistentCard(
      fakeCardName,
      newName
    );
    expect(canRename).toBe(false);

    logger.success(
      "Validación correcta: no se puede editar tarjeta inexistente"
    );
  });

  test("Verificar comportamiento con caracteres especiales", async ({
    negativeCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test negativo: creación con caracteres especiales");

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

    logger.success("Validación completada para caracteres especiales");
  });

  test("Verificar que tarjeta archivada no es visible en tablero", async ({
    archiveCardPage,
  }) => {
    allure.tag("UI");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test negativo: visibilidad de tarjeta archivada");

    const cardPage = archiveCardPage.pageObject;
    const cardTitle = archiveCardPage.cardTitle;

    await cardPage.archiveCard(cardTitle);

    const isVisible = await cardPage.cardExists(cardTitle);
    expect(isVisible).toBe(false);

    logger.success("Validación correcta: tarjeta archivada no visible");
  });
});
