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

}
module.exports = { BoardSharePage };