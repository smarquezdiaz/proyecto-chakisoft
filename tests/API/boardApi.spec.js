import { expect, test } from '@playwright/test';
import { httpGet, httpPost, httpDelete } from "../../fixtures/apiConfig";
import { getDynamicEndpoint } from "../../utils/utils";
import { BOARD } from "../../utils/config";

let id;

test.describe('Pruebas de api para traer un tablero', () => {
    test.beforeEach(async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', ['name']);
        const response = await httpPost(endpoint);
        const responseBody = await response.json();
        id = responseBody.id;
    });

    test('Obtencion de tablero con codigo 200', async ({ }) => {
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null);
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        console.log(responseBody);
    });

    test.afterEach(async ({ }) => {
        expect(id).toBeDefined();
        const endpoint = getDynamicEndpoint(BOARD, id, null);
        const response = await httpDelete(endpoint);
        expect(response.status()).toBe(200);
    });
})

test.describe('Pruebas de api para crear un tablero', () => {
    test('Creacion de tablero con codigo 200', async ({ }) => {
        const endpoint = getDynamicEndpoint(BOARD, '', ['name']);
        const response = await httpPost(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
    });
})