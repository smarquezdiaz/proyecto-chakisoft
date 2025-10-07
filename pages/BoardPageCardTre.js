const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class BoardPage extends BasePage {
    constructor(page) {
        super(page);
        this.boardUrl = 'https://trello.com/b/cyHNgtZC/proyecto-final';
        this.cardLocator = (cardName) => this.page.locator('a[data-testid="card-name"]').filter({ hasText: cardName });
    }
    
    async navigateToBoard() {
        await this.goto(this.boardUrl);
    }

    async openCard(cardName) {
        await this.click(this.cardLocator(cardName));
    }

    async openAgregarCard() {
        await this.openCard('Agregar');
    }

    async openTarjetaCard() {
        await this.openCard('m');
    }
}

module.exports = BoardPage;