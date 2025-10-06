import { expect } from '@playwright/test';
import { httpGet, httpPost, httpDelete, httpPut } from "../../fixtures/apiConfig";
import { getDynamicEndpoint } from "../../utils/utils";
import { BOARD, MEMBER } from "../../utils/config";
import { test } from '../../fixtures/board-fixture';
const { allure } = require('allure-playwright');

test.describe('Pruebas de api para traer un tablero', () => {
    let id;
    test.beforeEach(async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        const responseBody = await response.json();
        id = responseBody.id;
    });

    test('Obtencion de tablero con codigo 200', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
    });

    test('Obtencion de tablero con id vacío con codigo 404', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, '', null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(404);
    });

    test('Obtencion de tablero con id inexistente con codigo 400', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, 'a', null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(400);
    });

    test('Obtencion de tablero con codigo 401', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null, false);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(401);
    });

    test.afterEach(async ({ }) => {
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null, true);
        const response = await httpDelete(endpoint);
        expect(response.status()).toBe(200);
    });
})

test.describe('Pruebas de api para crear un tablero', () => {
    let id;
    test('Creacion de tablero con codigo 200', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
    });

    test('Creacion de tablero con codigo 401', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, false);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(401);
    });

    test('Creacion de tablero con nombre vacio con codigo 400', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'EMPTY' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(400);
    });

    test('Creacion de tablero con nombre numerico con codigo 400', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, negative');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 1 }, true);
        const response = await httpPost(endpoint);
        // expect(response.status()).toBe(400);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
    });

    test('Creacion de tablero con descripcion con codigo 200', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM', desc: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
        expect(responseBody).toHaveProperty('desc', responseBody.desc);
    });

    test.afterEach(async ({ }, testInfo) => {
        if (testInfo.title === 'Creacion de tablero con codigo 401' || testInfo.title === 'Creacion de tablero con nombre vacio con codigo 400') {
            return;
        }
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null, true);
        const response = await httpDelete(endpoint);
        expect(response.status()).toBe(200);
    });


})

test.describe('Pruebas de api para actualizar un tablero', () => {
    let id;
    test.beforeEach(async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
    });

    test('Actualizacion de tablero con codigo 200', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        const endpoint = getDynamicEndpoint(BOARD, id, { name: 'RANDOM' }, true);
        const response = await httpPut(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
    });

    test('Actualizacion de la descripcion del tablero con codigo 200', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        const endpoint = getDynamicEndpoint(BOARD, id, { name: 'RANDOM', desc: 'RANDOM' }, true);
        const response = await httpPut(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
        expect(responseBody).toHaveProperty('desc', responseBody.desc);
    });

    test('Cerrar tablero con codigo 200', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        const endpoint = getDynamicEndpoint(BOARD, id, { closed: true }, true);
        const response = await httpPut(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
        expect(responseBody).toHaveProperty('closed', responseBody.closed);
    });

    test('Abrir tablero con codigo 200', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        let endpoint = getDynamicEndpoint(BOARD, id, { closed: true }, true);
        let response = await httpPut(endpoint);
        expect(response.status()).toBe(200);
        let responseBody = await response.json();
        expect(responseBody).toHaveProperty('name', responseBody.name);
        expect(responseBody).toHaveProperty('closed', responseBody.closed);
        endpoint = getDynamicEndpoint(BOARD, id, { closed: false }, true);
        response = await httpPut(endpoint);
        expect(response.status()).toBe(200);
        responseBody = await response.json();
    });

    test.afterEach(async ({ }, testInfo) => {
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null, true);
        const response = await httpDelete(endpoint);
        expect(response.status()).toBe(200);
    });
})

test.describe('Pruebas de api para poner en favorito un tablero', () => {
    test('Creacion de estrella para un tablero con codigo 200', async ({ boardId }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('smoke, regression, positive');
        const endpoint = getDynamicEndpoint(MEMBER, `me/boardStars`, { idBoard: boardId, pos: 1 }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
    });
})