// fixtures/listApiFixtures.js
import { test as base } from '@playwright/test';
import {
  createList,
  archiveList,
  moveAllCards,
  archiveAllCards,
  renameList,
  getBoardLists
} from '../utils/request_List.js';
import { listData } from '../data/dataListApi.js';

const BOARD_ID = '68d5f9c8e35a2a78263b2554';

export const test = base.extend({
  // --- Operaciones sobre listas ---
  listPage: [async ({}, use) => {
    const listPage = {
      boardId: BOARD_ID,
      createList: (name) => createList(BOARD_ID, name),
      getAllLists: () => getBoardLists(BOARD_ID),
      renameListById: (listId, newName) => renameList(listId, newName),
      archiveListById: (listId) => archiveList(listId, true),
      unarchiveListById: (listId) => archiveList(listId, false),
      moveAllCards: (sourceListId, targetListId) =>
        moveAllCards(sourceListId, BOARD_ID, targetListId),
      archiveAllCards: (listId) => archiveAllCards(listId)
    };

    await use(listPage);
  }, { scope: 'worker' }],

  // --- Crear listas solo una vez por worker ---
  testLists: [async ({ listPage }, use) => {
    console.log('🧩 Creando listas iniciales...');
    const mainList = await listPage.createList(listData.main.name);
    const secondaryList = await listPage.createList(listData.secondary.name);

    await use({
      mainListId: mainList.id,
      secondaryListId: secondaryList.id,
      mainListName: listData.main.name,
      renamedListName: listData.main.renamed,
      secondaryListName: listData.secondary.name
    });

    console.log('🧹 Archivando listas creadas...');
    await listPage.archiveListById(mainList.id);
    await listPage.archiveListById(secondaryList.id);
  }, { scope: 'worker' }]
});
