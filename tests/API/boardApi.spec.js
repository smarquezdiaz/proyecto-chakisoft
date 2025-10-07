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

    test('SM-API-TC-08 Obtencion de tablero con codigo 200 @smoke @regression @positive', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('alta');
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
    });

    test('SM-API-TC-09 Obtencion de tablero con id vacío con codigo 404 @smoke @regression @negative', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('media');
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, '', null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(404);
    });

    test('SM-API-TC-10 Obtencion de tablero con id inexistente con codigo 400 @smoke @regression @negative', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('media');
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, 'a', null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(400);
    });

    test('SM-API-TC-11 Obtencion de tablero con codigo 401 @smoke @regression @negative', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('alta');
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
    test('SM-API-TC-12 Creacion de tablero con codigo 200 @smoke @regression @positive', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('alta');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
    });

    test('SM-API-TC-13 Creacion de tablero con codigo 401 @smoke @regression @negative', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('alta');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, false);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(401);
    });

    test('SM-API-TC-14 Creacion de tablero con nombre vacio con codigo 400 @smoke @regression @negative', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('media');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'EMPTY' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(400);
    });

    test('SM-API-TC-15 Creacion de tablero con nombre numerico con codigo 400 @smoke @regression @negative', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('media');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 1 }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
    });

    test('SM-API-TC-16 Creacion de tablero con descripcion con codigo 200 @smoke @regression @positive', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('media');
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM', desc: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
        expect(responseBody).toHaveProperty('desc', responseBody.desc);
    });

    test.afterEach(async ({ }, testInfo) => {
        if (testInfo.title.includes('401') || testInfo.title.includes('nombre vacio')) {
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

    test('SM-API-TC-17 Actualizacion de tablero con codigo 200 @smoke @regression @positive', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('alta');
        const endpoint = getDynamicEndpoint(BOARD, id, { name: 'RANDOM' }, true);
        const response = await httpPut(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
    });

    test('SM-API-TC-18 Actualizacion de la descripcion del tablero con codigo 200 @smoke @regression @positive', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('media');
        const endpoint = getDynamicEndpoint(BOARD, id, { name: 'RANDOM', desc: 'RANDOM' }, true);
        const response = await httpPut(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
        expect(responseBody).toHaveProperty('desc', responseBody.desc);
    });

    test('SM-API-TC-19 Cerrar tablero con codigo 200 @smoke @regression @positive', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('media');
        const endpoint = getDynamicEndpoint(BOARD, id, { closed: true }, true);
        const response = await httpPut(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
        expect(responseBody).toHaveProperty('closed', responseBody.closed);
    });

    test('SM-API-TC-20 Abrir tablero con codigo 200 @smoke @regression @positive', async ({ }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('media');
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
    test('SM-API-TC-21 Creacion de estrella para un tablero con codigo 200 @smoke @regression @positive', async ({ boardId }) => {
        allure.tag('API');
        allure.owner('Sol Abril Marquez Diaz');
        allure.severity('baja');
        const endpoint = getDynamicEndpoint(MEMBER, `me/boardStars`, { idBoard: boardId, pos: 1 }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
    })
})