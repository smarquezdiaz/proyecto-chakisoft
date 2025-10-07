const { allure } = require('allure-playwright');
import { test, expect } from '../../fixtures/boardFixture';
const logger = require("../../utils/logger");

var randomstring = require("randomstring");

test.describe('Suite de pruebas para crear tablero', () => {
    let boardTitle = randomstring.generate(5);
    test.use(boardTitle);
    test('SM-UI-TC-01 Verificar creacion exitosa de tablero @smoke @regression @positive', async ({ boardPage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('critical');
        logger.info(`Creando Tablero con titulo ${boardTitle}`);
        await boardPage.createBoard(boardTitle);
        logger.success("Tablero creado exitosamente");
    })
    test('SM-UI-TC-02 Verificar que no permita crear un tablero con titulo vacio @smoke @regression @negative', async ({ boardPage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('normal');
        let boardTitle = "";
        logger.info("Intentando crear tablero con título vacío");
        await boardPage.createBoard(boardTitle);
    })
    test('SM-UI-TC-03 Verificar que no permita crear un tablero con titulo largo @smoke @regression @negative', async ({ boardPage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('normal');
        let boardTitle = randomstring.generate(16385);
        logger.info(`Intentando crear tablero con título de longitud ${boardTitle.length}`);
        await boardPage.createBoard(boardTitle);
    })
})

test.describe('Suite de pruebas para editar tablero', () => {
    let updateTitle = randomstring.generate(5);
    test.use(updateTitle);
    test('SM-UI-TC-04 Verificar edicion exitosa de tablero @smoke @regression @positive', async ({ updatePage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('critical');
        const boardPage = updatePage.pageObject;
        const initialTitle = updatePage.initialTitle;
        logger.info(`Editando tablero de '${initialTitle}' a '${updateTitle}'`);
        await boardPage.updateBoard(initialTitle, updateTitle);
    })
    test('SM-UI-TC-05 Verificar que no permita editar un tablero con titulo vacio @smoke @regression @negative', async ({ updatePage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('normal');
        let updateTitle = "";
        const boardPage = updatePage.pageObject;
        const initialTitle = updatePage.initialTitle;
        logger.info(`Intentando editar tablero '${initialTitle}' con título vacío`);
        await boardPage.updateBoard(initialTitle, updateTitle);
    })
})

test.describe('Suite de pruebas para poner en favoritos un tablero', () => {
    test('SM-UI-TC-06 Verificar que permita poner un tablero en favoritos @smoke @regression @positive', async ({ favoritePage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('minor');
        const boardPage = favoritePage.pageObject;
        const initialTitle = favoritePage.initialTitle;
        logger.info(`Agregando tablero '${initialTitle}' a favoritos`);
        await boardPage.addFavorite(initialTitle);
    })
})

test.describe('Test para flujo de de crear, editar y eliminar un tablero', () => {
    test('SM-UI-TC-07 Verificar flujo de crear, editar y eliminar un tablero @e2e', async ({ initPage }) => {
        allure.tag('UI');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('blocker');
        let boardTitle = randomstring.generate(5);
        let updateTitle = randomstring.generate(5);
        logger.info(`Iniciando flujo E2E: Crear (${boardTitle}), Editar (${updateTitle}) y Eliminar`);
        await initPage.createBoard(boardTitle);
        await initPage.updateBoard(boardTitle, updateTitle);
        await initPage.deleteBoard(updateTitle);
        logger.success("Flujo E2E completado exitosamente");
    })
})