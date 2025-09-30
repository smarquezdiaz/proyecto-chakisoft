import { expect } from "@playwright/test";

export class BoardPage{

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

    async createBoard(title) { // TODO aumentar luego otros parametros para tc
        await this.createBtn.click();
        await this.createBoardBtn.click();
        await this.nameField.fill(title);
        await this.submitBtn.click();
        // TODO verificar titulo 
        await expect(this.page.getByText(`${title}`)).toBeVisible();
    }

    async deleteBoard(title) {
        const openBoardBtn = this.page.getByRole('a', { hasText: `${title}` });
        // await openBoardBtn.click();
        const openMenuBtn = this.page.locator('button[aria-label="Mostrar menú"]')
        await openMenuBtn.click();
        const closeBtn = this.page.locator('span[aria-label="Cerrar tablero"]')
        await closeBtn.click();
        const confirmDeleteBtn =  this.page.locator('[data-testid="popover-close-board-confirm"]');
        await confirmDeleteBtn.click();
        await this.goTo();
        await expect(openBoardBtn).toHaveCount(0);
    }
}