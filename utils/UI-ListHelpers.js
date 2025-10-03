// helpers/UI-ListHelpers.js

/**
 * Clase de utilidades para operaciones comunes de UI
 */
class UIHelpers {
    constructor(page) {
        this.page = page;
    }

    /**
     * Cierra todos los formularios y modales abiertos
     */
    async closeAllForms() {
        try {
            for (let i = 0; i < 3; i++) {
                await this.page.keyboard.press('Escape');
                await this.page.waitForTimeout(300);
            }
            
            const boardArea = this.page.locator('#board');
            await boardArea.click({ 
                position: { x: 10, y: 10 }, 
                force: true, 
                timeout: 1000 
            }).catch(() => {});
            
            await this.page.waitForTimeout(500);
        } catch (e) {
            // Ignorar errores
        }
    }

    /**
     * Espera con manejo de errores
     */
    async safeWait(timeout = 1000) {
        await this.page.waitForTimeout(timeout);
    }

    /**
     * Scroll horizontal al final del tablero
     */
    async scrollToEnd() {
        await this.page.evaluate(() => {
            const board = document.querySelector('#board');
            if (board) board.scrollLeft = board.scrollWidth;
        });
        await this.safeWait(500);
    }

    /**
     * Abre el menú lateral del tablero
     */
    async openBoardMenu() {
        const menuButton = this.page.locator('button[aria-label="Mostrar menú"]').first();
        await menuButton.waitFor({ state: 'visible', timeout: 5000 });
        await menuButton.click();
        await this.safeWait(800);
    }

    /**
     * Abre la sección de elementos archivados
     */
    async openArchivedItems() {
        await this.openBoardMenu();
        const archivedButton = this.page.locator('button:has-text("Elementos archivados")').first();
        await archivedButton.waitFor({ state: 'visible', timeout: 5000 });
        await archivedButton.click();
        await this.safeWait(1000);
    }

    /**
     * Cambia a la vista de listas archivadas
     */
    async switchToArchivedLists() {
        const switchButton = this.page.locator('button:has-text("Cambiar a listas")').first();
        await switchButton.waitFor({ state: 'visible', timeout: 5000 });
        await switchButton.click();
        await this.safeWait(1500);
    }

    /**
     * Toma screenshot para debugging
     */
    async takeDebugScreenshot(name) {
        await this.page.screenshot({ 
            path: `debug-${name}-${Date.now()}.png`, 
            fullPage: true 
        });
    }

    /**
     * Verifica si un elemento está visible
     */
    async isVisible(selector, timeout = 3000) {
        try {
            await this.page.locator(selector).waitFor({ 
                state: 'visible', 
                timeout 
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Limpia el valor de un input de forma segura
     */
    async clearInput(locator) {
        await locator.evaluate(el => {
            el.value = '';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await this.safeWait(300);
    }

    /**
     * Espera a que se complete la carga de red
     */
    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }
}

module.exports = { UIHelpers };