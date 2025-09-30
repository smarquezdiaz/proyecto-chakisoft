// pages/ListPage.js
import {
  getBoardLists,
  createList,
  renameList,
  archiveList,
  moveListToBoard,
  archiveAllCards,
  moveAllCards
} from '../utils/trelloApi.js';

export class ListPage {
  constructor() {
    this.boardId = '68d5f9c8e35a2a78263b2554';
  }

  async createList(name) {
    return await createList(this.boardId, name);
  }

  async getListTitle() {
    const lists = await getBoardLists(this.boardId);
    return lists[lists.length - 1].name;
  }

  async renameList(oldName, newName) {
    const lists = await getBoardLists(this.boardId);
    let list = lists.find(l => l.name === oldName);

    if (!list) {
      await this.createList(oldName);
      const updatedLists = await getBoardLists(this.boardId);
      list = updatedLists.find(l => l.name === oldName);
    }
    await renameList(list.id, newName);
  }

  async archiveList(name) {
    let lists = await getBoardLists(this.boardId);
    let list = lists.find(l => l.name === name);
    if (!list) {
      await this.createList(name);
      lists = await getBoardLists(this.boardId);
      list = lists.find(l => l.name === name);
    }
    await archiveList(list.id, true);
  }

  async unarchiveList(name) {
    let lists = await getBoardLists(this.boardId);
    let list = lists.find(l => l.name === name);
    if (!list) {
      await this.createList(name);
      lists = await getBoardLists(this.boardId);
      list = lists.find(l => l.name === name);
    }
    await archiveList(list.id, false);
  }

  async moveListToAnotherBoard(name, targetBoardId) {
    const lists = await getBoardLists(this.boardId);
    const list = lists.find(l => l.name === name);
    if (!list) throw new Error(`Lista "${name}" no encontrada`);
    await moveListToBoard(list.id, targetBoardId);
  }

  async archiveAllCardsInList(name) {
    const lists = await getBoardLists(this.boardId);
    const list = lists.find(l => l.name === name);
    if (!list) throw new Error(`Lista "${name}" no encontrada`);
    await archiveAllCards(list.id);
  }

  async moveAllCardsToAnotherList(fromListName, targetListName) {
    const lists = await getBoardLists(this.boardId);
    const fromList = lists.find(l => l.name === fromListName);
    const targetList = lists.find(l => l.name === targetListName);

    if (!fromList || !targetList)
      throw new Error(`No se encontraron las listas indicadas`);

    await moveAllCards(fromList.id, this.boardId, targetList.id);
  }

  async getAllLists() {
    return await getBoardLists(this.boardId);
  }
}
