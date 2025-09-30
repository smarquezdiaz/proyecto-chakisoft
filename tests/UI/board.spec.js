import { test, expect } from '@playwright/test';
import { BoardPage } from '../../pages/BoardPage';

let board;

test.describe('Test Cases para Board', () => {
    test.beforeEach(async ({ page }) => {
        board = new BoardPage(page);
        await board.goTo();
    });

    test('test para verificar creacion exitosa de tablero', async ({ page }) => {
        await board.createBoard('ewe');
    });

    test('test para verificar creacion exitosa de tablero', async ({ page }) => {
        await board.createBoard('owo');
    });

    test.afterEach(async ({ page }) => {
        // borrar despues de cada creacion pasandole el titulo 
    });
});
