// pages/CardPage.js
const { expect } = require("@playwright/test");

class CardPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.addCardButton = (listName) =>
      page
        .locator(
          `//h2//span[text()="${listName}"]/ancestor::li//button[@data-testid="list-add-card-button"]`
        )
        .first();
    this.cardTitleInput = page
      .locator('textarea[data-testid="list-card-composer-textarea"]')
      .first();
    this.submitCardButton = page
      .locator('button[data-testid="list-card-composer-add-card-button"]')
      .first();
  }

  async createCard(listName, title) {
    await this.addCardButton(listName).click();
    await this.cardTitleInput.fill(title);
    await this.submitCardButton.click();
    await this.page.waitForTimeout(1500);
  }

  async openCard(title) {
    const card = this.page
      .locator(`a[data-testid="card-name"]:has-text("${title}")`)
      .first();
    await card.waitFor({ state: "visible", timeout: 5000 });
    await card.click();
    await this.page.waitForTimeout(1000);
  }

  async renameCard(oldTitle, newTitle) {
    await this.openCard(oldTitle);
    const titleField = this.page.locator(
      'textarea[data-testid="card-back-title-input"]'
    );
    await titleField.waitFor({ state: "visible", timeout: 5000 });
    await titleField.fill(newTitle);
    await titleField.press("Enter");
    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press("Escape");
  }

  async archiveCard(title) {
    await this.openCard(title);

    const actionsMenu = this.page
      .locator('button[aria-label="Acciones"]')
      .first();
    await actionsMenu.click();
    await this.page.waitForTimeout(500);

    const archiveBtn = this.page.locator('button:has-text("Archivar")').first();
    await archiveBtn.waitFor({ state: "visible", timeout: 5000 });
    await archiveBtn.click();
    await this.page.waitForTimeout(1500);

    await this.page.keyboard.press("Escape");
  }

  async cardExists(title) {
    const card = this.page
      .locator(`a[data-testid="card-name"]:has-text("${title}")`)
      .first();
    return await card.isVisible().catch(() => false);
  }
}

module.exports = { CardPage };
