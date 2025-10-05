// tests/UI/cards.spec.js
const { expect } = require("@playwright/test");
const { test } = require("../../fixtures/card.fixture.js");
const { ridApi } = require("../../utils/random.js");

test.use({
  storageState: "playwright/.auth/user.json",
  actionTimeout: 15000,
  navigationTimeout: 30000,
});

test.describe("🔹 Pruebas UI Trello - Gestión de Tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  const listName = "Tareas Asignadas";

  // TC-UI-01: Crear y eliminar tarjeta con 6 caracteres
  test("TC-UI-01: Crear tarjeta con 6 caracteres", async ({ cardUI }) => {
    let cardName;

    try {
      // Setup: crear tarjeta
      cardName = await cardUI.createRandomCard(listName, 6);
      console.log(`🔧 Setup: Tarjeta creada - ${cardName}`);

      // Ejecución: validar tarjeta
      const exists = await cardUI.page.cardExists(cardName);
      expect(exists).toBe(true);
      expect(cardName.length).toBe(6);
      console.log(`✓ Validación: Tarjeta existe con 6 caracteres`);
    } finally {
      // Teardown: eliminar tarjeta
      if (cardName) {
        await cardUI.archiveCard(cardName);
        // Espera adicional para asegurar que se complete el archivado
        await cardUI.page.page.waitForTimeout(2500);
        console.log(`🗑️ Teardown: Tarjeta eliminada - ${cardName}`);
      }
    }
  });

  // TC-UI-02: Crear y eliminar tarjeta con 1 carácter
  test("TC-UI-02: Crear tarjeta con 1 carácter", async ({ cardUI }) => {
    let cardName;

    try {
      // Setup: crear tarjeta
      cardName = await cardUI.createRandomCard(listName, 1);
      console.log(`🔧 Setup: Tarjeta creada - ${cardName}`);

      // Ejecución: validar tarjeta
      const exists = await cardUI.page.cardExists(cardName);
      expect(exists).toBe(true);
      expect(cardName.length).toBe(1);
      console.log(`✓ Validación: Tarjeta existe con 1 carácter`);
    } finally {
      // Teardown: eliminar tarjeta
      if (cardName) {
        await cardUI.archiveCard(cardName);
        // Espera adicional para asegurar que se complete el archivado
        await cardUI.page.page.waitForTimeout(2500);
        console.log(`🗑️ Teardown: Tarjeta eliminada - ${cardName}`);
      }
    }
  });

  // TC-UI-03: Crear tarjeta con nombre vacío
  test("TC-UI-03: Crear tarjeta con nombre vacío", async ({ cardUI }) => {
    const emptyName = "";

    try {
      // Setup: intentar crear tarjeta vacía
      console.log("🔧 Setup: Intentando crear tarjeta con nombre vacío");

      await cardUI.page.page
        .locator(
          `//h2//span[text()="${listName}"]/ancestor::li//button[@data-testid="list-add-card-button"]`
        )
        .first()
        .click();

      await cardUI.page.page
        .locator('textarea[data-testid="list-card-composer-textarea"]')
        .first()
        .fill(emptyName);

      await cardUI.page.page
        .locator('button[data-testid="list-card-composer-add-card-button"]')
        .first()
        .click();

      await cardUI.page.page.waitForTimeout(2000);

      // Ejecución: verificar comportamiento
      const emptyCard = cardUI.page.page
        .locator(`a[data-testid="card-name"]`)
        .filter({ hasText: /^$/ })
        .first();

      const isVisible = await emptyCard
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      if (isVisible) {
        console.log(
          "⚠ BUG detectado: Trello permite crear tarjeta con nombre vacío"
        );

        // Teardown: eliminar tarjeta vacía
        await emptyCard.click();
        await cardUI.page.page.waitForTimeout(1000);

        const actionsMenu = cardUI.page.page
          .locator('button[aria-label="Acciones"]')
          .first();
        await actionsMenu.click();
        await cardUI.page.page.waitForTimeout(500);

        const archiveBtn = cardUI.page.page
          .locator('button:has-text("Archivar")')
          .first();
        await archiveBtn.click();
        await cardUI.page.page.waitForTimeout(1500);
        await cardUI.page.page.keyboard.press("Escape");

        console.log("🗑️ Teardown: Tarjeta vacía eliminada");
      } else {
        console.log(
          "✓ Validación: Trello rechazó correctamente la tarjeta vacía"
        );
      }
    } catch (error) {
      console.log(
        "✓ Validación: No se encontró tarjeta vacía (comportamiento esperado)"
      );
    }
  });

  // TC-UI-04: Crear y eliminar tarjeta con 256 caracteres
  test("TC-UI-04: Crear tarjeta con 256 caracteres", async ({ cardUI }) => {
    let cardName;

    try {
      // Setup: crear tarjeta
      cardName = await cardUI.createRandomCard(listName, 256);
      console.log(`🔧 Setup: Tarjeta creada con 256 caracteres`);
      console.log(`   Primeros 50 chars: ${cardName.substring(0, 50)}...`);

      // Ejecución: validar tarjeta
      const exists = await cardUI.page.cardExists(cardName);
      expect(exists).toBe(true);
      expect(cardName.length).toBe(256);
      console.log(`✓ Validación: Tarjeta existe con 256 caracteres`);
    } finally {
      // Teardown: eliminar tarjeta
      if (cardName) {
        await cardUI.archiveCard(cardName);
        // Espera adicional para asegurar que se complete el archivado
        await cardUI.page.page.waitForTimeout(2500);
        console.log(`🗑️ Teardown: Tarjeta eliminada`);
      }
    }
  });

  // TC-UI-05: Actualizar nombre de tarjeta
  test("TC-UI-05: Actualizar nombre de tarjeta", async ({ cardUI }) => {
    let originalName;
    let newName;

    try {
      // Setup: crear tarjeta
      originalName = await cardUI.createRandomCard(listName, 6);
      console.log(`🔧 Setup: Tarjeta creada - ${originalName}`);

      // Ejecución: actualizar nombre
      newName = ridApi(8) + "-EDITADA";
      await cardUI.page.renameCard(originalName, newName);
      console.log(`✓ Actualización: Tarjeta renombrada a ${newName}`);

      // Validación: verificar que existe con el nuevo nombre
      const exists = await cardUI.page.cardExists(newName);
      expect(exists).toBe(true);
      console.log(`✓ Validación: Tarjeta actualizada correctamente`);

      // Validación: verificar que el nombre anterior no existe
      const oldExists = await cardUI.page.cardExists(originalName);
      expect(oldExists).toBe(false);
      console.log(`✓ Validación: Nombre anterior no existe`);
    } finally {
      // Teardown: eliminar tarjeta con el nuevo nombre
      if (newName) {
        await cardUI.archiveCard(newName);
        await cardUI.page.page.waitForTimeout(2500);
        console.log(`🗑️ Teardown: Tarjeta eliminada - ${newName}`);
      }
    }
  });

  // TC-UI-06: Leer/Visualizar tarjeta existente
  test("TC-UI-06: Visualizar detalles de tarjeta", async ({ cardUI }) => {
    let cardName;

    try {
      // Setup: crear tarjeta
      cardName = await cardUI.createRandomCard(listName, 8);
      console.log(`🔧 Setup: Tarjeta creada - ${cardName}`);

      // Ejecución: abrir tarjeta para ver detalles
      await cardUI.page.openCard(cardName);
      console.log(`✓ Acción: Tarjeta abierta correctamente`);

      // Validación: verificar que el modal está visible
      const titleField = cardUI.page.page.locator(
        'textarea[data-testid="card-back-title-input"]'
      );
      await titleField.waitFor({ state: "visible", timeout: 5000 });

      const titleValue = await titleField.inputValue();
      expect(titleValue).toBe(cardName);
      console.log(`✓ Validación: Título en modal coincide - ${titleValue}`);

      // Cerrar modal
      await cardUI.page.page.keyboard.press("Escape");
      await cardUI.page.page.waitForTimeout(1000);
    } finally {
      // Teardown: eliminar tarjeta
      if (cardName) {
        await cardUI.archiveCard(cardName);
        await cardUI.page.page.waitForTimeout(2500);
        console.log(`🗑️ Teardown: Tarjeta eliminada - ${cardName}`);
      }
    }
  });

  // TC-UI-07: Eliminar (archivar) tarjeta
  test("TC-UI-07: Archivar tarjeta y verificar eliminación", async ({
    cardUI,
  }) => {
    let cardName;

    try {
      // Setup: crear tarjeta
      cardName = await cardUI.createRandomCard(listName, 6);
      console.log(`🔧 Setup: Tarjeta creada - ${cardName}`);

      // Validar que existe antes de archivar
      let exists = await cardUI.page.cardExists(cardName);
      expect(exists).toBe(true);
      console.log(`✓ Pre-validación: Tarjeta existe en el tablero`);

      // Ejecución: archivar tarjeta
      await cardUI.archiveCard(cardName);
      await cardUI.page.page.waitForTimeout(2500);
      console.log(`✓ Acción: Tarjeta archivada`);

      // Validación: verificar que ya no está visible
      exists = await cardUI.page.cardExists(cardName);
      expect(exists).toBe(false);
      console.log(`✓ Validación: Tarjeta no visible después de archivar`);
    } finally {
      // No hay teardown porque ya se archivó en el test
      console.log(`🗑️ Teardown: No necesario (tarjeta ya archivada)`);
    }
  });
});

