


class UIHelpers {
    constructor(page) {
        this.page = page;
    }

    
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
            
        }
    }

    
    async safeWait(timeout = 1000) {
        await this.page.waitForTimeout(timeout);
    }

    
    async scrollToEnd() {
        await this.page.evaluate(() => {
            const board = document.querySelector('#board');
            if (board) board.scrollLeft = board.scrollWidth;
        });
        await this.safeWait(500);
    }

   
    async openBoardMenu() {
        const menuButton = this.page.locator('button[aria-label="Mostrar menú"]').first();
        await menuButton.waitFor({ state: 'visible', timeout: 5000 });
        await menuButton.click();
        await this.safeWait(800);
    }

    async openArchivedItems() {
        await this.openBoardMenu();
        const archivedButton = this.page.locator('button:has-text("Elementos archivados")').first();
        await archivedButton.waitFor({ state: 'visible', timeout: 5000 });
        await archivedButton.click();
        await this.safeWait(1000);
    }

    
    async switchToArchivedLists() {
        const switchButton = this.page.locator('button:has-text("Cambiar a listas")').first();
        await switchButton.waitFor({ state: 'visible', timeout: 5000 });
        await switchButton.click();
        await this.safeWait(1500);
    }



   
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

    
    async clearInput(locator) {
        await locator.evaluate(el => {
            el.value = '';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await this.safeWait(300);
    }

    
    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }
}

module.exports = { UIHelpers };