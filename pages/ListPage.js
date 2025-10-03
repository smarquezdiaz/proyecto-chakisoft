// pages/ListPage.js
const { expect } = require('@playwright/test');
const { UIHelpers } = require('../utils/UI-ListHelpers');

class ListPage {
    constructor(page) {
        this.page = page;
        this.helpers = new UIHelpers(page);
        
        // Selectores centralizados
        this.selectors = {
            addListButton: 'button[data-testid="list-composer-button"]',
            listNameInput: 'textarea[data-testid="list-name-textarea"]',
            submitListButton: 'button[data-testid="list-composer-add-list-button"]',
            listWrapper: 'li[data-testid="list-wrapper"]',
            listNameHeader: 'h2[data-testid="list-name"]',
            listMenuButton: 'button[data-testid="list-edit-menu-button"]',
            moveListButton: 'button[data-testid="list-actions-move-list-button"]',
            copyListButton: 'button[data-testid="list-actions-copy-list-button"]',
            archiveListButton: 'button[data-testid="list-actions-archive-list-button"]',
            followListButton: 'button[data-testid="list-actions-watch-list-button"]',
            boardSelect: '#move-list-screen-board-options-select',
            positionSelect: 'input[id="move-list-screen-position-select"]',
            submitMoveButton: 'button[type="submit"]:has-text("Mover")'
        };
    }

    /**
     * Localiza el botón de agregar lista (primero o último)
     */
    getAddListButton(position = 'first') {
        const locator = this.page.locator(this.selectors.addListButton);
        return position === 'first' ? locator.first() : locator.last();
    }

    /**
     * Crea una nueva lista
     */
    async createList(name) {
        await this.getAddListButton().click();
        await this.page.locator(this.selectors.listNameInput).first().fill(name);
        await this.page.locator(this.selectors.submitListButton).first().click();
        await this.helpers.safeWait(1500);
    }

    /**
     * Renombra una lista existente
     */
    async renameList(oldName, newName) {
        const list = await this.findListByName(oldName);
        const headerButton = list.locator(`${this.selectors.listNameHeader} button`).first();
        await headerButton.click();
        await this.helpers.safeWait(500);
        
        const textarea = this.page.locator(this.selectors.listNameInput).first();
        await textarea.waitFor({ state: 'visible' });
        await textarea.selectText();
        await textarea.fill(newName);
        await textarea.press('Enter');
        await this.helpers.safeWait(1500);
    }

    /**
     * Abre el menú de una lista
     */
    async openListMenu(listName) {
        const list = await this.findListByName(listName);
        await list.scrollIntoViewIfNeeded();
        await this.helpers.safeWait(500);
        
        const menuButton = list.locator(this.selectors.listMenuButton).first();
        await menuButton.waitFor({ state: 'visible', timeout: 5000 });
        await menuButton.click();
        await this.helpers.safeWait(1000);
    }

    /**
     * Mueve una lista a otro tablero
     */
    async moveListToBoard(listName, targetBoardName) {
        await this.openListMenu(listName);
        
        const moveButton = this.page.locator(this.selectors.moveListButton).first();
        await moveButton.waitFor({ state: 'visible', timeout: 5000 });
        await moveButton.click();
        await this.helpers.safeWait(1200);
        
        const boardSelect = this.page.locator(this.selectors.boardSelect).first();
        await boardSelect.waitFor({ state: 'visible', timeout: 5000 });
        await boardSelect.click();
        await this.helpers.safeWait(800);
        
        const boardOption = this.page.locator(`li:has-text("${targetBoardName}")`).first();
        await boardOption.waitFor({ state: 'visible', timeout: 5000 });
        await boardOption.click();
        await this.helpers.safeWait(1000);
        
        const moveSubmitButton = this.page.locator('button:has-text("Mover")').first();
        await moveSubmitButton.waitFor({ state: 'visible', timeout: 5000 });
        await moveSubmitButton.click();
        await this.helpers.safeWait(3000);
    }

    /**
     * Mueve una lista a una posición específica
     */
    async moveListToPosition(listName, targetPosition) {
        await this.openListMenu(listName);
        
        const moveButton = this.page.locator(this.selectors.moveListButton).first();
        await moveButton.waitFor({ state: 'visible', timeout: 5000 });
        await moveButton.click();
        await this.helpers.safeWait(1000);
        
        const positionInput = this.page.locator(this.selectors.positionSelect).first();
        await positionInput.waitFor({ state: 'visible', timeout: 5000 });
        await positionInput.click();
        await this.helpers.safeWait(800);
        
        const option = this.page.locator(`li:text-is("${targetPosition}")`).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.helpers.safeWait(800);
        
        const submitButton = this.page.locator(this.selectors.submitMoveButton).first();
        await submitButton.waitFor({ state: 'visible', timeout: 5000 });
        await submitButton.click();
        await this.helpers.safeWait(2000);
    }

