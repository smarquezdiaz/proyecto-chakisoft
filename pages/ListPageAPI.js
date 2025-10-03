import {
  getBoardLists,
  createList,
  renameList,
  archiveList,
  moveListToBoard,
  archiveAllCards,
  moveAllCards,
  createCard,
  getCardsFromList
} from '../utils/trelloApilist.js';

/*
 * Page Object Model para operaciones con Listas y Tarjetas de Trello
 */
export class ListPageAPI {
  constructor(boardId) {
    this.boardId = boardId;
  }

  // ==================== MÉTODOS DE LISTAS ====================

  /** POST /lists - Crear lista */
  async createList(name) {
    try {
      return await createList(this.boardId, name);
    } catch (error) {
      throw new Error(`Failed to create list: ${error.message}`);
    }
  }

  /** GET /boards/{id}/lists - Obtener todas las listas */
  async getAllLists() {
    try {
      return await getBoardLists(this.boardId);
    } catch (error) {
      throw new Error(`Failed to get lists: ${error.message}`);
    }
  }

  /** PUT /lists/{id} - Renombrar lista por ID */
  async renameListById(listId, newName) {
    try {
      return await renameList(listId, newName);
    } catch (error) {
      throw new Error(`Failed to rename list ${listId}: ${error.message}`);
    }
  }

  /** PUT /lists/{id} - Renombrar lista por nombre */
  async renameListByName(currentName, newName) {
    try {
      const list = await this.findListByName(currentName, false); // Solo buscar listas activas
      if (!list) throw new Error(`Lista "${currentName}" no encontrada`);
      return await renameList(list.id, newName);
    } catch (error) {
      throw new Error(`Failed to rename list "${currentName}": ${error.message}`);
    }
  }

  /** PUT /lists/{id}/closed - Archivar lista por ID */
  async archiveListById(listId) {
    try {
      return await archiveList(listId, true);
    } catch (error) {
      throw new Error(`Failed to archive list ${listId}: ${error.message}`);
    }
  }

  /** PUT /lists/{id}/closed - Desarchivar lista por ID */
  async unarchiveListById(listId) {
    try {
      return await archiveList(listId, false);
    } catch (error) {
      throw new Error(`Failed to unarchive list ${listId}: ${error.message}`);
    }
  }

  /** PUT /lists/{id}/closed - Archivar lista por nombre */
  async archiveListByName(name) {
    try {
      const list = await this.findListByName(name, false); // Solo buscar listas activas
      if (!list) throw new Error(`Lista "${name}" no encontrada`);
      return await archiveList(list.id, true);
    } catch (error) {
      throw new Error(`Failed to archive list "${name}": ${error.message}`);
    }
  }

  /** PUT /lists/{id}/closed - Desarchivar lista por nombre */
  async unarchiveListByName(name) {
    try {
      const list = await this.findListByName(name, true); // Buscar incluyendo archivadas
      if (!list) throw new Error(`Lista "${name}" no encontrada`);
      return await archiveList(list.id, false);
    } catch (error) {
      throw new Error(`Failed to unarchive list "${name}": ${error.message}`);
    }
  }

  /** PUT /lists/{id}/idBoard - Mover lista a otro tablero */
  async moveListToBoard(listId, targetBoardId) {
    try {
      return await moveListToBoard(listId, targetBoardId);
    } catch (error) {
      throw new Error(`Failed to move list ${listId}: ${error.message}`);
    }
  }

  /** POST /lists/{id}/archiveAllCards - Archivar todas las tarjetas */
  async archiveAllCards(listId) {
    try {
      return await archiveAllCards(listId);
    } catch (error) {
      throw new Error(`Failed to archive all cards: ${error.message}`);
    }
  }

  /** POST /lists/{id}/moveAllCards - Mover todas las tarjetas */
  async moveAllCards(sourceListId, targetListId) {
    try {
      return await moveAllCards(sourceListId, this.boardId, targetListId);
    } catch (error) {
      throw new Error(`Failed to move all cards: ${error.message}`);
    }
  }

  // ==================== MÉTODOS DE TARJETAS ====================

  /** POST /cards - Crear tarjeta con datos */
  async createCard(cardData) {
    try {
      return await createCard(cardData);
    } catch (error) {
      throw new Error(`Failed to create card: ${error.message}`);
    }
  }

  /** POST /cards - Crear tarjeta simple */
  async createSimpleCard(listId, cardName) {
    try {
      return await createCard({
        idList: listId,
        name: cardName
      });
    } catch (error) {
      throw new Error(`Failed to create card: ${error.message}`);
    }
  }

