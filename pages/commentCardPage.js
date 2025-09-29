const { BasePage } = require('./BasePage');

class commentCard extends BasePage {
    constructor(page) {
        super(page);
        //test 14
        this.shareButton = page.locator('button[data-testid="board-share-button"]');
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