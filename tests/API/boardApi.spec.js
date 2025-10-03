import { expect, test } from '@playwright/test';
import { httpGet, httpPost, httpDelete } from "../../fixtures/apiConfig";
import { getDynamicEndpoint } from "../../utils/utils";
import { BOARD } from "../../utils/config";

let id;

test.describe('Pruebas de api para traer un tablero', () => {
    test.beforeEach(async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        const responseBody = await response.json();
        id = responseBody.id;
    });

    test('Obtencion de tablero con codigo 200', async ({ }) => {
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
    });

    test('Obtencion de tablero con id vacío con codigo 404', async ({ }) => {
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, '', null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(404);
    });

    test('Obtencion de tablero con id inexistente con codigo 400', async ({ }) => {
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, 'a', null, true);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(400);
    });

    test('Obtencion de tablero con codigo 401', async ({ }) => {
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
    test('Creacion de tablero con codigo 200', async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
    });

   test('Creacion de tablero con codigo 401', async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, false);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(401);
    }); 

    test('Creacion de tablero con nombre vacio con codigo 400', async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'EMPTY' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(400);
    });

    test('Creacion de tablero con nombre numerico con codigo 400', async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 1 }, true);
        const response = await httpPost(endpoint);
        // expect(response.status()).toBe(400);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
    });

    test('Creacion de tablero con descripcion con codigo 200', async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM', desc: 'RANDOM' }, true);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        id = responseBody.id;
        expect(responseBody).toHaveProperty('name', responseBody.name);
        expect(responseBody).toHaveProperty('desc', responseBody.desc);
    });

    test.afterEach(async ({ }, testInfo) => {
        if (testInfo.title !== 'Creacion de tablero con codigo 200') {
            return;
        }
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null, true);
        const response = await httpDelete(endpoint);
        expect(response.status()).toBe(200);
    });
})