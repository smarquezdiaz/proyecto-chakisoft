import { test, expect } from '@playwright/test';
import {
  getBoardLists,
  createList,
  renameList,
  archiveList,
  moveListToBoard,
  archiveAllCards,
  moveAllCards,
} from '../../utils/trelloApi.js';

const boardId = '68d5f9c8e35a2a78263b2554'; 
const targetBoardId = '68dc1577d2fc47aa461dd447'; 
const testListName = 'Lista API Test';
const renamedListName = 'Lista API Renombrada';
const secondaryListName = 'Lista API Secundaria';

test.describe('🔹 Pruebas API Trello - Gestión de Listas', () => {
  // Configurar modo serial para ejecutar tests en orden
  test.describe.configure({ mode: 'serial' });

  let createdListId = null;
  let secondaryListId = null;

  // Setup: crear las listas necesarias antes de los tests
  test.beforeAll(async () => {
    console.log(' Configurando listas de prueba...');
    
    // Crear lista principal
    const mainList = await createList(boardId, testListName);
    createdListId = mainList.id;
    console.log(` Lista principal creada: ${testListName} (${createdListId})`);
    
    // Crear lista secundaria
    const secList = await createList(boardId, secondaryListName);
    secondaryListId = secList.id;
    console.log(` Lista secundaria creada: ${secondaryListName} (${secondaryListId})`);
  });

  //  Crear lista adicional
  test('TC01 - Crear una lista en el tablero', async () => {
    const uniqueName = `Lista Test ${Date.now()}`;
    const list = await createList(boardId, uniqueName);

    expect(list).toHaveProperty('name', uniqueName);
    expect(list.idBoard).toBe(boardId);
    console.log(`Lista creada: ${uniqueName}`);
    
    // Limpiar
    await archiveList(list.id, true);
  });

  //  Obtener todas las listas
  test('TC02 - Obtener todas las listas del tablero', async () => {
    const lists = await getBoardLists(boardId);

    expect(Array.isArray(lists)).toBeTruthy();
    const found = lists.find(l => l.name === testListName);
    expect(found).toBeTruthy();
    console.log(`Lista encontrada: ${testListName}`);
  });

  //  Renombrar una lista
  test('TC03 - Renombrar lista existente', async () => {
    expect(createdListId).not.toBeNull();
    
    const updatedList = await renameList(createdListId, renamedListName);
    expect(updatedList).toHaveProperty('name', renamedListName);
    console.log(`✓ Lista renombrada a: ${renamedListName}`);
  });

  //  Mover todas las tarjetas (si existieran)
  test('TC05 - Mover todas las tarjetas de una lista a otra', async () => {
    expect(createdListId).not.toBeNull();
    expect(secondaryListId).not.toBeNull();

    const res = await moveAllCards(createdListId, boardId, secondaryListId);
    expect(res).toBeTruthy();
    console.log(`✓ Tarjetas movidas de ${renamedListName} a ${secondaryListName}`);
  });

  //  Archivar todas las tarjetas en una lista
  test('TC06 - Archivar todas las tarjetas de una lista', async () => {
    expect(secondaryListId).not.toBeNull();
    
    const res = await archiveAllCards(secondaryListId);
    expect(res).toBeTruthy();
    console.log(`✓ Todas las tarjetas archivadas en ${secondaryListName}`);
  });

  //  Archivar una lista
  test('TC07 - Archivar una lista', async () => {
    expect(createdListId).not.toBeNull();
    
    const res = await archiveList(createdListId, true);
    expect(res.closed).toBe(true);
    console.log(`✓ Lista archivada: ${renamedListName}`);
  });

  //  Desarchivar una lista
  test('TC08 - Desarchivar una lista', async () => {
    expect(createdListId).not.toBeNull();
    
    const res = await archiveList(createdListId, false);
    expect(res.closed).toBe(false);
    console.log(`✓ Lista desarchivada: ${renamedListName}`);
  });

  //  Mover lista a otro tablero
  test.skip('TC09 - Mover lista a otro tablero', async () => {
    expect(createdListId).not.toBeNull();
    
    const res = await moveListToBoard(createdListId, targetBoardId);
    expect(res.idBoard).toBe(targetBoardId);
    console.log(`✓ Lista movida a tablero: ${targetBoardId}`);
  });

  // Cleanup: limpiar listas creadas
  test.afterAll(async () => {
    console.log('🧹 Limpiando listas de prueba...');
    
    if (createdListId) {
      try {
        await archiveList(createdListId, true);
        console.log(`✓ Lista principal archivada`);
      } catch (error) {
        console.log(`ℹ No se pudo archivar lista principal: ${error.message}`);
      }
    }
    
    if (secondaryListId) {
      try {
        await archiveList(secondaryListId, true);
        console.log(`✓ Lista secundaria archivada`);
      } catch (error) {
        console.log(`ℹ No se pudo archivar lista secundaria: ${error.message}`);
      }
    }
  });
});