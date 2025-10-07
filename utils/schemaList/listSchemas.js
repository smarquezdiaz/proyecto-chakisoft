const listSchema = {
  type: "object",
  required: ["id", "name", "closed", "idBoard", "pos"],
  properties: {
    id: { type: "string", pattern: "^[a-f0-9]{24}$" },
    name: { type: "string" },
    closed: { type: "boolean" },
    idBoard: { type: "string", pattern: "^[a-f0-9]{24}$" },
    pos: { type: "number" },
    softLimit: { type: ["number", "null"] },
    subscribed: { type: "boolean" },
    limits: { type: "object" }
  },
  additionalProperties: true
};

const listArraySchema = {
  type: "array",
  minItems: 0,
  items: {
    type: "object",
    required: ["id", "name", "closed", "idBoard", "pos"],
    properties: {
      id: { type: "string", pattern: "^[a-f0-9]{24}$" },
      name: { type: "string" },
      closed: { type: "boolean" },
      idBoard: { type: "string", pattern: "^[a-f0-9]{24}$" },
      pos: { type: "number" },
      softLimit: { type: ["number", "null"] },
      subscribed: { type: "boolean" }
    },
    additionalProperties: true
  }
};

const cardOperationSchema = {
  oneOf: [
    {
      type: "object",
      required: ["_value"],
      properties: { _value: { type: ["object", "null"] } },
      additionalProperties: true
    },
    { type: "object", additionalProperties: true, not: { required: ["_value"] } },
    { type: "array" },
    { type: "string" }
  ]
};

const cardSchema = {
  type: "object",
  required: ["id", "name", "idList", "idBoard"],
  properties: {
    id: { type: "string", pattern: "^[a-f0-9]{24}$" },
    name: { type: "string" },
    desc: { type: "string" },
    idList: { type: "string", pattern: "^[a-f0-9]{24}$" },
    idBoard: { type: "string", pattern: "^[a-f0-9]{24}$" },
    pos: { type: "number" },
    due: { type: ["string", "null"] },
    dueComplete: { type: "boolean" },
    closed: { type: "boolean" },
    idMembers: { type: "array", items: { type: "string" } },
    idLabels: { type: "array", items: { type: "string" } },
    url: { type: "string" },
    shortUrl: { type: "string" }
  },
  additionalProperties: true
};

const cardArraySchema = {
  type: "array",
  minItems: 0,
  items: {
    type: "object",
    required: ["id", "name", "idList"],
    properties: {
      id: { type: "string", pattern: "^[a-f0-9]{24}$" },
      name: { type: "string" },
      desc: { type: "string" },
      idList: { type: "string", pattern: "^[a-f0-9]{24}$" },
      idBoard: { type: "string", pattern: "^[a-f0-9]{24}$" },
      closed: { type: "boolean" }
    },
    additionalProperties: true
  }
};

module.exports = {
  listSchema,
  listArraySchema,
  cardOperationSchema,
  cardSchema,
  cardArraySchema
};
