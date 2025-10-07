const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const logger = require('../utils/logger');

class BoardSharePage extends BasePage {
    constructor(page) {
        super(page);
        //test 1/2
        this.shareButton = page.locator('button[data-testid="board-share-button"]');
        this.addMembers = page.locator('input[data-testid="add-members-input"]');
        this.suggestions = page.locator('div[data-testid="team-invitee-option"]');
        this.inviteButton = page.locator('button[data-testid="team-invite-submit-button"]');
        this.nameMembers = page.locator('[data-testid="member-list-item-full-name"]');
        //test 3
        this.unregistered = page.locator('[class="is-empty-text"]');
        //test 4
        this.createLink = page.getByRole('button', { name: 'Crear enlace' });
        this.linkCopied = page.getByRole('button', { name: 'Copiar enlace' });
        //test 5
        this.deleteLink = page.getByRole('button', { name: 'Eliminar enlace' });
        this.confirmDelete = page.locator('button[data-testid="popover-confirm-button"]');
        //test 7/8/9 10/11/
        this.menuButtonPage = page.locator('button[aria-label="Mostrar menú"]');
        this.menuLabelPage = page.locator('button span[aria-label="Etiquetas"]');
        this.newLabel = page.getByRole('button', { name: 'Crear una etiqueta nueva' });
        this.nameLabel = page.locator('input[id="edit-label-title-input"]');
        this.createLabelButton = page.getByRole('button', { name: /Crear/i });
        this.labelsExist = page.locator('[data-testid="card-label"]');
        //test 12
        this.deleteButton = page.getByRole('button', { name: 'Eliminar' });
        //test 13
        this.enableColorblindButton = page.getByRole('button', { name: 'Habilitar el modo apto para daltónicos' });
        this.disableColorblindButton = page.getByRole('button', { name: 'Deshabilitar el modo apto para daltónicos' });
    }

    async menuLabel() {
        await this.click(this.menuButtonPage); 
        await this.click(this.menuLabelPage); 
    }

    async createLabel(nameLabel) {
        await this.click(this.newLabel); 
        await this.fill(this.nameLabel, nameLabel);
        await this.page.keyboard.press('Enter');
    }

    async getLastLabelAria() {
        return await this.labelsExist.last().getAttribute('aria-label');
    }

    async editLastLabel(newName, color) {
        await this.click(this.labelsExist.last());
        await this.fill(this.nameLabel, newName);
        await this.page.locator(`button[data-testid="color-tile-${color}"]`).click();
        await this.page.keyboard.press('Enter');
    }

    async deleteLabel() {
        await this.click(this.labelsExist.last()); 
        await this.click(this.deleteButton); 
        await this.click(this.deleteButton); 
    }

    async writeUser(name, ok) {
        await this.click(this.shareButton); 
        await this.fill(this.addMembers, name);
        await this.addMembers.press('Space');
        await this.addMembers.press('Backspace');
        if (ok === true) {
            await this.click(this.suggestions.first()); 
            await this.click(this.inviteButton); 
        }
    }

    async copyLink() {
        await this.click(this.shareButton);
        await this.click(this.createLink);
    }

    async deleteLinkCopy() {
        await this.click(this.deleteLink);
        await this.click(this.confirmDelete);
    }

    async typeLabel(input, color) {
        const ariaLabel = await this.getLastLabelAria();
        if (input === '') {
            await this.expectInputAndColor(ariaLabel, 'ninguno', color);
        } else {
            await this.expectInputAndColor(ariaLabel, input, color);
        }
    }

    async expectInputAndColor(contains, input, color) {
        await expect(contains).toContain(input);
        await expect(contains).toContain(color);
    }

    async enableColorblind() {
        await this.click(this.enableColorblindButton);
        await expect(this.disableColorblindButton).toBeVisible();

    }

    async disableColorblind() {
        await this.click(this.disableColorblindButton);
        await expect(this.enableColorblindButton).toBeVisible();
    }

    async expectUser(ok) {
        if (ok === true) {
            await expect(this.nameMembers.last()).toHaveText(process.env.NAME_SHARE);
            logger.success('miembro agregado');
        } else {
            await expect(this.unregistered).toBeVisible();
            logger.success('no existe la persona en trello el test funciona');
        }
    }
}
module.exports = { BoardSharePage };