import { expect } from "@playwright/test";

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
        await this.submitBtn.click();
        await expect(this.page.getByText(`${title}`)).toBeVisible();
    }

    async deleteBoard(title) {
        await this.page.waitForTimeout(3000); // Waits for 3 seconds
        const openBoardBtn = this.page.getByRole('a', { hasText: `${title}` });
        await this.page.waitForSelector('button[aria-label="Mostrar menú"]');
        const openMenuBtn = this.page.locator('button[aria-label="Mostrar menú"]')
        await this.page.waitForTimeout(3000);
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
        // const openBoardBtn = this.page.getByRole('a', { hasText: `${title}` });
        // await openBoardBtn.click();
        const input = this.page.locator('[data-testid="board-name-input"]');
        await input.fill(newTitle);
        const h1Content = this.page.locator('[data-testid="board-name-display"]');
        await expect(h1Content).toHaveText(newTitle);
    }
}