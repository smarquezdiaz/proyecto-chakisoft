import { test as base } from "@playwright/test";
import { BoardPage } from "../pages/BoardPage";


var randomstring = require("randomstring");

export const test = base.extend({
    boardPage: async ({ page }, use, testInfo) => {
        const boardTitle = randomstring.generate(5);
        const boardPage = new BoardPage(page);
        await boardPage.goTo();
        await use(boardPage);
        if (testInfo.title === 'Verificar creacion exitosa de tablero') {
            await boardPage.deleteBoard(boardTitle);
        }
    }
});

export { expect } from "@playwright/test";