  /** GET /lists/{id}/cards - Obtener tarjetas por ID */
  async getCardsFromList(listId) {
    try {
      return await getCardsFromList(listId);
    } catch (error) {
      throw new Error(`Failed to get cards: ${error.message}`);
    }
  }

  /** GET /lists/{id}/cards - Obtener tarjetas por nombre */
  async getCardsFromListByName(listName) {
    try {
      const list = await this.findListByName(listName, true); // Buscar incluyendo archivadas
      if (!list) throw new Error(`Lista "${listName}" no encontrada`);
      return await getCardsFromList(list.id);
    } catch (error) {
      throw new Error(`Failed to get cards from "${listName}": ${error.message}`);
    }
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Buscar lista por nombre (case-insensitive, trim, con retries y delay)
   * @param {string} name - Nombre de la lista a buscar
   * @param {boolean} includeArchived - Si true, busca también en listas archivadas (default: true)
   * @param {number} retries - Número de reintentos
   * @param {number} delay - Delay entre reintentos en ms
   */
  async findListByName(name, includeArchived = true, retries = 3, delay = 1000) {
    try {
      for (let i = 0; i < retries; i++) {
        const lists = await getBoardLists(this.boardId);
        const found = lists.find(
          l => l.name.trim().toLowerCase() === name.trim().toLowerCase() &&
               (includeArchived || !l.closed)
        );
        if (found) return found;

        if (i < retries - 1) {
          await new Promise(res => setTimeout(res, delay));
        }
      }
      return undefined;
    } catch (error) {
      throw new Error(`Failed to find list "${name}": ${error.message}`);
    }
  }

  /** Verificar si una lista existe (incluyendo archivadas) */
  async listExists(name, retries = 3, delay = 1000) {
    try {
      const searchName = name.trim().toLowerCase();
      console.log(`\n Buscando lista: "${name}" (normalizado: "${searchName}")`);
      
      for (let i = 0; i < retries; i++) {
        console.log(`  Intento ${i + 1}/${retries}...`);
        const lists = await getBoardLists(this.boardId);
        
        console.log(`  Total listas encontradas: ${lists.length}`);
        lists.forEach(l => {
          const listName = l.name.trim().toLowerCase();
          console.log(`    - "${l.name}" (normalizado: "${listName}") [closed=${l.closed}]`);
        });
        
        const found = lists.find(
          l => l.name.trim().toLowerCase() === searchName
        );
        
        if (found) {
          console.log(`   Lista encontrada: ${found.name} (id=${found.id}, closed=${found.closed})`);
          return true;
        }
        
        console.log(`   Lista "${name}" no encontrada en este intento`);
        
        if (i < retries - 1) {
          console.log(`   Esperando ${delay}ms antes del siguiente intento...`);
          await new Promise(res => setTimeout(res, delay));
        }
      }
      
      console.log(` Lista "${name}" NO encontrada después de ${retries} intentos\n`);
      return false;
    } catch (error) {
      console.error(`Error en listExists: ${error.message}`);
      throw new Error(`Failed to check list existence: ${error.message}`);
    }
  }

  /** Obtener ID de lista por nombre */
  async getListIdByName(name, includeArchived = true) {
    try {
      const list = await this.findListByName(name, includeArchived);
      return list ? list.id : null;
    } catch (error) {
      throw new Error(`Failed to get list ID: ${error.message}`);
    }
  }

  /** Contar listas */
  async getListCount() {
    try {
      const lists = await getBoardLists(this.boardId);
      return lists.length;
    } catch (error) {
      throw new Error(`Failed to count lists: ${error.message}`);
    }
  }

  /** Obtener listas activas */
  async getActiveLists() {
    try {
      const lists = await getBoardLists(this.boardId);
      return lists.filter(l => !l.closed);
    } catch (error) {
      throw new Error(`Failed to get active lists: ${error.message}`);
    }
  }

  /** Obtener listas archivadas */
  async getArchivedLists() {
    try {
      const lists = await getBoardLists(this.boardId);
      return lists.filter(l => l.closed);
    } catch (error) {
      throw new Error(`Failed to get archived lists: ${error.message}`);
    }
  }

  /** Contar tarjetas en lista */
  async getCardCountInList(listId) {
    try {
      const cards = await getCardsFromList(listId);
      return cards.length;
    } catch (error) {
      throw new Error(`Failed to count cards: ${error.message}`);
    }
  }
}