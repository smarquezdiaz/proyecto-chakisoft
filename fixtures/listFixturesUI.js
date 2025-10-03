// fixtures/listFixturesUI.js
const { test: base } = require('@playwright/test');
const { ListPage } = require('../pages/ListPage');
const { UIHelpers } = require('../utils/UI-ListHelpers');

/**
 * Fixture personalizado que provee instancias de Page Objects y Helpers
 */
exports.test = base.extend({
    // Fixture para ListPage
    listPage: async ({ page }, use) => {
        const listPage = new ListPage(page);
        await use(listPage);
    },
    
    // Fixture para UIHelpers
    uiHelpers: async ({ page }, use) => {
        const helpers = new UIHelpers(page);
        await use(helpers);
    },
    
    // Fixture para configuración del tablero
    boardPage: async ({ page }, use) => {
        await page.goto('https://trello.com/b/AcEzc2Wb/mi-tablero-de-trello');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        await use(page);
    }
});

exports.expect = base.expect;