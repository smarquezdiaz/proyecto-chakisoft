import { expect } from "@playwright/test";
import { CardPageApi } from "../../pages/CardPageApi.js";
import { rid, ridApi } from "../../utils/random.js";
import { test } from "../../fixtures/cardApi.fixture.js";
import * as trelloApi from "../../utils/trelloCardApi.js";

const { allure } = require("allure-playwright");
const logger = require("../../utils/logger");

const listId = "68db01e9fbe399759fd2561b";

test.describe("Pruebas API Trello - Gestión de Tarjetas", () => {
  test.describe.configure({ mode: "serial" });

  let cardPage;
  let createdCardId = null;

  test.beforeAll(async () => {
    cardPage = new CardPageApi();
  });

  test("TC01 - Verificar que se Cree una tarjeta en la lista", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Crear tarjeta en lista");

    const uniqueName = rid("Tarjeta TC_N");
    logger.info(`Creando tarjeta con nombre: ${uniqueName}`);
    const card = await cardPage.createCard(uniqueName, "Descripción de prueba");

    expect(card).toHaveProperty("name", uniqueName);
    expect(card).toHaveProperty("idList", cardPage.listId);
    createdCardId = card.id;

    logger.success(
      `Tarjeta creada correctamente: ${uniqueName} (${createdCardId})`
    );
  });

  test("TC02 - Verificar que se obtenga una tarjeta creada", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Obtener tarjeta existente");
    expect(createdCardId).not.toBeNull();

    logger.info(`Obteniendo tarjeta con ID: ${createdCardId}`);
    const card = await cardPage.getCard(createdCardId);

    expect(card).toHaveProperty("id", createdCardId);
    logger.success(`Tarjeta obtenida correctamente: ${card.name}`);
  });

  test("TC03 - Actualizar tarjeta creada en la lista", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Actualizar tarjeta existente");
    expect(createdCardId).not.toBeNull();

    const newName = rid("Tarjeta TC_A");
    logger.info(`Actualizando tarjeta a nuevo nombre: ${newName}`);
    const updated = await cardPage.updateCard(createdCardId, newName);

    expect(updated).toHaveProperty("name", newName);
    logger.success(`Tarjeta actualizada correctamente a: ${newName}`);
  });

  test("TC04 - Verifica que se elimine una tarjeta creada", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Eliminar tarjeta existente");
    expect(createdCardId).not.toBeNull();

    logger.info(`Eliminando tarjeta con ID: ${createdCardId}`);
    const res = await cardPage.deleteCard(createdCardId);
    expect(res).toHaveProperty("limits");
    expect(res.limits).toEqual({});

    logger.success(`Tarjeta eliminada correctamente (${createdCardId})`);

    // Confirmar que ya no existe
    logger.info("Verificando que la tarjeta ya no existe");
    await expect(async () => {
      await cardPage.getCard(createdCardId);
    }).rejects.toThrow(/Error al obtener tarjeta: 404/);
    logger.success("Validación de eliminación completada");
  });

  // Metodo POST

  test("TC01 - Verificar que se cree una tarjeta con 1 caracter", async ({
    card,
  }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test: Crear tarjeta con 1 carácter");

    const newCard = await card.createRandomCard(1);
    expect(newCard.name.length).toBe(1);

    logger.success(`Tarjeta creada con 1 carácter: ${newCard.name}`);
    await card.deleteCard(newCard.id);
  });

  test("TC02 - Verificar que se cree una tarjeta con 6 caracteres", async ({
    card,
  }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test: Crear tarjeta con 6 caracteres");

    const newCard = await card.createRandomCard(6);
    expect(newCard.name.length).toBe(6);

    logger.success(`Tarjeta creada con 6 caracteres: ${newCard.name}`);
    await card.deleteCard(newCard.id);
  });

  test("TC03 - Crear tarjeta con nombre largo (256 chars)", async ({
    card,
  }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test: Crear tarjeta con 256 caracteres");

    const longName = ridApi(256);
    const newCard = await card.createRandomCard(256);

    expect(newCard.name.length).toBe(256);
    logger.success(
      `Tarjeta creada con nombre largo (${newCard.name.length} chars)`
    );

    await card.deleteCard(newCard.id);
  });

  // Metodo GET

  test("GET-TC04 - Obtener tarjeta existente", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Obtener tarjeta existente");

    const newCard = await card.createRandomCard(6);
    logger.info(`Obteniendo tarjeta con ID: ${newCard.id}`);
    const fetched = await trelloApi.getCard(newCard.id);

    expect(fetched).toHaveProperty("id", newCard.id);
    expect(fetched).toHaveProperty("name", newCard.name);
    logger.success(`Tarjeta obtenida correctamente: ${fetched.name}`);

    await card.deleteCard(newCard.id);
  });

  // Metodo UPDATE

  test("PUT-TC05 - Actualizar tarjeta existente", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Actualizar tarjeta existente");

    const newCard = await card.createRandomCard(6);
    logger.info(
      `Actualizando tarjeta ${newCard.id} a "Tarjeta Actualizada Test"`
    );
    const updated = await trelloApi.updateCard(
      newCard.id,
      "Tarjeta Actualizada Test"
    );

    expect(updated).toHaveProperty("name", "Tarjeta Actualizada Test");
    logger.success(`Tarjeta actualizada correctamente: ${updated.name}`);

    await card.deleteCard(newCard.id);
  });

  // Metodo DELETE

  test("DELETE-TC06 - Eliminar tarjeta existente", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test: Eliminar tarjeta existente");

    const newCard = await card.createRandomCard(6);
    logger.info(`Eliminando tarjeta con ID: ${newCard.id}`);
    const res = await card.deleteCard(newCard.id);

    expect(res).toHaveProperty("limits");
    expect(res.limits).toEqual({});
    logger.success(`Tarjeta eliminada correctamente (${newCard.id})`);

    // Extra: validar que ya no existe
    logger.info("Verificando que la tarjeta ya no existe");
    await expect(async () => {
      await trelloApi.getCard(newCard.id);
    }).rejects.toThrow(/404/);
    logger.success("Validación de eliminación completada");
  });
});

