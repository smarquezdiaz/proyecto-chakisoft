// pages/requestChecklist.js
require('dotenv').config();

class ChecklistPage {
  constructor(request) {
    this.request = request;
    this.baseUrl = 'https://api.trello.com/1';
    
    this.apiKey = process.env.API_KEY;
    this.token = process.env.API_TOKEN;

    if (!this.apiKey || !this.token) {
      throw new Error(' API_KEY y API_TOKEN deben estar definidos en el archivo .env');
    }
  }

  async createChecklist(idCard, name) {
    const response = await this.request.post(`${this.baseUrl}/checklists`, {
      params: {
        idCard: idCard,
        key: this.apiKey,
        token: this.token,
        name: name
      }
    });
    return response;
  }

  async getChecklist(checklistId) {
    const response = await this.request.get(`${this.baseUrl}/checklists/${checklistId}`, {
      params: {
        key: this.apiKey,
        token: this.token
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    return response;
  }

  async updateChecklist(checklistId, newName) {
    const response = await this.request.put(`${this.baseUrl}/checklists/${checklistId}`, {
      params: {
        key: this.apiKey,
        token: this.token,
        name: newName
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    return response;
  }

  async deleteChecklist(checklistId) {
    const response = await this.request.delete(`${this.baseUrl}/checklists/${checklistId}`, {
      params: {
        key: this.apiKey,
        token: this.token
      }
    });
    return response;
  }

  async createMultipleChecklists(idCard, names) {
    const responses = [];
    for (const name of names) {
      const response = await this.createChecklist(idCard, name);
      responses.push(await response.json());
    }
    return responses;
  }

  validateCreateResponse(responseBody) {
    return (
      responseBody.hasOwnProperty('id') &&
      responseBody.hasOwnProperty('name') &&
      responseBody.hasOwnProperty('idBoard') &&
      responseBody.hasOwnProperty('idCard') &&
      responseBody.hasOwnProperty('pos') &&
      responseBody.hasOwnProperty('checkItems') &&
      responseBody.hasOwnProperty('limits')
    );
  }

  validateGetResponse(responseBody) {
    return (
      responseBody.hasOwnProperty('id') &&
      responseBody.hasOwnProperty('name') &&
      responseBody.hasOwnProperty('idBoard') &&
      responseBody.hasOwnProperty('idCard') &&
      responseBody.hasOwnProperty('pos') &&
      responseBody.hasOwnProperty('checkItems')
    );
  }

  validateDeleteResponse(responseBody) {
    return responseBody.hasOwnProperty('limits');
  }
}

module.exports = ChecklistPage;