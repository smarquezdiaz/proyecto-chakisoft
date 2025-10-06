const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/commetApiFixture');
const { requestPost, validateResponse } = require('../../utils/request_comment');
const { commentNormal, commentVoid, commentLarge } = require('../../data/commentDataApi');

const { allure } = require('allure-playwright');
const logger = require('../../utils/logger');

const errors = require('../../data/schemaComment/errorMessages');
const schema = require('../../data/schemaComment/schemaCommentCreate');
const Ajv = require('ajv');

const ajv = new Ajv();
const validate = ajv.compile(schema);

commentNormal.forEach(({ comment, type, id }) => {
  test(`DR-API-TC-${id} Verificar que se cree un comentario ${type} en una tarjeta existente @smoke @positive @regression`, async ({ request, commentId }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('alta');
    logger.info('Iniciando test');
    const response = await requestPost(request, comment, true);
    logger.info('request enviado');
    const body = await response.json();
    logger.info('respuesta recivida');
    commentId.set(body.id);
    expect(validate(body), JSON.stringify(validate.errors, null, 2)).toBe(true);
    logger.success('schema validado');
    await validateResponse(response.status(), body.data.text, 200, comment);
    logger.success('status validado');
  });
});

test("DR-API-TC-04 Verificar que no se pueda crear un comentario si falta el paremetro text @negetive @regression", async ({ request }) => {
  allure.tag('API');
  allure.owner('David Gregori Rodriguez Calle');
  allure.severity('media');
  logger.info('Iniciando test');
  logger.info('enviando request');
  const response = await requestPost(request, null, true);
  logger.info('respuesta recivida');
  await validateResponse(response.status(), await response.text(), 400, errors.text);
  logger.success('status y mensaje validados');
});

test("DR-API-TC-05 Verificar que no se pueda crear un comentario si el id es invalido @negetive @regression", async ({ request }) => {
  allure.tag('API');
  allure.owner('David Gregori Rodriguez Calle');
  allure.severity('media');
  logger.info('Iniciando test');
  logger.info('enviando request');
  const response = await requestPost(request, "texto", false);
  logger.info('respuesta recivida');
  await validateResponse(response.status(), await response.text(), 400, errors.idInvalid);
  logger.success('status y mensaje validados');
});

test("DR-API-TC-06 Verificar que no se pueda crear un comentario si el key es invalido @negetive @regression", async ({ request }) => {
  allure.tag('API');
  allure.owner('David Gregori Rodriguez Calle');
  allure.severity('media');
  logger.info('Iniciando test');
  logger.info('enviando request');
  const response = await requestPost(request, "texto", true, { includeKey: false });
  logger.info('respuesta recivida');
  await validateResponse(response.status(), await response.text(), 401, errors.key);
  logger.success('status y mensaje validados');
});

test("DR-API-TC-07 Verificar que no se pueda crear un comentario si el token es invalido @negetive @regression", async ({ request }) => {
  allure.tag('API');
  allure.owner('David Gregori Rodriguez Calle');
  allure.severity('media');
  logger.info('Iniciando test');
  const response = await requestPost(request, "texto", true, { includeToken: false });
  logger.info('enviando request');
  const body = await response.json();
  logger.info('respuesta recivida');
  await validateResponse(response.status(), await body.message, 401, errors.token.message);
  logger.success('status y mensaje validados');
});

commentVoid.forEach(({ comment, type, id }) => {
  test.fixme(`DR-API-TC-${id} Verificar que no se pueda crear un comentario ${type} @negetive @regression`, async ({ request }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    logger.info('enviando request');
    const response = await requestPost(request, comment, true);
    logger.info('respuesta recivida');
    await validateResponse(response.status(), await response.text(), 400, errors.void);
    logger.success('status y mensaje validados');
  });
});

commentLarge.forEach(({ comment, type }) => {
  test(`DR-API-TC-10 Verificar que no se pueda crear un comentario ${type} @negetive @regression`, async ({ request }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    logger.info('enviando request');
    const response = await requestPost(request, comment, true);
    logger.info('respuesta recivida');
    await validateResponse(response.status(), await response.text(), 413, errors.textLarge);
    logger.success('status y mensaje validados');
  });
});