// Test negativos
test.describe("Casos negativos de APIKey y Token", () => {
  // Metodo POST

  test("TC-N01 - Crear tarjeta con APIKey inválido", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test negativo: Crear tarjeta con APIKey inválido");

    const res = await trelloApi.createCardInvalidKey(listId, "InvalidKeyTest");
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid key");

    logger.success("APIKey inválido rechazado correctamente");
  });

  test("TC-N02 - Crear tarjeta con Token inválido", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test negativo: Crear tarjeta con Token inválido");

    const res = await trelloApi.createCardInvalidToken(
      listId,
      "InvalidTokenTest"
    );
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid app token");

    logger.success("Token inválido rechazado correctamente");
  });

  test("TC-N03 - Crear tarjeta con nombre vacío", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test negativo: Crear tarjeta con nombre vacío");

    const emptyName = "";
    const newCard = await card.createRandomCard(0);

    if (newCard && newCard.id) {
      logger.warn(
        "BUG detectado: Trello permite crear tarjeta con nombre vacío (status 200)"
      );
      expect(newCard.name).toBe("");
      await card.deleteCard(newCard.id);
    } else {
      expect(newCard).toBeUndefined();
      logger.success("Validación correcta: no se permite crear tarjeta vacía");
    }
  });

  // Metodo GET

  test("GET-N04 - Obtener tarjeta con ID inexistente", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test negativo: Obtener tarjeta con ID inexistente");

    const fakeId = "1234567890abcdef12345678";
    const res = await trelloApi.getCardInvalidId(fakeId);

    expect(res.status).toBe(404);
    expect(res.body).toContain("The requested resource was not found");

    logger.success("GET rechazado correctamente con ID inexistente");
  });

  test("GET-N05 - Obtener tarjeta con APIKey inválido", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test negativo: Obtener tarjeta con APIKey inválido");

    const newCard = await card.createRandomCard(4);
    const res = await trelloApi.getCardInvalidKey(newCard.id);

    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid key");

    logger.success("GET rechazado correctamente con APIKey inválido");
    await card.deleteCard(newCard.id);
  });

  test("GET-N06 - Obtener tarjeta con Token inválido", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test negativo: Obtener tarjeta con Token inválido");

    const newCard = await card.createRandomCard(4);
    const res = await trelloApi.getCardInvalidToken(newCard.id);

    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid app token");

    logger.success("GET rechazado correctamente con Token inválido");
    await card.deleteCard(newCard.id);
  });

  // Metodo UPDATE

  test("PUT-N07 - Actualizar tarjeta con APIKey inválido", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info(
      "Iniciando test negativo: Actualizar tarjeta con APIKey inválido"
    );

    const newCard = await card.createRandomCard(6);
    const res = await trelloApi.updateCardInvalidKey(
      newCard.id,
      "Nombre FailKey"
    );

    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid key");

    logger.success("PUT rechazado correctamente con APIKey inválida");
    await card.deleteCard(newCard.id);
  });

  test("PUT-N08 - Actualizar tarjeta con Token inválido", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info(
      "Iniciando test negativo: Actualizar tarjeta con Token inválido"
    );

    const newCard = await card.createRandomCard(6);
    const res = await trelloApi.updateCardInvalidToken(
      newCard.id,
      "Nombre FailToken"
    );

    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid app token");

    logger.success("PUT rechazado correctamente con Token inválido");
    await card.deleteCard(newCard.id);
  });

  test("PUT-N03 - Actualizar tarjeta con ID inexistente", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info(
      "Iniciando test negativo: Actualizar tarjeta con ID inexistente"
    );

    const fakeId = "1234567890abcdef12345678";
    const res = await trelloApi.updateCardInvalidId(fakeId, "NombreInvalido");

    expect([400, 404]).toContain(res.status);
    expect(
      res.body.includes("invalid id") || res.body.includes("not found")
    ).toBeTruthy();

    logger.success("PUT rechazado correctamente con ID inexistente");
  });

  // Metodo DELETE

  test("DELETE-N01 - Eliminar tarjeta con APIKey inválido", async ({
    card,
  }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info(
      "Iniciando test negativo: Eliminar tarjeta con APIKey inválido"
    );

    const newCard = await card.createRandomCard(6);
    const res = await trelloApi.deleteCardInvalidKey(newCard.id);

    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid key");

    logger.success("DELETE rechazado correctamente con APIKey inválida");
    await card.deleteCard(newCard.id);
  });

  test("DELETE-N02 - Eliminar tarjeta con Token inválido", async ({ card }) => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("high");

    logger.info("Iniciando test negativo: Eliminar tarjeta con Token inválido");

    const newCard = await card.createRandomCard(6);
    const res = await trelloApi.deleteCardInvalidToken(newCard.id);

    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid app token");

    logger.success("DELETE rechazado correctamente con Token inválido");
    await card.deleteCard(newCard.id);
  });

  test("DELETE-N03 - Eliminar tarjeta con ID inexistente", async () => {
    allure.tag("API");
    allure.owner("Gualberto Choque Choque");
    allure.severity("medium");

    logger.info("Iniciando test negativo: Eliminar tarjeta con ID inexistente");

    const fakeId = "1234567890abcdef12345678";
    const res = await trelloApi.deleteCardInvalidId(fakeId);

    expect([400, 404]).toContain(res.status);
    expect(
      res.body.includes("invalid id") || res.body.includes("not found")
    ).toBeTruthy();

    logger.success("DELETE rechazado correctamente con ID inexistente");
  });
});
