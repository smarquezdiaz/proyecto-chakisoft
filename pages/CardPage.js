// pages/CardPage.js
const { BasePage } = require("./BasePage.js");
const { ridApi } = require("../utils/random.js");

class CardPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators como funciones
    this.addCardButton = (listName) =>
      this.page
        .locator(
          `//h2//span[text()="${listName}"]/ancestor::li//button[@data-testid="list-add-card-button"]`
        )
        .first();

    this.cardTitleInput = () =>
      this.page
        .locator('textarea[data-testid="list-card-composer-textarea"]')
        .first();

    this.submitCardButton = () =>
      this.page
        .locator('button[data-testid="list-card-composer-add-card-button"]')
        .first();

    this.cardLocator = (title) =>
      this.page
        .locator('a[data-testid="card-name"]')
        .filter({ hasText: title })
        .first();

    this.cardTitleField = () =>
      this.page.locator('textarea[data-testid="card-back-title-input"]');

    this.actionsMenu = () =>
      this.page.locator('button[aria-label="Acciones"]').first();

    this.archiveButton = () =>
      this.page.locator('button:has-text("Archivar")').first();

    this.emptyCardLocator = () =>
      this.page
        .locator(`a[data-testid="card-name"]`)
        .filter({ hasText: /^$/ })
        .first();
  }

  // ==================== UTILIDADES ====================

  generateCardTitle(length) {
    return ridApi(length);
  }

  // ==================== OPERACIONES BÁSICAS ====================

  async createCard(listName, title) {
    await this.click(this.addCardButton(listName));
    await this.fill(this.cardTitleInput(), title);
    await this.click(this.submitCardButton());
    await this.page.waitForTimeout(1500);
  }

  async openCard(title) {
    const card = this.page
      .locator('a[data-testid="card-name"]')
      .filter({ hasText: title })
      .first();

    await card.waitFor({ state: "visible", timeout: 5000 });
    await this.click(card);
    await this.page.waitForTimeout(1000);
  }

  async renameCard(oldTitle, newTitle) {
    await this.openCard(oldTitle);
    const titleField = this.cardTitleField();
    await titleField.waitFor({ state: "visible", timeout: 5000 });
    await this.fill(titleField, newTitle);
    await titleField.press("Enter");
    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press("Escape");
  }

  async archiveCard(title) {
    await this.openCard(title);
    await this.click(this.actionsMenu());
    await this.page.waitForTimeout(500);

    const archiveBtn = this.archiveButton();
    await archiveBtn.waitFor({ state: "visible", timeout: 5000 });
    await this.click(archiveBtn);
    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press("Escape");
  }

  async cardExists(title) {
    return await this.isVisible(this.cardLocator(title));
  }

  // ==================== OPERACIONES DE MODAL ====================

  async isCardModalVisible() {
    const titleField = this.cardTitleField();
    try {
      await titleField.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getCardTitleFromModal() {
    const titleField = this.cardTitleField();
    await titleField.waitFor({ state: "visible", timeout: 5000 });
    return await titleField.inputValue();
  }

  async closeCardModal() {
    await this.page.keyboard.press("Escape");
    await this.page.waitForTimeout(1000);
  }

  // ==================== CASOS NEGATIVOS ====================

  async attemptCreateEmptyCard(listName, emptyName) {
    try {
      await this.page
        .locator(
          `//h2//span[text()="${listName}"]/ancestor::li//button[@data-testid="list-add-card-button"]`
        )
        .first()
        .click();

      await this.page
        .locator('textarea[data-testid="list-card-composer-textarea"]')
        .first()
        .fill(emptyName);

      await this.page
        .locator('button[data-testid="list-card-composer-add-card-button"]')
        .first()
        .click();

      await this.page.waitForTimeout(2000);

      const emptyCard = this.emptyCardLocator();
      const isVisible = await emptyCard
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      if (isVisible) {
        // BUG: Trello permitió crear tarjeta vacía, limpiar
        await emptyCard.click();
        await this.page.waitForTimeout(1000);
        await this.actionsMenu().click();
        await this.archiveButton().click();
        await this.page.waitForTimeout(1500);
        await this.page.keyboard.press("Escape");
        return true; // Se creó (bug)
      }

      return false; // No se creó (comportamiento esperado)
    } catch (error) {
      return false;
    }
  }

  async attemptRenameToEmpty(originalTitle, emptyTitle) {
    try {
      await this.openCard(originalTitle);
      const titleField = this.cardTitleField();
      await titleField.waitFor({ state: "visible", timeout: 5000 });
      await titleField.fill(emptyTitle);
      await titleField.press("Enter");
      await this.page.waitForTimeout(1500);
      await this.page.keyboard.press("Escape");
      await this.page.waitForTimeout(1000);

      // Verificar si el nombre cambió a vacío
      const stillExists = await this.cardExists(originalTitle);
      return !stillExists; // Si ya no existe con el nombre original, se cambió
    } catch (error) {
      return false;
    }
  }

  async attemptOpenNonExistentCard(fakeCardName) {
    try {
      await this.openCard(fakeCardName);
      return true; // Si llegó aquí, se abrió (no debería pasar)
    } catch (error) {
      return false; // No se pudo abrir (comportamiento esperado)
    }
  }

  async attemptRenameNonExistentCard(fakeCardName, newName) {
    try {
      await this.renameCard(fakeCardName, newName);
      return true; // Si llegó aquí, se renombró (no debería pasar)
    } catch (error) {
      return false; // No se pudo renombrar (comportamiento esperado)
    }
  }

  async attemptCreateCardWithSpecialChars(listName, specialCharsName) {
    try {
      await this.page
        .locator(
          `//h2//span[text()="${listName}"]/ancestor::li//button[@data-testid="list-add-card-button"]`
        )
        .first()
        .click();

      await this.page
        .locator('textarea[data-testid="list-card-composer-textarea"]')
        .first()
        .fill(specialCharsName);

      await this.page
        .locator('button[data-testid="list-card-composer-add-card-button"]')
        .first()
        .click();

      await this.page.waitForTimeout(2000);

      const exists = await this.cardExists(specialCharsName);

      if (exists) {
        // Limpiar la tarjeta creada
        await this.archiveCard(specialCharsName);
        await this.page.waitForTimeout(2500);
      }

      return {
        created: exists,
        exists: exists,
      };
    } catch (error) {
      return {
        created: false,
        exists: false,
      };
    }
  }
}

module.exports = { CardPage };
