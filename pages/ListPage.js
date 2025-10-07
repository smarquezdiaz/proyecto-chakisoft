// pages/ListPage.js
const { expect } = require('@playwright/test');
const { UIHelpers } = require('../utils/helperListUI.js');

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
        const nameInput = this.page.locator(this.selectors.listNameInput).first();
        await expect(nameInput).toBeVisible();
        
        await nameInput.fill(name);
        const submitButton = this.page.locator(this.selectors.submitListButton).first();
        await submitButton.click();
        
        await expect(this.page.locator(`${this.selectors.listNameHeader}:has-text("${name}")`).first()).toBeVisible();
    }

    /**
     * Renombra una lista existente
     */
    async renameList(oldName, newName) {
        const list = await this.findListByName(oldName);
        const headerButton = list.locator(`${this.selectors.listNameHeader} button`).first();
        await headerButton.click();
        
        const textarea = this.page.locator(this.selectors.listNameInput).first();
        await expect(textarea).toBeVisible();
        
        await textarea.selectText();
        await textarea.fill(newName);
        await textarea.press('Enter');
        
        await expect(this.page.locator(`${this.selectors.listNameHeader}:has-text("${newName}")`).first()).toBeVisible();
    }

    /**
     * Abre el menú de una lista
     */
    async openListMenu(listName) {
    const list = await this.findListByName(listName);
    await list.scrollIntoViewIfNeeded();
    
    const menuButton = list.locator(this.selectors.listMenuButton).first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    
    // Esperar que el menú se abra
    await this.page.waitForTimeout(1500);
}
    /**
     * Mueve una lista a otro tablero
     */
    async moveListToBoard(listName, targetBoardName) {
    const list = await this.findListByName(listName);
    await list.scrollIntoViewIfNeeded();
    
    // 1. Abrir menú de la lista (tres puntos)
    const menuButton = list.locator('button[data-testid="list-edit-menu-button"]').first();
    await menuButton.waitFor({ state: 'visible', timeout: 5000 });
    await menuButton.click();
    await this.page.waitForTimeout(2500);
    
    // 2. Click en "Mover lista"
    const moveButton = this.page.locator('button[data-testid="list-actions-move-list-button"]').first();
    await moveButton.waitFor({ state: 'visible', timeout: 10000 });
    await moveButton.click();
    await this.page.waitForTimeout(1500);
    
    // 3. Click en el selector de tablero
    const boardSelect = this.page.locator('input[id="move-list-screen-board-options-select"]').first();
    await boardSelect.waitFor({ state: 'visible', timeout: 5000 });
    await boardSelect.click();
    await this.page.waitForTimeout(800);
    
    // 4. Seleccionar el tablero "pruebas mover"
    const boardOption = this.page.locator(`div[role="option"]:has-text("${targetBoardName}")`).first();
    await boardOption.waitFor({ state: 'visible', timeout: 5000 });
    await boardOption.click();
    await this.page.waitForTimeout(1000);
    
    // 5. Click en el botón "Mover"
    const moveSubmitButton = this.page.locator('button[type="submit"]:has-text("Mover")').first();
    await moveSubmitButton.waitFor({ state: 'visible', timeout: 5000 });
    await moveSubmitButton.click();
    await this.page.waitForTimeout(3000);
}
    /**
     * Mueve una lista a una posición específica
     */
    async moveListToPosition(listName, targetPosition) {
        await this.openListMenu(listName);
        
        const moveButton = this.page.locator(this.selectors.moveListButton).first();
        await moveButton.click();
        
        const positionInput = this.page.locator(this.selectors.positionSelect).first();
        await expect(positionInput).toBeVisible();
        await positionInput.click();
        
        const option = this.page.locator(`li:text-is("${targetPosition}")`).first();
        await expect(option).toBeVisible();
        await option.click();
        
        const submitButton = this.page.locator(this.selectors.submitMoveButton).first();
        await expect(submitButton).toBeVisible();
        await submitButton.click();
        
        await expect(submitButton).not.toBeVisible();
    }

    /**
     * Copia una lista
     */
    async copyList(listName) {
        await this.openListMenu(listName);
        
        const copyButton = this.page.locator(this.selectors.copyListButton).first();
        await expect(copyButton).toBeVisible();
        await copyButton.click();
        
        const createButton = this.page.locator('button:has-text("Crear lista")').first();
        await expect(createButton).toBeVisible();
        await createButton.click();
        
        // Esperar que Trello procese la copia 
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(5000);
        
        const copiedList = this.page.locator(`${this.selectors.listWrapper}:has-text("${listName}")`).last();
        await expect(copiedList).toBeVisible();
    }

    /**
     * Archiva una lista
     */
    async archiveList(listName) {
        await this.openListMenu(listName);
        
        const archiveButton = this.page.locator(this.selectors.archiveListButton).first();
        await archiveButton.click();
        
        const archivedList = this.page.locator(`${this.selectors.listWrapper}:has-text("${listName}")`);
        await expect(archivedList).not.toBeVisible();
    }

    /**
     * Sigue una lista
     */
    async followList(listName) {
    await this.openListMenu(listName);
    
    const followButton = this.page.locator('button[data-testid="list-actions-watch-list-button"]').first();
    await followButton.waitFor({ state: 'visible', timeout: 10000 });
    await followButton.click();
    await this.page.waitForTimeout(1000);
    
    await this.page.keyboard.press('Escape');
    console.log(`✓ Lista seguida: ${listName}`);
}

    /**
     * Desarchivar lista
     */
    async unarchiveList(listName) {
        console.log(`Desarchivando: ${listName}`);
        
        await this.page.goto('https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello');
        await this.page.waitForLoadState('networkidle');

        const menuButton = this.page.locator('button[aria-label="Mostrar menú"]');
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        const archivedItemsButton = this.page.locator('button:has-text("Elementos archivados")');
        await expect(archivedItemsButton).toBeVisible();
        await archivedItemsButton.click();

        const cambiarBtn = this.page.locator('button:has-text("Cambiar a listas")');
        if (await cambiarBtn.isVisible()) {
            await cambiarBtn.click();
            await expect(cambiarBtn).not.toBeVisible();
        }

        const listRow = this.page.locator(`.WSMoQ6pckTKoQo:text-is("${listName}")`).locator('..');
        const restoreButton = listRow.locator('button:has-text("Restaurar")');
        await expect(restoreButton).toBeVisible();
        await restoreButton.click();

        await this.page.keyboard.press('Escape');
        
        console.log(` Lista desarchivada: ${listName}`);
    }

    /**
     * Elimina una lista archivada permanentemente
     */
    async deleteArchivedList(listName) {
        try {
            await this.helpers.openArchivedItems();
            await this.helpers.switchToArchivedLists();
            
            const listText = this.page.locator(`text="${listName}"`).first();
            await expect(listText).toBeVisible();
            await listText.hover();
            
            const container = listText.locator('..');
            const deleteBtn = container.locator('button').last();
            await deleteBtn.click();
            
            const confirmDialog = this.page.locator('h2:has-text("¿Eliminar la lista?")');
            await expect(confirmDialog).toBeVisible();
            
            const confirmButton = this.page.locator('button.wxzsFisvWmMGpf:has-text("Eliminar")').first();
            await expect(confirmButton).toBeVisible();
            await confirmButton.click();
            
            await expect(listText).not.toBeVisible();
            
            await this.page.keyboard.press('Escape');
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