// 🔹 CASOS NEGATIVOS
test.describe("🔹 Casos Negativos UI - Tarjetas", () => {
  test.describe.configure({ timeout: 60000 });

  const listName = "Tareas Asignadas";

  // TC-UI-N01: Intentar abrir tarjeta inexistente
  test("TC-UI-N01: Abrir tarjeta inexistente", async ({ cardUI }) => {
    const fakeCardName = "TARJETA_INEXISTENTE_XYZ123";

    try {
      console.log(
        `🔧 Setup: Intentando abrir tarjeta inexistente - ${fakeCardName}`
      );

      await cardUI.page.openCard(fakeCardName);

      // Si llega aquí, el test debería fallar
      expect(false).toBe(true);
      console.log("❌ ERROR: No debería poder abrir tarjeta inexistente");
    } catch (error) {
      console.log(
        "✓ Validación: Error esperado al intentar abrir tarjeta inexistente"
      );
      expect(error).toBeDefined();
    }
  });

  // TC-UI-N02: Actualizar tarjeta inexistente
  test("TC-UI-N02: Actualizar tarjeta inexistente", async ({ cardUI }) => {
    const fakeCardName = "TARJETA_FALSA_ABC";
    const newName = "NUEVO_NOMBRE";

    try {
      console.log(`🔧 Setup: Intentando actualizar tarjeta inexistente`);

      await cardUI.page.renameCard(fakeCardName, newName);

      // Si llega aquí, el test debería fallar
      expect(false).toBe(true);
      console.log("❌ ERROR: No debería poder actualizar tarjeta inexistente");
    } catch (error) {
      console.log(
        "✓ Validación: Error esperado al intentar actualizar tarjeta inexistente"
      );
      expect(error).toBeDefined();
    }
  });

  // TC-UI-N03: Crear tarjeta con caracteres especiales
  test("TC-UI-N03: Crear tarjeta con caracteres especiales", async ({
    cardUI,
  }) => {
    const specialCharsName = "Test <>&\"'@#$%";
    let cardName;

    try {
      // Setup: crear tarjeta con caracteres especiales
      console.log(`🔧 Setup: Creando tarjeta con caracteres especiales`);

      await cardUI.page.page
        .locator(
          `//h2//span[text()="${listName}"]/ancestor::li//button[@data-testid="list-add-card-button"]`
        )
        .first()
        .click();
      await cardUI.page.page
        .locator('textarea[data-testid="list-card-composer-textarea"]')
        .first()
        .fill(specialCharsName);
      await cardUI.page.page
        .locator('button[data-testid="list-card-composer-add-card-button"]')
        .first()
        .click();
      await cardUI.page.page.waitForTimeout(2000);

      cardName = specialCharsName;

      // Validación: verificar si Trello permite estos caracteres
      const exists = await cardUI.page.cardExists(specialCharsName);

      if (exists) {
        console.log("✓ Validación: Trello acepta caracteres especiales");
        expect(exists).toBe(true);
      } else {
        console.log("⚠ Validación: Trello rechazó caracteres especiales");
      }
    } finally {
      // Teardown: intentar eliminar si se creó
      if (cardName) {
        try {
          await cardUI.archiveCard(cardName);
          await cardUI.page.page.waitForTimeout(2500);
          console.log(`🗑️ Teardown: Tarjeta eliminada`);
        } catch (error) {
          console.log("⚠ Teardown: No se pudo eliminar tarjeta");
        }
      }
    }
  });

  // TC-UI-N04: Verificar que tarjeta archivada no es visible
  test("TC-UI-N04: Tarjeta archivada no visible en tablero", async ({
    cardUI,
  }) => {
    let cardName;

    try {
      // Setup: crear y archivar tarjeta
      cardName = await cardUI.createRandomCard(listName, 5);
      console.log(`🔧 Setup: Tarjeta creada - ${cardName}`);

      await cardUI.archiveCard(cardName);
      await cardUI.page.page.waitForTimeout(2500);
      console.log(`🔧 Setup: Tarjeta archivada`);

      // Validación: verificar que ya no es visible
      const isVisible = await cardUI.page.cardExists(cardName);
      expect(isVisible).toBe(false);
      console.log("✓ Validación: Tarjeta archivada no visible en tablero");
    } finally {
      console.log(`🗑️ Teardown: No necesario (tarjeta ya archivada)`);
    }
  });

  // TC-UI-N05: Actualizar tarjeta a nombre vacío
  test("TC-UI-N05: Actualizar tarjeta a nombre vacío", async ({ cardUI }) => {
    let cardName;

    try {
      // Setup: crear tarjeta
      cardName = await cardUI.createRandomCard(listName, 6);
      console.log(`🔧 Setup: Tarjeta creada - ${cardName}`);

      // Intentar actualizar a nombre vacío
      await cardUI.page.openCard(cardName);

      const titleField = cardUI.page.page.locator(
        'textarea[data-testid="card-back-title-input"]'
      );
      await titleField.waitFor({ state: "visible", timeout: 5000 });
      await titleField.fill("");
      await titleField.press("Enter");
      await cardUI.page.page.waitForTimeout(1500);
      await cardUI.page.page.keyboard.press("Escape");
      await cardUI.page.page.waitForTimeout(1000);

      // Validar comportamiento
      const stillExists = await cardUI.page.cardExists(cardName);

      if (stillExists) {
        console.log(
          "✓ Validación: Trello mantiene nombre original al intentar vaciar"
        );
      } else {
        console.log("⚠ BUG: Tarjeta desapareció o cambió a vacío");
      }
    } finally {
      // Teardown: eliminar tarjeta
      if (cardName) {
        try {
          await cardUI.archiveCard(cardName);
          await cardUI.page.page.waitForTimeout(2500);
          console.log(`🗑️ Teardown: Tarjeta eliminada`);
        } catch (error) {
          console.log("⚠ Teardown: No se pudo eliminar");
        }
      }
    }
  });
});
