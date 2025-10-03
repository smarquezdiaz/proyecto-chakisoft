import { test as baseTest } from '@playwright/test';
import { httpPost, httpDelete } from './apiConfig';
import { getDynamicEndpoint } from '../utils/utils';
import { BOARD } from "../utils/config"

export const test = baseTest.extend({
  boardId: async ({}, use) => {
    const endpoint = getDynamicEndpoint(BOARD, '', { name: 'RANDOM' }, true);
    const response = await httpPost(endpoint);
    const boardId = (await response.json()).id;
    await use(boardId);
    const deleteEndpoint = getDynamicEndpoint(BOARD, boardId, null, true);
    await httpDelete(deleteEndpoint);
  },
});