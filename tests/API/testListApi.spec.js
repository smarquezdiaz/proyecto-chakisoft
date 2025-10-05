import Ajv from 'ajv';
import { expect } from '@playwright/test';
import { test } from '../../fixtures/listFixtures.js';
import { validateResponse } from '../../utils/helperlistAPI.js';
import { listSchema, listArraySchema, cardOperationSchema } from '../../data/schemalist/index.js';

const ajv = new Ajv();
const validateList = ajv.compile(listSchema);
const validateListArray = ajv.compile(listArraySchema);
const validateCardOperation = ajv.compile(cardOperationSchema);

test.describe('API Tests - Trello Lists', () => {
  test.describe.configure({ mode: 'serial' });

  test('API-TC01 - Crear lista', async ({ listPage }) => {
    const listName = `Lista Test ${Date.now()}`;
    const response = await listPage.createList(listName);
    await validateResponse(response, validateList, 'POST /lists');
    expect(response.name).toBe(listName);
  });

  test('API-TC02 - Obtener listas', async ({ listPage }) => {
    const response = await listPage.getAllLists();
    await validateResponse(response, validateListArray, 'GET /boards/{id}/lists');
    expect(response.length).toBeGreaterThan(0);
  });

  test('API-TC03 - Renombrar lista', async ({ listPage, testLists }) => {
    console.log(`\n TC03: Renombrando lista ID: ${testLists.mainListId}`);
    
    const response = await listPage.renameListById(testLists.mainListId, 'Lista API Renombrada1');
    await validateResponse(response, validateList, 'PUT /lists/{id}');
    
    console.log(` Lista renombrada a: "${response.name}" (closed=${response.closed})`);
    expect(response.name).toBe('Lista API Renombrada1');
    
    // Si la lista está archivada, desarchivala
    if (response.closed) {
      console.log(` Lista está archivada, desarchivando...`);
      const unarchived = await listPage.unarchiveListById(testLists.mainListId);
      console.log(`Lista desarchivada (closed=${unarchived.closed})`);
      expect(unarchived.closed).toBe(false);
    }
  });


  test('API-TC04 - Mover tarjetas', async ({ listPage, testLists }) => {
    const response = await listPage.moveAllCards(testLists.mainListId, testLists.secondaryListId);
    await validateResponse(response, validateCardOperation, 'POST /lists/{id}/moveAllCards');
  });

  test('API-TC05 - Archivar tarjetas', async ({ listPage, testLists }) => {
    const response = await listPage.
    archiveAllCards(testLists.secondaryListId);
    await validateResponse(response, validateCardOperation, 'POST /lists/{id}/archiveAllCards');
  });

  test('API-TC06 - Archivar lista', async ({ listPage, testLists }) => {
    const response = await listPage.archiveListById(testLists.mainListId);
    await validateResponse(response, validateList, 'PUT /lists/{id}/closed');
    expect(response.closed).toBe(true);
  });

  test('API-TC07 - Desarchivar lista', async ({ listPage, testLists }) => {
    const response = await listPage.unarchiveListById(testLists.mainListId);
    await validateResponse(response, validateList, 'PUT /lists/{id}/closed');
    expect(response.closed).toBe(false);
  });


});