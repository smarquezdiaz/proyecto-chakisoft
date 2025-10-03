import { test as base } from '@playwright/test';
import { ListPageAPI } from '../pages/ListPageAPI.js';

const BOARD_ID = '68d5f9c8e35a2a78263b2554';

export const test = base.extend({
  listPage: async ({}, use) => {
    const listPage = new ListPageAPI(BOARD_ID);
    await use(listPage);
  },
  testLists: async ({ listPage }, use) => {
    const mainList = await listPage.createList('Lista API Test');
    const secondaryList = await listPage.createList('Lista API Secundaria');

    await use({ mainListId: mainList.id, secondaryListId: secondaryList.id });

    // Teardown
    await listPage.archiveListById(mainList.id);
    await listPage.archiveListById(secondaryList.id);
  }
});
