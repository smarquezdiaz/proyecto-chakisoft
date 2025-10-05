const { expect } = require('@playwright/test');

class BoardPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.boardUrl = 'https://trello.com/b/cyHNgtZC/proyecto-final';
        this.cardLocator = (cardName) => this.page.locator('a[data-testid="card-name"]').filter({ hasText: cardName });
    }
    
    async navigateToBoard() {
        await this.page.goto(this.boardUrl);
    }

    async openCard(cardName) {
        await this.cardLocator(cardName).click();
    }

    async openAgregarCard() {
         await this.openCard('Agregar');
     }

    async openTarjetaCard() {
        await this.openCard('m');
  }
}

module.exports = BoardPage;