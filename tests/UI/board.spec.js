const { allure } = require('allure-playwright');
import { test, expect } from '../../fixtures/boardFixture';

var randomstring = require("randomstring");

test.describe('Suite de pruebas para crear tablero', () => {
    let boardTitle = randomstring.generate(5);
    test.use(boardTitle);
    test('Verificar creacion exitosa de tablero', async ({boardPage}) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke');
        await boardPage.createBoard(boardTitle);
    })
    test('Verificar que no permita crear tablero con titulo vacio', async ({boardPage}) => {
        let boardTitle = "";
        await boardPage.createBoard(boardTitle);
    })
    test('Verificar que no permita crear tablero con titulo largo', async ({boardPage}) => {
        let boardTitle = randomstring.generate(16385);
        await boardPage.createBoard(boardTitle);
    })
})

// test.describe('Suite de pruebas para actualizar un tablero', () => {
//     test('Verificar actualizacion exitosa de tablero', async ({page, boardPage}) => {
//         updateTitle = randomstring.generate(5);
//         await boardPage.updateBoard(boardTitle, updateTitle);
//     })
// })

// test.describe('Test Cases para Crear Board', () => {
//     test.beforeEach(async ({ page }) => {
//         board = new BoardPage(page);
//         await board.goTo();
//     });

//     test('test para verificar creacion exitosa de tablero', async () => {
//         // allure.tag('UI');
//         // allure.tag('Regression');
//         // allure.tag('Negative');
//         boardTitle = randomstring.generate(5);
//         await board.createBoard(boardTitle);
//     });

//     test('test para verificar que no permita crear un tablero con titulo vacio', async () => {
//         boardTitle = "";
//         await board.createBoard(boardTitle);
//     });

//     test.afterEach(async ({ }, testInfo) => {
//         if (testInfo.title === 'test para verificar que no permita crear un tablero con titulo vacio') {
//             return;
//         }
//         await board.deleteBoard(boardTitle);
//         // if (testInfo.status !== testInfo.expectedStatus)
//         //     console.log(`${testInfo.title} did not run as expected!`);
//     });
// });

// test.describe('Test Cases para poner en favoritos un tablero', () => {
//     test.beforeEach(async ({ page }) => {
//         board = new BoardPage(page);
//         await board.goTo();
//         boardTitle = randomstring.generate(5);
//         await board.createBoard(boardTitle);
//     });

//     test('test para verificar que permite poner un tablero en favoritos', async () => {
//         await board.goTo();
//         await board.addFavorite(boardTitle);
//     })

// })

// test.describe('Test Cases para Actualizar Board', () => {
//     test.beforeEach(async ({ page }) => {
//         board = new BoardPage(page);
//         await board.goTo();
//         boardTitle = randomstring.generate(5);
//         await board.createBoard(boardTitle);
//     });

//     test('test para verificar actualizacion exitosa de tablero', async () => {
//         updateTitle = randomstring.generate(5);
//         await board.updateBoard(boardTitle, updateTitle);
//     });

//     test('test para verificar que no permita actualizar un tablero con titulo vacio', async () => {
//         updateTitle = "";
//         await board.updateBoard(boardTitle, updateTitle);
//     });

//     test.afterEach(async ({ }, testInfo) => {
//         if (testInfo.title === 'test para verificar que no permita actualizar un tablero con titulo vacio') {
//             await board.deleteBoard(boardTitle);
//             return;
//         }
//         await board.deleteBoard(updateTitle);
//         // if (testInfo.status !== testInfo.expectedStatus)
//         //     console.log(`${testInfo.title} did not run as expected!`);
//     });
// });

// test.describe('Test Cases eliminar tableros cerrados', () => {
//     test.beforeEach(async ({ page }) => {
//         board = new BoardPage(page);
//         await board.goTo();
//     });

//     test('test para verificar eliminar todos los tableros cerrados', async () => {
//         await board.deleteClosedBoards();
//     });
// });
// test.describe('Test Cases E2E para CRUD de Board', () => {
//     test.beforeEach(async ({ page }) => {
//         board = new BoardPage(page);
//         await board.goTo();
//     });

//     test('Flujo CRUD de Board', async () => {
//         boardTitle = randomstring.generate(5);
//         await board.createBoard(boardTitle);
//         await board.goTo();
//         await board.openBoard(boardTitle);
//         await board.goTo();
//         // updateTitle = randomstring.generate(5);
//         // await board.updateBoard(boardTitle, updateTitle);
//     });

//     test.afterAll(async ({ }) => {
//         await board.deleteBoard(boardTitle);
//     });
// });


// test('mock API response', async ({ page }) => {
//     await page.route('**/api/data', async (route) => {
//         await route.fulfill({
//             status: 200,
//             contentType: 'application/json',
//             body: JSON.stringify({ success: true })
//         });
//     });
// await page.goto('https://example.com');
//     await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
// });

// test('capture screenshot on failure', async ({ page }) => {
//     try {
//         await page.goto('https://example.com');
//         await expect(page.locator('.non-existent')).toBeVisible();
//     } catch (error) {
//         await page.screenshot({ path: 'failure.png' });
//         throw error;
//     }
// });