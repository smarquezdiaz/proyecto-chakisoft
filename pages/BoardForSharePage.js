const { BasePage } = require('./BasePage');

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
    async writeUser(name, ok) {
        await this.shareButton.click();
        await this.addMembers.fill(name);
        await this.addMembers.press('Space');
        await this.addMembers.press('Backspace');
        if (ok === true) {
            await this.suggestions.first().click();
            await this.inviteButton.click();
        }
    }

    async menuLabel() {
        await this.menuButtonPage.click();
        await this.menuLabelPage.click();
    }

    async createLabel(nameLabel) {
        await this.newLabel.click();
        await this.nameLabel.fill(nameLabel);
        await this.page.keyboard.press('Enter');
    }

    async getLastLabelAria() {
        return await this.labelsExist.last().getAttribute('aria-label');
    }

    async editLastLabel(newName, color) {
        await this.labelsExist.last().click();
        await this.nameLabel.fill(newName);
        await this.page.locator(`button[data-testid="color-tile-${color}"]`).click();
        await this.page.keyboard.press('Enter');
    }

    async deleteLabel() {
        await this.labelsExist.last().click();
        await this.deleteButton.click();
        await this.deleteButton.click();
    }
}
module.exports = { BoardSharePage };