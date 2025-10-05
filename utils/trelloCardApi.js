// import fetch from "node-fetch";

const key = "5e757829ec9ca787c647d01e126b476b";
const token =
  "ATTA5b7ff9373f9a61301f5dc68f630a7763771ea987fdd4fdc5c15e67207fb215880E09D7AD";

//Credenciales inválidas
const invalidKey = "INVALID_KEY_123";
const invalidToken = "INVALID_TOKEN_123";

// Helper para manejar respuestas JSON o texto plano
async function parseResponse(res) {
  const text = await res.text(); // se lee una sola vez
  try {
    return JSON.parse(text);
  } catch {
    return text; // texto plano como "invalid key" o "invalid app token"
  }
}

// Crear una tarjeta en una lista
export async function createCard(listId, name, desc = "") {
  const url = `https://api.trello.com/1/cards?idList=${listId}&key=${key}&token=${token}&name=${encodeURIComponent(
    name
  )}&desc=${encodeURIComponent(desc)}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`Error al crear tarjeta: ${res.status}`);
  return res.json();
}

// Obtener tarjeta por id
export async function getCard(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener tarjeta: ${res.status}`);
  return res.json();
}

// Actualizar tarjeta
export async function updateCard(cardId, newName) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&name=${encodeURIComponent(
    newName
  )}`;
  const res = await fetch(url, { method: "PUT" });
  if (!res.ok) throw new Error(`Error al actualizar tarjeta: ${res.status}`);
  return res.json();
}

// Eliminar tarjeta
export async function deleteCard(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error al eliminar tarjeta: ${res.status}`);
  return res.json();
}

// Métodos para pruebas NEGATIVAS
export async function createCardInvalidKey(listId, name, desc = "") {
  const url = `https://api.trello.com/1/cards?idList=${listId}&key=${invalidKey}&token=${token}&name=${encodeURIComponent(
    name
  )}&desc=${encodeURIComponent(desc)}`;
  const res = await fetch(url, { method: "POST" });
  const body = await parseResponse(res);
  return { status: res.status, body };
}

export async function createCardInvalidToken(listId, name, desc = "") {
  const url = `https://api.trello.com/1/cards?idList=${listId}&key=${key}&token=${invalidToken}&name=${encodeURIComponent(
    name
  )}&desc=${encodeURIComponent(desc)}`;
  const res = await fetch(url, { method: "POST" });
  const body = await parseResponse(res);
  return { status: res.status, body };
}

// Obtener tarjeta GET
export async function getCardInvalidKey(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${invalidKey}&token=${token}`;
  const res = await fetch(url);
  const body = await parseResponse(res);
  return { status: res.status, body };
}

// Obtener tarjeta con Token inválido
export async function getCardInvalidToken(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${invalidToken}`;
  const res = await fetch(url);
  const body = await parseResponse(res);
  return { status: res.status, body };
}

export async function getCardInvalidId(fakeId) {
  const url = `https://api.trello.com/1/cards/${fakeId}?key=${key}&token=${token}`;
  const res = await fetch(url);
  const body = await parseResponse(res);
  return { status: res.status, body };
}

//Metodo Update
// Actualizar tarjeta con APIKey inválido
export async function updateCardInvalidKey(cardId, newName) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${invalidKey}&token=${token}&name=${encodeURIComponent(
    newName
  )}`;
  const res = await fetch(url, { method: "PUT" });
  const body = await parseResponse(res);
  return { status: res.status, body };
}

// Actualizar tarjeta con Token inválido
export async function updateCardInvalidToken(cardId, newName) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${invalidToken}&name=${encodeURIComponent(
    newName
  )}`;
  const res = await fetch(url, { method: "PUT" });
  const body = await parseResponse(res);
  return { status: res.status, body };
}

// Actualizar tarjeta con ID inválido
export async function updateCardInvalidId(fakeId, newName) {
  const url = `https://api.trello.com/1/cards/${fakeId}?key=${key}&token=${token}&name=${encodeURIComponent(
    newName
  )}`;
  const res = await fetch(url, { method: "PUT" });
  const body = await parseResponse(res);
  return { status: res.status, body };
}

//Metodo DELETE

//Eliminar con APIKey inválido
export async function deleteCardInvalidKey(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${invalidKey}&token=${token}`;
  const res = await fetch(url, { method: "DELETE" });
  const body = await parseResponse(res);
  return { status: res.status, body };
}

//Eliminar con Token inválido
export async function deleteCardInvalidToken(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${invalidToken}`;
  const res = await fetch(url, { method: "DELETE" });
  const body = await parseResponse(res);
  return { status: res.status, body };
}

//Eliminar con ID inexistente
export async function deleteCardInvalidId(fakeId) {
  const url = `https://api.trello.com/1/cards/${fakeId}?key=${key}&token=${token}`;
  const res = await fetch(url, { method: "DELETE" });
  const body = await parseResponse(res);
  return { status: res.status, body };
}
