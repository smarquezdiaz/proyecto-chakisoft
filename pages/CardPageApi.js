import {
  createCard,
  getCard,
  updateCard,
  deleteCard,
} from "../utils/trelloCardApi.js";

export class CardPageApi {
  constructor() {
    // Lista donde se van a crear las tarjetas de prueba
    this.listId = "68db01e9fbe399759fd2561b";
  }

  async createCard(name, desc = "") {
    return await createCard(this.listId, name, desc);
  }

  async getCard(cardId) {
    return await getCard(cardId);
  }

  async updateCard(cardId, newName) {
    return await updateCard(cardId, newName);
  }

  async deleteCard(cardId) {
    return await deleteCard(cardId);
  }
}