    /**
     * Copia una lista
     */
    async copyList(listName) {
        await this.openListMenu(listName);
        
        const copyButton = this.page.locator(this.selectors.copyListButton).first();
        await copyButton.waitFor({ state: 'visible', timeout: 5000 });
        await copyButton.click();
        await this.helpers.safeWait(1200);
        
        const createButton = this.page.locator('button:has-text("Crear lista")').first();
        await createButton.waitFor({ state: 'visible', timeout: 10000 });
        await createButton.click();
        await this.helpers.safeWait(4000);
        
        await this.helpers.waitForNetworkIdle();
        await this.helpers.safeWait(1000);
    }

    /**
     * Archiva una lista
     */
    async archiveList(listName) {
        await this.openListMenu(listName);
        
        const archiveButton = this.page.locator(this.selectors.archiveListButton).first();
        await archiveButton.click();
        await this.helpers.safeWait(1000);
    }

    /**
     * Sigue una lista
     */
    async followList(listName) {
        await this.openListMenu(listName);
        
        const followButton = this.page.locator(this.selectors.followListButton).first();
        await followButton.waitFor({ state: 'visible', timeout: 5000 });
        await followButton.click();
        await this.helpers.safeWait(1000);
        
        await this.page.keyboard.press('Escape');
        await this.helpers.safeWait(500);
    }

    /**
     * Desarchivar lista
     */
    async unarchiveList(listName) {
        try {
            await this.helpers.openArchivedItems();
            await this.helpers.switchToArchivedLists();
            
            const listItem = this.page.locator(`li:has-text("${listName}")`).first();
            await listItem.waitFor({ state: 'visible', timeout: 5000 });
            await listItem.hover();
            await this.helpers.safeWait(800);
            
            // Intentar múltiples estrategias para el botón restaurar
            let restoreButton = this.page.locator('button:has-text("Restaurar")').first();
            
            if (!await this.helpers.isVisible('button:has-text("Restaurar")')) {
                restoreButton = this.page.locator('[data-testid="RefreshIcon"]')
                    .locator('xpath=ancestor::button').first();
            }
            
            await restoreButton.waitFor({ state: 'visible', timeout: 5000 });
            await restoreButton.click();
            await this.helpers.safeWait(2000);
            
            await this.page.keyboard.press('Escape');
            await this.helpers.safeWait(1000);
        } catch (error) {
            await this.helpers.takeDebugScreenshot('unarchive-error');
            await this.page.keyboard.press('Escape');
            throw error;
        }
    }

    /**
     * Elimina una lista archivada permanentemente
     */
    async deleteArchivedList(listName) {
        try {
            await this.helpers.openArchivedItems();
            await this.helpers.switchToArchivedLists();
            
            const listText = this.page.locator(`text="${listName}"`).first();
            await listText.waitFor({ state: 'visible', timeout: 5000 });
            await listText.hover();
            await this.helpers.safeWait(500);
            
            const container = listText.locator('..');
            const deleteBtn = container.locator('button').last();
            await deleteBtn.click();
            await this.helpers.safeWait(1000);
            
            await this.page.locator('h2:has-text("¿Eliminar la lista?")')
                .waitFor({ state: 'visible', timeout: 5000 });
            await this.helpers.safeWait(500);
            
            const confirmButton = this.page.locator('button.wxzsFisvWmMGpf:has-text("Eliminar")').first();
            await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
            await confirmButton.click();
            await this.helpers.safeWait(1500);
            
            await this.page.keyboard.press('Escape');
            await this.helpers.safeWait(500);
        } catch (error) {
            await this.page.keyboard.press('Escape');
            throw error;
        }
    }

    /**
     * Verifica si existe una lista con el nombre dado
     */
    async listExists(name) {
        const names = await this.getAllListNames();
        return names.includes(name);
    }

    /**
     * Obtiene todas las listas del tablero
     */
    async getAllListNames() {
        const lists = await this.page.locator(this.selectors.listWrapper).all();
        const names = [];
        
        for (const list of lists) {
            try {
                const nameSpan = list.locator(`${this.selectors.listNameHeader} span`).first();
                const name = await nameSpan.innerText();
                names.push(name.trim());
            } catch (e) {
                // Ignorar listas que no se pueden leer
            }
        }
        
        return names;
    }

    /**
     * Busca una lista por su nombre
     */
    async findListByName(name) {
        const lists = await this.page.locator(this.selectors.listWrapper).all();
        
        for (const list of lists) {
            try {
                const nameSpan = list.locator(`${this.selectors.listNameHeader} span`).first();
                const currentName = await nameSpan.innerText();
                
                if (currentName.trim() === name) {
                    return list;
                }
            } catch (e) {
                // Continuar buscando
            }
        }
        
        throw new Error(`Lista "${name}" no encontrada`);
    }

    /**
     * Limpia múltiples listas
     */
    async cleanup(listNames) {
        for (const name of listNames) {
            try {
                if (await this.listExists(name)) {
                    await this.archiveList(name);
                    await this.deleteArchivedList(name);
                }
            } catch (e) {
                console.log(`No se pudo limpiar: ${name}`);
            }
        }
    }
}

module.exports = { ListPage };