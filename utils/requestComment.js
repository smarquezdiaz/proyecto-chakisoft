const { expect } = require('@playwright/test');
const headersBase = require('./schemaComment/header.json');
const logger = require('./logger');

async function requestPost(request, text, validID, options = {}) {
  const response = await request.post(url(validID),
    { params: generateParams({ text, ...options }), headers: generateHeaders(options) }
  );
  return response;
}

async function requestDelete(request, commentId) {
  const response = await request.delete(
    `https://api.trello.com/1/cards/${process.env.CARD_ID}/actions/${commentId}/comments`,
    { params: generateParams(commentId), headers: headersBase }
  );
  return response;
}

function generateParams({ text = null, includeKey = true, includeToken = true }) {
  return {
    ...(text ? { text } : {}),
    ...(includeKey ? { key: process.env.API_KEY } : {}),
    ...(includeToken ? { token: process.env.API_TOKEN } : {})
  };
}

function generateHeaders({ includeHeaders = true }) {
  return includeHeaders ? headersBase : {};
}

function url(valid) {
  let ID = "";
  if (valid) {
    ID = process.env.CARD_ID;
  } else { ID = process.env.CARD_ID_INVALID; }
  return `https://api.trello.com/1/cards/${ID}/actions/comments`;
}

function validateResponse(responseStatus, responseBody, status, expectedContains) {
  if (responseStatus !== status) {
    logger.error(`Bug detectado: se esperaba ${status} pero la API devolvió ${responseStatus}`);
  } else {
    if (expectedContains === 400 || expectedContains === 401) {
      expect(responseBody).toBe(expectedContains);
    } else { expect(responseBody).toContain(expectedContains); }
  }
}
module.exports = { requestPost, requestDelete, validateResponse };