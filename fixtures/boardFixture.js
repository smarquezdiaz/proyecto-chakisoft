import { test as base } from "@playwright/test";
import { BoardPage } from "../pages/BoardPage";


var randomstring = require("randomstring");

export const test = base.extend({
    initPage : async ({ page }, use, testInfo) => {
        const initPage = new BoardPage(page);
        await initPage.goTo();
        await use(initPage);
    },
    boardPage: async ({ page }, use, testInfo) => {
        const boardTitle = randomstring.generate(5);
        const boardPage = new BoardPage(page);
        await boardPage.goTo();
        await use(boardPage);
        if (testInfo.title === 'Verificar creacion exitosa de tablero') {
            await boardPage.deleteBoard(boardTitle);
        }
    },
    updatePage: async ({ page }, use, testInfo) => {
        const boardTitle = randomstring.generate(5);
        const updateTitle = randomstring.generate(5);
        const updatePage = new BoardPage(page);
        await updatePage.goTo();
        await updatePage.createBoard(boardTitle);
        await use({
            pageObject: updatePage,
            initialTitle: boardTitle
        });
        if (testInfo.title === 'Verificar edicion exitosa de tablero') {
            await updatePage.deleteBoard(updateTitle);
        }
    },
    favoritePage: async ({ page }, use, testInfo) => {
        const boardTitle = randomstring.generate(5);
        const favoritePage = new BoardPage(page);
        await favoritePage.goTo();
        await favoritePage.createBoard(boardTitle);
        await favoritePage.goTo();
        await use({
            pageObject: favoritePage,
            initialTitle: boardTitle
        });
        await favoritePage.openBoard(boardTitle);
        await favoritePage.deleteBoard(boardTitle);
    }
});

export { expect } from "@playwright/test";