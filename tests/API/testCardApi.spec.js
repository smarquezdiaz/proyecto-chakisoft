import { expect } from "@playwright/test";
import { CardPageApi } from "../../pages/CardPageApi.js";
import { rid, ridApi } from "../../utils/random.js";
import { test } from "../../fixtures/cardApi.fixture.js";

import * as trelloApi from "../../utils/trelloCardApi.js";

const listId = "68db01e9fbe399759fd2561b";

test.describe("🔹 Pruebas API Trello - Gestión de Tarjetas", () => {
  test.describe.configure({ mode: "serial" });

  let cardPage;
  let createdCardId = null;

  test.beforeAll(async () => {
    cardPage = new CardPageApi();
  });

  // TC01 - Crear tarjeta
  test("TC01 - Crear una tarjeta en la lista", async () => {
    const uniqueName = rid("Tarjeta TC_N");
    const card = await cardPage.createCard(uniqueName, "Descripción de prueba");

    expect(card).toHaveProperty("name", uniqueName);
    expect(card).toHaveProperty("idList", cardPage.listId);
    createdCardId = card.id;
    console.log(`✓ Tarjeta creada: ${uniqueName} (${createdCardId})`);
  });

  // TC02 - Obtener tarjeta
  test("TC02 - Obtener tarjeta creada", async () => {
    expect(createdCardId).not.toBeNull();

    const card = await cardPage.getCard(createdCardId);
    expect(card).toHaveProperty("id", createdCardId);
    console.log(`✓ Tarjeta obtenida: ${card.name}`);
  });

  // TC03 - Actualizar tarjeta
  test("TC03 - Actualizar tarjeta creada", async () => {
    expect(createdCardId).not.toBeNull();

    const newName = rid("Tarjeta TC_A");
    const updated = await cardPage.updateCard(createdCardId, newName);

    expect(updated).toHaveProperty("name", newName);
    console.log(`✓ Tarjeta actualizada a: ${newName}`);
  });

  // TC04 - Eliminar tarjeta
  test("TC04 - Eliminar tarjeta creada", async () => {
    expect(createdCardId).not.toBeNull();

    const res = await cardPage.deleteCard(createdCardId);

    // Verificar que Trello respondió con la estructura esperada
    expect(res).toHaveProperty("limits");
    expect(res.limits).toEqual({}); // vacío

    console.log(`✓ Tarjeta eliminada (${createdCardId})`);

    // Extra: confirmar que ya no existe
    await expect(async () => {
      await cardPage.getCard(createdCardId);
    }).rejects.toThrow(/Error al obtener tarjeta: 404/);
  });

  //Metodo POST

  test("TC01 - Crear tarjeta con 1 caracter", async ({ card }) => {
    const newCard = await card.createRandomCard(1);
    expect(newCard.name.length).toBe(1); // validamos que tenga 1 char
    console.log(`✓ Tarjeta creada con nombre: ${newCard.name}`);

    await card.deleteCard(newCard.id); // teardown
  });

  test("TC02 - Crear tarjeta con 6 caracteres", async ({ card }) => {
    const newCard = await card.createRandomCard(6);
    expect(newCard.name.length).toBe(6); // validamos que tenga 6 chars
    console.log(`✓ Tarjeta creada con nombre: ${newCard.name}`);

    await card.deleteCard(newCard.id); // teardown
  });

  test("TC03 - Crear tarjeta con nombre largo (256 chars)", async ({
    card,
  }) => {
    const longName = ridApi(256); // ahora sí está importado
    const newCard = await card.createRandomCard(256);

    expect(newCard.name.length).toBe(256);
    console.log(
      `✓ Tarjeta creada con nombre largo (${newCard.name.length} chars)`
    );

    await card.deleteCard(newCard.id); // teardown
  });

  //Metodo GET

  test("GET-TC04 - Obtener tarjeta existente", async ({ card }) => {
    const newCard = await card.createRandomCard(6);
    const fetched = await trelloApi.getCard(newCard.id);

    expect(fetched).toHaveProperty("id", newCard.id);
    expect(fetched).toHaveProperty("name", newCard.name);
    console.log(`✓ Tarjeta obtenida: ${fetched.name}`);

    await card.deleteCard(newCard.id);
  });

  //Metodo UPDATE

  test("PUT-TC05 - Actualizar tarjeta existente", async ({ card }) => {
    const newCard = await card.createRandomCard(6);
    const updated = await trelloApi.updateCard(
      newCard.id,
      "Tarjeta Actualizada Test"
    );
    expect(updated).toHaveProperty("name", "Tarjeta Actualizada Test");
    console.log(`✓ Tarjeta actualizada correctamente: ${updated.name}`);

    await card.deleteCard(newCard.id);
  });
  //Metodo DELETE

  test("DELETE-TC06 - Eliminar tarjeta existente", async ({ card }) => {
    const newCard = await card.createRandomCard(6);
    const res = await card.deleteCard(newCard.id);
    expect(res).toHaveProperty("limits");
    expect(res.limits).toEqual({});
    console.log(`✓ Tarjeta eliminada correctamente (${newCard.id})`);

    // Extra: validar que ya no existe
    await expect(async () => {
      await trelloApi.getCard(newCard.id);
    }).rejects.toThrow(/404/);
  });
});

