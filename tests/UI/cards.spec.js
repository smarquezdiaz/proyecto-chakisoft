// tests/UI/cards.spec.js
import { test, expect } from "../../fixtures/card.fixture.js";
import data from "../../data/cards.json" assert { type: "json" };

test.setTimeout(60_000);

test.describe("Gestión de Tarjetas en Trello", () => {
  test("Verificar que se puede crear y archivar una tarjeta", async ({
    cardPage,
    uniqueTitle,
  }) => {
    // 1. Navegar al tablero
    await cardPage.irAlTablero(data.boardUrl);

    // 2. Crear la tarjeta
    await cardPage.crearTarjetaEnLista(data.listName, uniqueTitle);

    // 3. Verificar que la tarjeta se creó correctamente
    await cardPage.verificarTarjetaExiste(data.listName, uniqueTitle);

    // 4. Archivar la tarjeta
    await cardPage.archivarTarjetaDesdeLista(data.listName, uniqueTitle);

    // 5. Verificar que la tarjeta fue archivada
    await cardPage.verificarTarjetaNoExiste(data.listName, uniqueTitle);
  });

  test("Verificar creación de múltiples tarjetas", async ({
    cardPage,
    uniqueTitle,
  }) => {
    // 1. Navegar al tablero
    await cardPage.irAlTablero(data.boardUrl);

    // 2. Crear primera tarjeta
    const titulo1 = `${uniqueTitle}-1`;
    await cardPage.crearTarjetaEnLista(data.listName, titulo1);
    await cardPage.verificarTarjetaExiste(data.listName, titulo1);

    // 3. Crear segunda tarjeta
    const titulo2 = `${uniqueTitle}-2`;
    await cardPage.crearTarjetaEnLista(data.listName, titulo2);
    await cardPage.verificarTarjetaExiste(data.listName, titulo2);

    // 4. Limpiar: archivar ambas tarjetas
    await cardPage.archivarTarjetaDesdeLista(data.listName, titulo1);
    await cardPage.archivarTarjetaDesdeLista(data.listName, titulo2);

    // 5. Verificar que fueron archivadas
    await cardPage.verificarTarjetaNoExiste(data.listName, titulo1);
    await cardPage.verificarTarjetaNoExiste(data.listName, titulo2);
  });
});
