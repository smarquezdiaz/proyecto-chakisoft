const Ajv = require('ajv');
class SchemaValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
  }

  getCreateChecklistSchema() {
    return {
      type: "object",
      required: [
        "checkItems",
        "id",
        "idBoard",
        "idCard",
        "limits",
        "name",
        "pos"
      ],
      properties: {
        id: {
          type: "string"
        },
        name: {
          type: "string"
        },
        idBoard: {
          type: "string"
        },
        idCard: {
          type: "string"
        },
        pos: {
          type: "integer"
        },
        checkItems: {
          type: "array"
        },
        limits: {
          type: "object"
        }
      },
      additionalProperties: true
    };
  }

  getChecklistSchema() {
    return {
      type: "object",
      required: [
        "checkItems",
        "id",
        "idBoard",
        "idCard",
        "name",
        "pos"
      ],
      properties: {
        id: {
          type: "string"
        },
        name: {
          type: "string"
        },
        idBoard: {
          type: "string"
        },
        idCard: {
          type: "string"
        },
        pos: {
          type: "integer"
        },
        checkItems: {
          type: "array"
        }
      },
      additionalProperties: true
    };
  }

  getDeleteChecklistSchema() {
    return {
      type: "object",
      required: [
        "limits"
      ],
      properties: {
        limits: {
          type: "object"
        }
      },
      additionalProperties: true
    };
  }

  /**
   * Validar datos contra un schema
   * @param {Object} data - Datos a validar
   * @param {Object} schema - Schema JSON
   * @returns {Object} { valid: boolean, errors: array }
   */
  validate(data, schema) {
    const validate = this.ajv.compile(schema);
    const valid = validate(data);
    
    return {
      valid: valid,
      errors: validate.errors || []
    };
  }

  /**
   * Validar respuesta de creación de checklist
   * @param {Object} data - Datos a validar
   * @returns {Object} { valid: boolean, errors: array }
   */
  validateCreateChecklist(data) {
    return this.validate(data, this.getCreateChecklistSchema());
  }

  /**
   * Validar respuesta de obtención/actualización de checklist
   * @param {Object} data - Datos a validar
   * @returns {Object} { valid: boolean, errors: array }
   */
  validateGetChecklist(data) {
    return this.validate(data, this.getChecklistSchema());
  }

  /**
   * Validar respuesta de eliminación de checklist
   * @param {Object} data - Datos a validar
   * @returns {Object} { valid: boolean, errors: array }
   */
  validateDeleteChecklist(data) {
    return this.validate(data, this.getDeleteChecklistSchema());
  }

  /**
   * Formatear errores de validación
   * @param {Array} errors - Array de errores de AJV
   * @returns {string} Errores formateados
   */
  formatErrors(errors) {
    return errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
  }
}

module.exports = SchemaValidator;