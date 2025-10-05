const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/commetApiFixture');
const { requestPost, validateResponse } = require('../../utils/request_comment');
const { commentNormal, commentVoid, commentLarge } = require('../../data/commentDataApi');
const errors = require('../../data/schemaComment/errorMessages');
const schema = require('../../data/schemaComment/schemaCommentCreate');
const Ajv = require('ajv');

const ajv = new Ajv();
const validate = ajv.compile(schema);

commentNormal.forEach(({ comment, type }) => {
  test(`Verificar que se cree un comentario ${type} en una tarjeta existente`, async ({ request, commentId }) => {
    const response = await requestPost(request, comment, true);
    const body = await response.json();
    commentId.set(body.id);
    expect(validate(body), JSON.stringify(validate.errors, null, 2)).toBe(true);
    await validateResponse(response.status(), body.data.text, 200, comment);
  });
});

test("Verificar que no se pueda crear un comentario si falta el paremetro text", async ({ request }) => {
  const response = await requestPost(request, null, true);
  await validateResponse(response.status(), await response.text(), 400, errors.text);
});

test("Verificar que no se pueda crear un comentario si el id es invalido", async ({ request }) => {
  const response = await requestPost(request, "texto", false);
  await validateResponse(response.status(), await response.text(), 400, errors.idInvalid);
});

test("Verificar que no se pueda crear un comentario si el key es invalido", async ({ request }) => {
  const response = await requestPost(request, "texto", true, { includeKey: false });
  await validateResponse(response.status(), await response.text(), 401, errors.key);
});

test("Verificar que no se pueda crear un comentario si el token es invalido", async ({ request }) => {
  const response = await requestPost(request, "texto", true, { includeToken: false });
  const body = await response.json();
  await validateResponse(response.status(), await body.message, 401, errors.token.message);
});

commentVoid.forEach(({ comment, type }) => {
  test(`Verificar que no se pueda crear un comentario ${type}`, async ({ request }) => {
    const response = await requestPost(request, comment, true);
    await validateResponse(response.status(), await response.text(), 400, errors.void);
  });
});

commentLarge.forEach(({ comment, type }) => {
  test(`Verificar que no se pueda crear un comentario ${type}`, async ({ request }) => {
    const response = await requestPost(request, comment, true);
    await validateResponse(response.status(), await response.text(), 413, errors.textLarge);
  });
});