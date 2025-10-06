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
        await this.createBtn.waitFor({ state: 'visible' });
    }

    async createBoard(title) {
        await this.click(this.createBtn);
        await this.createBoardBtn.waitFor({ state: 'visible' });
        await this.click(this.createBoardBtn);

        await this.nameField.waitFor({ state: 'visible' });
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

        await this.openMenuBtn.waitFor({ state: 'visible' });
        await this.click(this.openMenuBtn);

        await this.closeBtn.waitFor({ state: 'visible' });
        await this.click(this.closeBtn);

        await this.confirmDeleteBtn.waitFor({ state: 'visible' });
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
        await this.boardNameDisplay.waitFor({ state: 'visible' });
        await this.click(this.boardNameDisplay);

        await this.boardNameInput.waitFor({ state: 'visible' });
        await this.fill(this.boardNameInput, newTitle);
        await this.boardNameInput.press('Enter');

        if (newTitle === "") {
            await expect(this.boardNameDisplay).toHaveText(title);
            return;
        }

        await expect(this.boardNameDisplay).toHaveText(newTitle);
    }

    async addFavorite(title) {
        const localizadorMultiple = this.page.locator(`a[title="${title}"]`).locator('..').locator('[data-testid="board-star"]');
        const botonEstrella = localizadorMultiple.first();
        await botonEstrella.waitFor({ state: 'visible' });
        await this.click(botonEstrella);
    }

    async deleteClosedBoards() {
        await this.click(this.viewClosedBoardsBtn);

        await this.closedBoardItemsLocator.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
            console.log("No hay tableros cerrados visibles, continuando.");
        });

        const initialCount = await this.closedBoardItemsLocator.count();
        console.log(initialCount);

        if (initialCount === 0) {
            return;
        }

        while (await this.closedBoardItemsLocator.count() > 0) {
            const firstBoardItem = this.closedBoardItemsLocator.first();
            const deleteButton = firstBoardItem.locator(this.closeBoardDeleteBtn);

            await deleteButton.waitFor({ state: 'visible' });
            await this.click(deleteButton);

            await this.confirmPermanentDeleteBtn.waitFor({ state: 'visible' });
            await this.click(this.confirmPermanentDeleteBtn);

            await firstBoardItem.waitFor({ state: 'detached', timeout: 5000 });
        }

        const finalCount = await this.closedBoardItemsLocator.count();
        expect(finalCount).toBe(0);
    }
}