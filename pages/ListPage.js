// pages/ListPage.js
const { expect } = require('@playwright/test');

class ListPage {
    constructor(page) {
        this.page = page;
        this.addListButton = page.locator('button[data-testid="list-composer-button"]').first();
        this.listNameInput = page.locator('textarea[data-testid="list-name-textarea"]').first();
        this.submitListButton = page.locator('button[data-testid="list-composer-add-list-button"]').first();
        this.createdList = page.locator('li[data-testid="list-wrapper"]');
    }

    async createList(name) {
        await this.addListButton.click();
        await this.listNameInput.fill(name);
        await this.submitListButton.click();
        await this.page.waitForTimeout(1500);
    }

    async renameList(oldName, newName) {
        const list = await this.findListByName(oldName);
        const headerButton = list.locator('h2[data-testid="list-name"] button').first();
        await headerButton.click();
        await this.page.waitForTimeout(500);
        
        const textarea = this.page.locator('textarea[data-testid="list-name-textarea"]').first();
        await textarea.waitFor({ state: 'visible' });
        await textarea.selectText();
        await textarea.fill(newName);
        await textarea.press('Enter');
        await this.page.waitForTimeout(1500);
    }

    async moveListToBoard(listName, targetBoardName) {
        const list = await this.findListByName(listName);
        await list.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        // Abrir menú de lista
        const menuButton = list.locator('button[data-testid="list-edit-menu-button"]').first();
        await menuButton.waitFor({ state: 'visible', timeout: 5000 });
        await menuButton.click();
        await this.page.waitForTimeout(1000);
        
        // Click en Mover lista
        const moveButton = this.page.locator('button[data-testid="list-actions-move-list-button"]').first();
        await moveButton.waitFor({ state: 'visible', timeout: 5000 });
        await moveButton.click();
        await this.page.waitForTimeout(1200);
        
        // Seleccionar tablero destino
        const boardSelect = this.page.locator('#move-list-screen-board-options-select').first();
        await boardSelect.waitFor({ state: 'visible', timeout: 5000 });
        await boardSelect.click();
        await this.page.waitForTimeout(800);
        
        // Buscar y seleccionar el tablero
        const boardOption = this.page.locator(`li:has-text("${targetBoardName}")`).first();
        await boardOption.waitFor({ state: 'visible', timeout: 5000 });
        await boardOption.click();
        await this.page.waitForTimeout(1000);
        
        // Click en Mover
        const moveSubmitButton = this.page.locator('button:has-text("Mover")').first();
        await moveSubmitButton.waitFor({ state: 'visible', timeout: 5000 });
        await moveSubmitButton.click();
        await this.page.waitForTimeout(3000);
    }

    async moveList(listName, targetPosition) {
        const list = await this.findListByName(listName);
        await list.scrollIntoViewIfNeeded();
        
        const menuButton = list.locator('button[data-testid="list-edit-menu-button"]').first();
        await menuButton.click();
        await this.page.waitForTimeout(1000);
        
        const moveButton = this.page.locator('button[data-testid="list-actions-move-list-button"]').first();
        await moveButton.waitFor({ state: 'visible', timeout: 5000 });
        await moveButton.click();
        await this.page.waitForTimeout(1000);
        
        const input = this.page.locator('input[id="move-list-screen-position-select"]').first();
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.click();
        await this.page.waitForTimeout(800);
        
        const option = this.page.locator(`li:text-is("${targetPosition}")`).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForTimeout(800);
        
        const submitButton = this.page.locator('button[type="submit"]:has-text("Mover")').first();
        await submitButton.waitFor({ state: 'visible', timeout: 5000 });
        await submitButton.click();
        await this.page.waitForTimeout(2000);
    }