//Test negativos
test.describe("🔹 Casos negativos de APIKey y Token", () => {
  //Metodo POST
  test("TC-N01 - Crear tarjeta con APIKey inválido", async () => {
    const res = await trelloApi.createCardInvalidKey(listId, "InvalidKeyTest");
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid key"); // el body es texto plano
    console.log("✓ APIKey inválido rechazado correctamente");
  });

  test("TC-N02 - Crear tarjeta con Token inválido", async () => {
    const res = await trelloApi.createCardInvalidToken(
      listId,
      "InvalidTokenTest"
    );
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid app token"); // validar texto
    console.log("✓ Token inválido rechazado correctamente");
  });

  test("TC-N03 - Crear tarjeta con nombre vacío (BUG)", async ({ card }) => {
    const emptyName = "";
    const newCard = await card.createRandomCard(0);

    if (newCard && newCard.id) {
      // Trello devolvió 200 (BUG)
      console.warn(
        "⚠ BUG detectado: Trello permite crear tarjeta con nombre vacío (status 200)"
      );
      expect(newCard.name).toBe(""); // validamos que efectivamente está vacío

      await card.deleteCard(newCard.id);
    } else {
      expect(newCard).toBeUndefined();
    }
  });

  //Metodo GET

  test("GET-N04 - Obtener tarjeta con ID inexistente", async () => {
    const fakeId = "1234567890abcdef12345678";
    const res = await trelloApi.getCardInvalidId(fakeId);

    expect(res.status).toBe(404);
    expect(res.body).toContain("The requested resource was not found");
    console.log("✓ GET rechazado correctamente con ID inexistente");
  });

  test("GET-N05 - Obtener tarjeta con APIKey inválido", async ({ card }) => {
    const newCard = await card.createRandomCard(4);
    const res = await trelloApi.getCardInvalidKey(newCard.id);
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid key");
    console.log("✓ GET rechazado correctamente con APIKey inválido");
    await card.deleteCard(newCard.id);
  });

  test("GET-N06 - Obtener tarjeta con Token inválido", async ({ card }) => {
    const newCard = await card.createRandomCard(4);
    const res = await trelloApi.getCardInvalidToken(newCard.id);
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid app token");
    console.log("✓ GET rechazado correctamente con Token inválido");
    await card.deleteCard(newCard.id);
  });

  //Metodo UPDATE

  test("PUT-N07 - Actualizar tarjeta con APIKey inválido", async ({ card }) => {
    const newCard = await card.createRandomCard(6);

    const res = await trelloApi.updateCardInvalidKey(
      newCard.id,
      "Nombre FailKey"
    );
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid key");
    console.log("✓ PUT rechazado con APIKey inválida");
    await card.deleteCard(newCard.id);
  });

  test("PUT-N08 - Actualizar tarjeta con Token inválido", async ({ card }) => {
    const newCard = await card.createRandomCard(6);

    const res = await trelloApi.updateCardInvalidToken(
      newCard.id,
      "Nombre FailToken"
    );
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid app token");
    console.log("✓ PUT rechazado con Token inválido");
    await card.deleteCard(newCard.id);
  });

  test("PUT-N03 - Actualizar tarjeta con ID inexistente", async () => {
    const fakeId = "1234567890abcdef12345678";
    const res = await trelloApi.updateCardInvalidId(fakeId, "NombreInvalido");

    expect([400, 404]).toContain(res.status); // puede ser 400 o 404
    expect(
      res.body.includes("invalid id") || res.body.includes("not found")
    ).toBeTruthy();
    console.log("✓ PUT rechazado con ID inexistente");
  });

  //Metodo DELETE

  test("DELETE-N01 - Eliminar tarjeta con APIKey inválido", async ({
    card,
  }) => {
    const newCard = await card.createRandomCard(6);

    const res = await trelloApi.deleteCardInvalidKey(newCard.id);
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid key");
    console.log("✓ DELETE rechazado con APIKey inválida");

    await card.deleteCard(newCard.id);
  });

  test("DELETE-N02 - Eliminar tarjeta con Token inválido", async ({ card }) => {
    const newCard = await card.createRandomCard(6);

    const res = await trelloApi.deleteCardInvalidToken(newCard.id);
    expect(res.status).toBe(401);
    expect(res.body).toContain("invalid app token");
    console.log("✓ DELETE rechazado con Token inválido");

    await card.deleteCard(newCard.id);
  });

  test("DELETE-N03 - Eliminar tarjeta con ID inexistente", async () => {
    const fakeId = "1234567890abcdef12345678";
    const res = await trelloApi.deleteCardInvalidId(fakeId);

    expect([400, 404]).toContain(res.status);
    expect(
      res.body.includes("invalid id") || res.body.includes("not found")
    ).toBeTruthy();
    console.log("✓ DELETE rechazado con ID inexistente");
  });
});
