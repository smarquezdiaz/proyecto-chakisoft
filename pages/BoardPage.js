import { test, expect } from "@playwright/test";

export class BoardPage {

    constructor(page) {
        this.page = page;
        this.createBtn = page.locator('[data-testid="header-create-menu-button"]');
        this.createBoardBtn = page.locator('[data-testid="header-create-board-button"]');
        this.nameField = page.locator('[data-testid="create-board-title-input"]');
        this.submitBtn = page.locator('[data-testid="create-board-submit-button"]');
    }

    async goTo() {
        await this.page.goto('https://trello.com/u/lomardiego17/boards');
    }

    async createBoard(title) {
        await this.createBtn.click();
        await this.createBoardBtn.click();
        await this.nameField.fill(title);
        if (title == "") {
            await expect(this.submitBtn).toBeDisabled();
            return;
        }
        if (title.length > 16384) {
            return;
        }
        await this.submitBtn.click();
        await expect(this.page.getByText(`${title}`)).toBeVisible();
    }

    async deleteBoard(title) {
        const openBoardBtn = this.page.getByRole('a', { hasText: `${title}` });
        await this.page.waitForSelector('button[aria-label="Mostrar menú"]');
        const openMenuBtn = this.page.locator('button[aria-label="Mostrar menú"]')
        await openMenuBtn.click();
        const closeBtn = this.page.locator('span[aria-label="Cerrar tablero"]')
        await closeBtn.click();
        const confirmDeleteBtn = this.page.locator('[data-testid="popover-close-board-confirm"]');
        await confirmDeleteBtn.click();
        await this.goTo();
        await expect(openBoardBtn).toHaveCount(0);
    }

    async openBoard(title) {
        const openBoardLink = this.page.getByRole('link', { name: `${title}` }).first();
        await openBoardLink.click();
        await expect(this.page.getByText(`${title}`).first()).toBeVisible();
    }

    async updateBoard(title, newTitle) {
        const boardNameDisplay = this.page.locator('[data-testid="board-name-display"]');
        await boardNameDisplay.click();
        const input = this.page.locator('[data-testid="board-name-input"]');
        await input.fill(newTitle);
        await input.press('Enter');
        if (newTitle == "") {
            const h1Content = this.page.locator('[data-testid="board-name-display"]');
            await expect(h1Content).toHaveText(title);
            return;
        }
        const h1Content = this.page.locator('[data-testid="board-name-display"]');
        await expect(h1Content).toHaveText(newTitle);
    }

    async addFavorite(title) {
        const contenedorTablero = this.page.locator(`.Dm9SyZvpL8MyK1:has-text("${title}")`);
        const botonEstrella = contenedorTablero.locator('[data-testid="board-star"]').first();
        await botonEstrella.click();
    }

    async deleteClosedBoards() {
        const deleteBtn = this.page.getByText('Ver todos los tableros cerrados');
        await deleteBtn.click();
        const boardItemsLocator = this.page.locator('ul.g8RdqvgKdVNk0C > li.d0sKN6fe14jaBa');
        const initialCount = await boardItemsLocator.count();
         console.log(initialCount);
        if (initialCount === 0) {
            return;
        }
        while (await boardItemsLocator.count() > 0) {
            const firstBoardItem = boardItemsLocator.first();
            const deleteButton = firstBoardItem.locator('[data-testid="close-board-delete-board-button"]');
            await deleteButton.click();
            const confirmDeleteButton = this.page.locator('[data-testid="close-board-delete-board-confirm-button"]');
            await page.waitForSelector('[data-testid="close-board-delete-board-confirm-button"]', { state: 'visible' });
            await confirmDeleteButton.click();
            await firstBoardItem.waitFor({ state: 'detached', timeout: 5000 });
        }
        const finalCount = await boardItemsLocator.count();
        expect(finalCount).toBe(0);
    }
}