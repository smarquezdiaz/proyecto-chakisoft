import Ajv from 'ajv';
import { expect } from '@playwright/test';
import { test } from '../../fixtures/ListApiFixture.js';
import { validateResponse } from '../../utils/requestList.js';
import {
  listSchema,
  listArraySchema,
  cardOperationSchema
} from '../../utils/schemaList/index.js';
const { allure } = require('allure-playwright');
const logger = require('../../utils/logger');

const ajv = new Ajv();
const validateList = ajv.compile(listSchema);
const validateListArray = ajv.compile(listArraySchema);
const validateCardOperation = ajv.compile(cardOperationSchema);

// ✅ Variable global para teardown
let createdListId = null;

test.describe('API Tests - Trello Lists', () => {
  test.describe.configure({ mode: 'serial' });

  test('AE-API-TC-01:  Crear una nueva lista en el tablero (POST /lists) @Smoke @Regression', async ({ listPage }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    logger.info('Crear una nueva lista en el tablero (POST /lists)');
    const listName = `Lista Test ${Date.now()}`;
    const response = await listPage.createList(listName);

    await validateResponse(response, validateList, 'POST /lists');
    expect(response.name).toBe(listName);

    // ✅ Guardamos el ID para usarlo luego en el teardown
    createdListId = response.id;

    logger.info(`Lista creada exitosamente con nombre: "${response.name}" y ID: ${response.id}`);
  });

  test('AE-API-TC-02: Consultar todas las listas activas de un tablero (GET) @Smoke @Regression', async ({ listPage }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    logger.info('Iniciando prueba: Consultar todas las listas activas de un tablero (GET /boards/{id}/lists)');
    const response = await listPage.getAllLists();

    logger.info('Obteniendo todas las listas del board via API');
    await validateResponse(response, validateListArray, 'GET /boards/{id}/lists');
    expect(response.length).toBeGreaterThan(0);
  });

  test('AE-API-TC-03: Actualizar el nombre de una lista existente (PUT) @Smoke @Regression', async ({ listPage, testLists }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    logger.info(`\nRenombrando lista ID: ${testLists.mainListId}`);
    const newName = 'Lista API Renombrada';
    const response = await listPage.renameListById(testLists.mainListId, newName);

    await validateResponse(response, validateList, 'PUT /lists/{id}');
    expect(response.name).toBe(newName);

    logger.info(`Lista renombrada a: "${response.name}" (closed=${response.closed})`);

    if (response.closed) {
      logger.info(' Lista archivada, desarchivando...');
      const unarchived = await listPage.unarchiveListById(testLists.mainListId);
      expect(unarchived.closed).toBe(false);
      logger.info(' Lista desarchivada');
    }
  });

  test('AE-API-TC-04: Mover todas las tarjetas desde una lista origen hacia una lista destino (POST) @Smoke @Regression', async ({ listPage, testLists }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('medium');

    logger.info(`\nMoviendo todas las tarjetas de la lista ID: ${testLists.mainListId} a la lista ID: ${testLists.secondaryListId}`);
    const response = await listPage.moveAllCards(testLists.mainListId, testLists.secondaryListId);

    await validateResponse(response, validateCardOperation, 'POST /lists/{id}/moveAllCards');
    logger.info(' Tarjetas movidas correctamente');
  });

  test('AE-API-TC-05: Archivar todas las tarjetas contenidas en una lista (POST) @Smoke @Regression', async ({ listPage, testLists }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('medium');

    logger.info(`\nArchivando todas las tarjetas en la lista ID: ${testLists.secondaryListId}`);
    const response = await listPage.archiveAllCards(testLists.secondaryListId);

    await validateResponse(response, validateCardOperation, 'POST /lists/{id}/archiveAllCards');
    logger.info(' Todas las tarjetas archivadas');
  });

  test('AE-API-TC-06: Cambiar el estado de una lista a archivada (PUT) @Smoke @Regression', async ({ listPage, testLists }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('high');

    logger.info(`\nArchivando lista ID: ${testLists.mainListId}`);
    const response = await listPage.archiveListById(testLists.mainListId);

    await validateResponse(response, validateList, 'PUT /lists/{id}/closed');
    expect(response.closed).toBe(true);
    logger.info(' Lista archivada correctamente');
  });

  test('AE-API-TC-07: Cambiar el estado de una lista archivada a activa (PUT) @Smoke @Regression', async ({ listPage, testLists }) => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('high');

    logger.info(`\nDesarchivando lista ID: ${testLists.mainListId}`);
    const response = await listPage.unarchiveListById(testLists.mainListId);

    await validateResponse(response, validateList, 'PUT /lists/{id}/closed');
    expect(response.closed).toBe(false);
    logger.info(' Lista desarchivada correctamente');
  });

  //  TEARDOWN GLOBAL
  test.afterAll(async ({ listPage }) => {
    logger.info('Archivando listas creadas...');

    if (createdListId) {
      logger.info(`Ejecutando teardown: archivando lista creada temporalmente con ID: ${createdListId}`);
      try {
        const archiveResponse = await listPage.archiveListById(createdListId);
        await validateResponse(archiveResponse, validateList, 'PUT /lists/{id}/closed');
        logger.info(`Lista de prueba archivada correctamente (${createdListId})`);
      } catch (error) {
        logger.error(`Error al archivar lista temporal (${createdListId}): ${error.message}`);
      }
    } else {
      logger.warn('No se creó ninguna lista temporal durante los tests. No se requiere limpieza.');
    }
  });
});
