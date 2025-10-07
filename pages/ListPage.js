const { expect } = require('@playwright/test');
const { UIHelpers } = require('../utils/helperListUI');

class ListPage {
  constructor(page) {
    this.page = page;
    this.helpers = new UIHelpers(page);

    
    this.selectors = {
      addListButton: 'button[data-testid="list-composer-button"]',
      listNameInput: 'textarea[data-testid="list-name-textarea"]',
      submitListButton: 'button[data-testid="list-composer-add-list-button"]',
      listWrapper: 'li[data-testid="list-wrapper"]',
      listNameHeader: 'h2[data-testid="list-name"]',
      listMenuButton: 'button[data-testid="list-edit-menu-button"]',
      moveListButton: 'button[data-testid="list-actions-move-list-button"]',
      copyListButton: 'button[data-testid="list-actions-copy-list-button"]',
      archiveListButton: 'button[data-testid="list-actions-archive-list-button"]',
      followListButton: 'button[data-testid="list-actions-watch-list-button"]',
      boardSelect: '#move-list-screen-board-options-select',
      positionSelect: 'input[id="move-list-screen-position-select"]',
      submitMoveButton: 'button[type="submit"]:has-text("Mover")'
    };
  }

  
  getAddListButton(position = 'first') {
    const locator = this.page.locator(this.selectors.addListButton);
    return position === 'first' ? locator.first() : locator.last();
  }

  
  async createList(name) {
    await this.getAddListButton().click();

    const nameInput = this.page.locator(this.selectors.listNameInput).first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill(name);

    await this.page.locator(this.selectors.submitListButton).first().click();

    await expect(
      this.page.locator(`${this.selectors.listNameHeader}:has-text("${name}")`).first()
    ).toBeVisible();
  }

  
  async renameList(oldName, newName) {
    const list = await this.findListByName(oldName);
    const headerButton = list.locator(`${this.selectors.listNameHeader} button`).first();
    await headerButton.click();

    const textarea = this.page.locator(this.selectors.listNameInput).first();
    await expect(textarea).toBeVisible();

    await textarea.selectText();
    await textarea.fill(newName);
    await textarea.press('Enter');

    await expect(
      this.page.locator(`${this.selectors.listNameHeader}:has-text("${newName}")`).first()
    ).toBeVisible();
  }

  
  async openListMenu(listName) {
    const list = await this.findListByName(listName);
    await list.scrollIntoViewIfNeeded();

    const menuButton = list.locator(this.selectors.listMenuButton).first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(1500);
  }

  
  async moveListToPosition(listName, targetPosition) {
    await this.openListMenu(listName);

    const moveButton = this.page.locator(this.selectors.moveListButton).first();
    await moveButton.click();

    const positionInput = this.page.locator(this.selectors.positionSelect).first();
    await expect(positionInput).toBeVisible();
    await positionInput.click();

    const option = this.page.locator(`li:text-is("${targetPosition}")`).first();
    await expect(option).toBeVisible();
    await option.click();

    const submitButton = this.page.locator(this.selectors.submitMoveButton).first();
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    await expect(submitButton).not.toBeVisible();
  }

  
  async archiveList(listName) {
    await this.openListMenu(listName);
    const archiveButton = this.page.locator(this.selectors.archiveListButton).first();
    await archiveButton.click();

    const archivedList = this.page.locator(`${this.selectors.listWrapper}:has-text("${listName}")`);
    await expect(archivedList).not.toBeVisible();
  }

  
  async listExists(name) {
    const names = await this.getAllListNames();
    return names.includes(name);
  }

  
  async getAllListNames() {
    const lists = await this.page.locator(this.selectors.listWrapper).all();
    const names = [];

    for (const list of lists) {
      try {
        const nameSpan = list.locator(`${this.selectors.listNameHeader} span`).first();
        const name = await nameSpan.innerText();
        names.push(name.trim());
      } catch (e) {}
    }

    return names;
  }

  
  async findListByName(name) {
    const lists = await this.page.locator(this.selectors.listWrapper).all();

    for (const list of lists) {
      try {
        const nameSpan = list.locator(`${this.selectors.listNameHeader} span`).first();
        const currentName = await nameSpan.innerText();

        if (currentName.trim() === name) {
          return list;
        }
      } catch (e) {}
    }

    throw new Error(`Lista "${name}" no encontrada`);
  }

  
  async cleanup(listNames) {
    for (const name of listNames) {
      try {
        if (await this.listExists(name)) {
          await this.archiveList(name);
          console.log(` Lista "${name}" archivada para limpieza`);
        }
      } catch (e) {
        console.log(` No se pudo limpiar la lista: ${name}`);
      }
    }
  }
}

module.exports = { ListPage };
