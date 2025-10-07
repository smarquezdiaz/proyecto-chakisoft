const { allure } = require('allure-playwright');
import { test, expect } from '../../fixtures/boardFixture';

var randomstring = require("randomstring");

test.describe('Suite de pruebas para crear tablero', () => {
    let boardTitle = randomstring.generate(5);
    test.use(boardTitle);
    test('Verificar creacion exitosa de tablero', async ({ boardPage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        await boardPage.createBoard(boardTitle);
    })
    test('Verificar que no permita crear un tablero con titulo vacio', async ({ boardPage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        let boardTitle = "";
        await boardPage.createBoard(boardTitle);
    })
    test('Verificar que no permita crear un tablero con titulo largo', async ({ boardPage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        let boardTitle = randomstring.generate(16385);
        await boardPage.createBoard(boardTitle);
    })
})

test.describe('Suite de pruebas para editar tablero', () => {
    let updateTitle = randomstring.generate(5);
    test.use(updateTitle);
    test('Verificar edicion exitosa de tablero', async ({ updatePage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        const boardPage = updatePage.pageObject;
        const initialTitle = updatePage.initialTitle;
        await boardPage.updateBoard(initialTitle, updateTitle);
    })
    test('Verificar que no permita editar un tablero con titulo vacio', async ({ updatePage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        let updateTitle = "";
        const boardPage = updatePage.pageObject;
        const initialTitle = updatePage.initialTitle;
        await boardPage.updateBoard(initialTitle, updateTitle);
    })
})

test.describe('Suite de pruebas para poner en favoritos un tablero', () => {
    test('Verificar que permita poner un tablero en favoritos', async ({ favoritePage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        const boardPage = favoritePage.pageObject;
        const initialTitle = favoritePage.initialTitle;
        await boardPage.addFavorite(initialTitle);
    })
})

test.describe('Test para flujo de de crear, editar y eliminar un tablero', () => {
    test('Verificar flujo de crear, editar y eliminar un tablero', async ({ initPage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('e2e');
        let boardTitle = randomstring.generate(5);
        let updateTitle = randomstring.generate(5);
        await initPage.createBoard(boardTitle);
        await initPage.updateBoard(boardTitle, updateTitle);
        await initPage.deleteBoard(updateTitle);
    })
})