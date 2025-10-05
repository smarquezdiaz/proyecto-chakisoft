import Ajv from 'ajv';
import { expect } from '@playwright/test';
import { test } from '../../fixtures/ListApiFixture.js';
import { validateResponse } from '../../utils/request_List.js';
import {
  listSchema,
  listArraySchema,
  cardOperationSchema
} from '../../utils/schemaList/index.js';

const ajv = new Ajv();
const validateList = ajv.compile(listSchema);
const validateListArray = ajv.compile(listArraySchema);
const validateCardOperation = ajv.compile(cardOperationSchema);

test.describe('API Tests - Trello Lists', () => {
  test.describe.configure({ mode: 'serial' });

  //  TC01 - Crear lista
  test('API-TC01 - Crear lista', async ({ listPage }) => {
    const listName = `Lista Test ${Date.now()}`;
    const response = await listPage.createList(listName);

    await validateResponse(response, validateList, 'POST /lists');
    expect(response.name).toBe(listName);
  });

  //  TC02 - Obtener todas las listas del board
  test('API-TC02 - Obtener listas', async ({ listPage }) => {
    const response = await listPage.getAllLists();

    await validateResponse(response, validateListArray, 'GET /boards/{id}/lists');
    expect(response.length).toBeGreaterThan(0);
  });

  //  TC03 - Renombrar lista
  test('API-TC03 - Renombrar lista', async ({ listPage, testLists }) => {
    console.log(`\n Renombrando lista ID: ${testLists.mainListId}`);

    const newName = 'Lista API Renombrada';
    const response = await listPage.renameListById(testLists.mainListId, newName);

    await validateResponse(response, validateList, 'PUT /lists/{id}');
    console.log(` Lista renombrada a: "${response.name}" (closed=${response.closed})`);

    expect(response.name).toBe(newName);

    // Si la lista se archivó por error, se desarchiva
    if (response.closed) {
      console.log(' Lista archivada, desarchivando...');
      const unarchived = await listPage.unarchiveListById(testLists.mainListId);
      expect(unarchived.closed).toBe(false);
      console.log(' Lista desarchivada');
    }
  });

  //  TC04 - Mover tarjetas entre listas
  test('API-TC04 - Mover tarjetas', async ({ listPage, testLists }) => {
    const response = await listPage.moveAllCards(
      testLists.mainListId,
      testLists.secondaryListId
    );

    await validateResponse(response, validateCardOperation, 'POST /lists/{id}/moveAllCards');
    console.log(' Tarjetas movidas correctamente');
  });

  //  TC05 - Archivar todas las tarjetas
  test('API-TC05 - Archivar tarjetas', async ({ listPage, testLists }) => {
    const response = await listPage.archiveAllCards(testLists.secondaryListId);

    await validateResponse(response, validateCardOperation, 'POST /lists/{id}/archiveAllCards');
    console.log(' Todas las tarjetas archivadas');
  });

  //  TC06 - Archivar lista
  test('API-TC06 - Archivar lista', async ({ listPage, testLists }) => {
    const response = await listPage.archiveListById(testLists.mainListId);

    await validateResponse(response, validateList, 'PUT /lists/{id}/closed');
    expect(response.closed).toBe(true);
    console.log(' Lista archivada correctamente');
  });

  //  TC07 - Desarchivar lista
  test('API-TC07 - Desarchivar lista', async ({ listPage, testLists }) => {
    const response = await listPage.unarchiveListById(testLists.mainListId);

    await validateResponse(response, validateList, 'PUT /lists/{id}/closed');
    expect(response.closed).toBe(false);
    console.log(' Lista desarchivada correctamente');
  });
});
