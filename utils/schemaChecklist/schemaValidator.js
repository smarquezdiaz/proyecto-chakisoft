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


  validate(data, schema) {
    const validate = this.ajv.compile(schema);
    const valid = validate(data);
    
    return {
      valid: valid,
      errors: validate.errors || []
    };
  }


  validateCreateChecklist(data) {
    return this.validate(data, this.getCreateChecklistSchema());
  }


  validateGetChecklist(data) {
    return this.validate(data, this.getChecklistSchema());
  }


  validateDeleteChecklist(data) {
    return this.validate(data, this.getDeleteChecklistSchema());
  }


  formatErrors(errors) {
    return errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
  }
}

module.exports = SchemaValidator;