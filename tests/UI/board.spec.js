import {test, expect} from '@playwright/test';
import { BoardPage } from '../../pages/BoardPage';

test ('test para verificar creacion exitosa de tablero', async ({page}) => {
    const board = new BoardPage(page);
    await board.goTo();
    await board.createBoard('uwu');
});

