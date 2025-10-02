import { expect, test } from '@playwright/test';
import { httpGet } from "../../fixtures/apiConfig";
import { getEndpoint } from "../../utils/utils";

test.describe('Pruebas de api para traer un tablero', () => {
    test('Obtencion de tablero con codigo 200', async ({ }) => {
        const endpoint = getEndpoint('ISS7nUUQ');
        const response = await httpGet(endpoint);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
    });
})