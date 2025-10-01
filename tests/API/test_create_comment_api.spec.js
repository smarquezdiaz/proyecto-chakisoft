const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/commetApiFixture');
const { requestPost } = require('../../utils/request_comment');

test("Verificar que se cree un comentario válido en una tarjeta existente", async ({ request, commentId }) => {
  const response = await requestPost(request, "comentario subido desde api",true);
  const body = await response.json();
  commentId.set(body.id);
  expect(response.status()).toBe(200);

  // Verificar body
  //const body = await response.json();
  //expect(body.data.text).toContain("comentario subido desde api");
  //expect(body.id).toBeTruthy(); // el comentario debe tener un id
});

test("Verificar que no se pueda crear un comentario si falta el paremetro text", async ({ request }) => {
  const response = await requestPost(request, null ,true);
  expect(response.status()).toBe(400);
});

test("Verificar que no se pueda crear un comentario si el id es invalido", async ({ request }) => {
  const response = await requestPost(request, "texto" ,false);
  expect(response.status()).toBe(400);
});

test("Verificar que no se pueda crear un comentario si el key es invalido", async ({ request }) => {
  const response = await requestPost(request, "texto" ,true,{includeKey:false});
  expect(response.status()).toBe(401);
});

test("Verificar que no se pueda crear un comentario si el token es invalido", async ({ request }) => {
  const response = await requestPost(request, "texto" ,true,{includeToken:false});
  expect(response.status()).toBe(401);
});

test("Verificar que no se pueda crear un comentario con solo espacios", async ({ request }) => {
  const response = await requestPost(request, "" ,true);
  expect(response.status()).toBe(400);
});
