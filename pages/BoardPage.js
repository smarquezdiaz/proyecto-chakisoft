const { expect } = require("@playwright/test");
import { BasePage } from "./BasePage"

export class BoardPage extends BasePage {
    boardUrl = 'https://trello.com/u/lomardiego17/boards'; 

    constructor(page) {
        super(page); 
        this.createBtn = page.locator('[data-testid="header-create-menu-button"]');
        this.createBoardBtn = page.locator('[data-testid="header-create-board-button"]');
        this.nameField = page.locator('[data-testid="create-board-title-input"]');
        this.submitBtn = page.locator('[data-testid="create-board-submit-button"]');
        this.openMenuBtn = page.locator('button[aria-label="Mostrar menú"]');
        this.closeBtn = page.locator('span[aria-label="Cerrar tablero"]');
        this.confirmDeleteBtn = page.locator('[data-testid="popover-close-board-confirm"]');
        this.boardNameDisplay = page.locator('[data-testid="board-name-display"]');
        this.boardNameInput = page.locator('[data-testid="board-name-input"]');
        this.boardStarLocator = page.locator('[data-testid="board-star"]').first(); 
        this.viewClosedBoardsBtn = page.getByText('Ver todos los tableros cerrados');
        this.closedBoardItemsLocator = page.locator('ul.g8RdqvgKdVNk0C > li.d0sKN6fe14jaBa');
        this.closeBoardDeleteBtn = page.locator('[data-testid="close-board-delete-board-button"]'); 
        this.confirmPermanentDeleteBtn = page.locator('[data-testid="close-board-delete-board-confirm-button"]');
    }

    async goTo() {
        await this.goto(this.boardUrl); 
    }

    async createBoard(title) {
        await this.click(this.createBtn);
        await this.click(this.createBoardBtn);
        await this.fill(this.nameField, title);
        
        if (title === "") {
            await expect(this.submitBtn).toBeDisabled();
            return;
        }
        if (title.length > 16384) {
             return;
        }
        
        await this.click(this.submitBtn);
        await expect(this.page.getByText(`${title}`)).toBeVisible();
    }

    async deleteBoard(title) {
        const openBoardLink = this.page.getByRole('link', { name: `${title}` }); 
        if (await openBoardLink.isVisible()) {
             await this.click(openBoardLink);
        }

        await this.page.waitForSelector('button[aria-label="Mostrar menú"]');
        await this.click(this.openMenuBtn); 
        await this.click(this.closeBtn);
        await this.click(this.confirmDeleteBtn);

        await this.goTo();
        await expect(openBoardLink).toHaveCount(0);
    }

    async openBoard(title) {
        const openBoardLink = this.page.getByRole('link', { name: `${title}` }).first();
        await this.click(openBoardLink);
        await expect(this.page.getByText(`${title}`).first()).toBeVisible();
    }

    async updateBoard(title, newTitle) {
        await this.click(this.boardNameDisplay);
        await this.fill(this.boardNameInput, newTitle);
        await this.boardNameInput.press('Enter');
        
        if (newTitle === "") {
            await expect(this.boardNameDisplay).toHaveText(title);
            return;
        }
        
        await expect(this.boardNameDisplay).toHaveText(newTitle);
    }

    async addFavorite(title) {
        const contenedorTablero = this.page.locator(`.Dm9SyZvpL8MyK1:has-text("${title}")`);
        const botonEstrella = contenedorTablero.locator(this.boardStarLocator); 
        await this.click(botonEstrella);
    }

    async deleteClosedBoards() {
        await this.click(this.viewClosedBoardsBtn);
        
        const initialCount = await this.closedBoardItemsLocator.count();
        console.log(initialCount);

        if (initialCount === 0) {
            return;
        }

        while (await this.closedBoardItemsLocator.count() > 0) {
            const firstBoardItem = this.closedBoardItemsLocator.first();
            const deleteButton = firstBoardItem.locator(this.closeBoardDeleteBtn); 
            
            await this.click(deleteButton);
            
            await this.page.waitForSelector('[data-testid="close-board-delete-board-confirm-button"]', { state: 'visible' });
            await this.click(this.confirmPermanentDeleteBtn); 
            
            await firstBoardItem.waitFor({ state: 'detached', timeout: 5000 });
        }
        
        const finalCount = await this.closedBoardItemsLocator.count();
        expect(finalCount).toBe(0);
    }
}