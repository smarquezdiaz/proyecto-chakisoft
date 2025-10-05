class ChecklistPage {
  constructor(request) {
    this.request = request;
    this.baseUrl = 'https://api.trello.com/1';
    this.apiKey = '5e757829ec9ca787c647d01e126b476b';
    this.token = 'ATTA5b7ff9373f9a61301f5dc68f630a7763771ea987fdd4fdc5c15e67207fb215880E09D7AD';
    this.cookie = 'dsc=2f4bd02e2f532406b77ed1da1ada43f568634ff4a597762e8c60e5576313499e';
  }

  /**
   * Crear un nuevo checklist
   * @param {string} idCard 
   * @param {string} name 
   * @returns {Promise<Object>} 
   */
  async createChecklist(idCard, name) {
    const response = await this.request.post(`${this.baseUrl}/checklists`, {
      params: {
        idCard: idCard,
        key: this.apiKey,
        token: this.token,
        name: name
      },
      headers: {
        'Cookie': this.cookie
      }
    });
    return response;
  }

  /**
   * Obtener un checklist por ID
   * @param {string} checklistId 
   * @returns {Promise<Object>} 
   */
  async getChecklist(checklistId) {
    const response = await this.request.get(`${this.baseUrl}/checklists/${checklistId}`, {
      params: {
        key: this.apiKey,
        token: this.token
      },
      headers: {
        'Accept': 'application/json',
        'Cookie': this.cookie
      }
    });
    return response;
  }

  /**
   * Actualizar un checklist
   * @param {string} checklistId 
   * @param {string} newName 
   * @returns {Promise<Object>} 
   */
  async updateChecklist(checklistId, newName) {
    const response = await this.request.put(`${this.baseUrl}/checklists/${checklistId}`, {
      params: {
        key: this.apiKey,
        token: this.token,
        name: newName
      },
      headers: {
        'Accept': 'application/json',
        'Cookie': this.cookie
      }
    });
    return response;
  }

  /**
   * Eliminar un checklist
   * @param {string} checklistId 
   * @returns {Promise<Object>} 
   */
  async deleteChecklist(checklistId) {
    const response = await this.request.delete(`${this.baseUrl}/checklists/${checklistId}`, {
      params: {
        key: this.apiKey,
        token: this.token
      },
      headers: {
        'Cookie': this.cookie
      }
    });
    return response;
  }

  /**
   * Crear múltiples checklists
   * @param {string} idCard - 
   * @param {Array<string>} names - 
   * @returns {Promise<Array>} 
   */
  async createMultipleChecklists(idCard, names) {
    const responses = [];
    for (const name of names) {
      const response = await this.createChecklist(idCard, name);
      responses.push(await response.json());
    }
    return responses;
  }

  /**
   * Validar estructura de respuesta de creación
   * @param {Object} responseBody 
   * @returns {boolean} 
   */
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

  /**
   * Validar estructura de respuesta de obtención
   * @param {Object} responseBody 
   * @returns {boolean} 
   */
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

  /**
   * Validar estructura de respuesta de eliminación
   * @param {Object} responseBody 
   * @returns {boolean} 
   */
  validateDeleteResponse(responseBody) {
    return responseBody.hasOwnProperty('limits');
  }
}

module.exports = ChecklistPage;