import { test } from '@playwright/test';
import { BoardPage } from '../../pages/BoardPage';

let board;
let boardTitle;
var randomstring = require("randomstring");

test.describe('Test Cases para Crear Board', () => {
    test.beforeEach(async ({ page }) => {
        board = new BoardPage(page);
        await board.goTo();
    });

    test('test para verificar creacion exitosa de tablero', async () => {
        boardTitle = randomstring.generate(5);
        await board.createBoard(boardTitle);
    });

    test('test para verificar que no permita crear un tablero con titulo vacio', async () => {
        boardTitle = "";
        await board.createBoard(boardTitle);
    });

    test.afterEach(async ({ }, testInfo) => {
        if (testInfo.title === 'test para verificar que no permita crear un tablero con titulo vacio') {
            return;
        }
        await board.deleteBoard(boardTitle);
        // if (testInfo.status !== testInfo.expectedStatus)
        //     console.log(`${testInfo.title} did not run as expected!`);
    });
});