    async copyList(name) {
        const list = await this.findListByName(name);
        await list.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        // Abrir menú de lista
        const menuButton = list.locator('button[data-testid="list-edit-menu-button"]').first();
        await menuButton.waitFor({ state: 'visible', timeout: 5000 });
        await menuButton.click();
        await this.page.waitForTimeout(1000);
        
        // Click en Copiar lista
        const copyButton = this.page.locator('button[data-testid="list-actions-copy-list-button"]').first();
        await copyButton.waitFor({ state: 'visible', timeout: 5000 });
        await copyButton.click();
        await this.page.waitForTimeout(1200);
        
        // Buscar el botón "Crear lista" - probar múltiples selectores
        let createButton = this.page.locator('button:has-text("Crear lista")').first();
        
        // Esperar a que sea visible con más tiempo
        await createButton.waitFor({ state: 'visible', timeout: 10000 });
        await createButton.click();
        await this.page.waitForTimeout(4000);
        
        // Esperar a que se complete la acción
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    async archiveList(name) {
        const list = await this.findListByName(name);
        await list.scrollIntoViewIfNeeded();
        await list.locator('button[data-testid="list-edit-menu-button"]').click();
        await this.page.waitForTimeout(500);
        await this.page.locator('button[data-testid="list-actions-archive-list-button"]').click();
        await this.page.waitForTimeout(1000);
    }

    async unarchiveList(name) {
        try {
            // Abrir menú del tablero
            await this.page.locator('button[aria-label="Mostrar menú"]').first().click();
            await this.page.waitForTimeout(800);
            
            // Click en elementos archivados
            await this.page.locator('button:has-text("Elementos archivados")').first().click();
            await this.page.waitForTimeout(1000);
            
            // Cambiar a listas
            await this.page.locator('button:has-text("Cambiar a listas")').first().click();
            await this.page.waitForTimeout(1500);
            
            // Buscar el item de la lista archivada
            const listItem = this.page.locator(`li:has-text("${name}")`).first();
            await listItem.waitFor({ state: 'visible', timeout: 5000 });
            await listItem.hover();
            await this.page.waitForTimeout(800);
            
            // Click en el primer botón (restaurar) del item
            const restoreButton = listItem.locator('button').first();
            await restoreButton.waitFor({ state: 'visible', timeout: 5000 });
            await restoreButton.click();
            await this.page.waitForTimeout(2000);
            
            // Cerrar el menú de archivados
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
        } catch (error) {
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(300);
            throw error;
        }
    }

    async deleteArchivedList(name) {
        try {
            await this.page.locator('button[aria-label="Mostrar menú"]').first().click();
            await this.page.waitForTimeout(800);
            
            await this.page.locator('button:has-text("Elementos archivados")').first().click();
            await this.page.waitForTimeout(1000);
            
            await this.page.locator('button:has-text("Cambiar a listas")').first().click();
            await this.page.waitForTimeout(800);
            
            // Buscar y hacer hover sobre la lista archivada
            const listText = this.page.locator(`text="${name}"`).first();
            await listText.waitFor({ state: 'visible', timeout: 5000 });
            await listText.hover();
            await this.page.waitForTimeout(500);
            
            // Click en el botón de eliminar del item
            const container = listText.locator('..');
            const deleteBtn = container.locator('button').last();
            await deleteBtn.click();
            await this.page.waitForTimeout(1000);
            
            // Esperar el modal y confirmar eliminación
            await this.page.locator('h2:has-text("¿Eliminar la lista?")').waitFor({ state: 'visible', timeout: 5000 });
            await this.page.waitForTimeout(500);
            
            const confirmButton = this.page.locator('button.wxzsFisvWmMGpf:has-text("Eliminar")').first();
            await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
            await confirmButton.click();
            await this.page.waitForTimeout(1500);
            
            // Cerrar el menú de archivados
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
        } catch (error) {
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(300);
            throw error;
        }
    }

    async listExists(name) {
        const names = await this.getAllListNames();
        return names.includes(name);
    }

    async getListName(index = 0) {
        return await this.createdList.nth(index)
            .locator('h2[data-testid="list-name"] span').first().innerText();
    }

    async getAllListNames() {
        const lists = await this.createdList.all();
        const names = [];
        for (const list of lists) {
            try {
                const name = await list.locator('h2[data-testid="list-name"] span').first().innerText();
                names.push(name.trim());
            } catch (e) {}
        }
        return names;
    }

    async findListByName(name) {
        const lists = await this.createdList.all();
        for (const list of lists) {
            try {
                const currentName = await list.locator('h2[data-testid="list-name"] span').first().innerText();
                if (currentName.trim() === name) return list;
            } catch (e) {}
        }
        throw new Error(`Lista "${name}" no encontrada`);
    }

    async cleanup(listNames) {
        for (const name of listNames) {
            try {
                if (await this.listExists(name)) {
                    await this.archiveList(name);
                    await this.deleteArchivedList(name);
                }
            } catch (e) {}
        }
    }
}

module.exports = { ListPage };