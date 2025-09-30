import fetch from 'node-fetch';

const key = '5e757829ec9ca787c647d01e126b476b';
const token = 'ATTA5b7ff9373f9a61301f5dc68f630a7763771ea987fdd4fdc5c15e67207fb215880E09D7AD';

// ✅ Obtener todas las listas de un tablero
export async function getBoardLists(boardId) {
  const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener listas: ${res.status}`);
  return res.json();
}

// ✅ Crear una nueva lista
export async function createList(boardId, name) {
  const url = `https://api.trello.com/1/lists?key=${key}&token=${token}&name=${encodeURIComponent(name)}&idBoard=${boardId}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Error al crear lista: ${res.status}`);
  return res.json();
}

// ✅ Renombrar una lista
export async function renameList(listId, newName) {
  const url = `https://api.trello.com/1/lists/${listId}?key=${key}&token=${token}&name=${encodeURIComponent(newName)}`;
  const res = await fetch(url, { method: 'PUT' });
  if (!res.ok) throw new Error(`Error al renombrar lista: ${res.status}`);
  return res.json();
}

// ✅ Archivar o desarchivar lista
export async function archiveList(listId, archive = true) {
  const url = `https://api.trello.com/1/lists/${listId}?key=${key}&token=${token}&closed=${archive}`;
  const res = await fetch(url, { method: 'PUT' });
  if (!res.ok) throw new Error(`Error al archivar/desarchivar lista: ${res.status}`);
  return res.json();
}

// ✅ Mover lista a otro tablero
export async function moveListToBoard(listId, targetBoardId) {
  const url = `https://api.trello.com/1/lists/${listId}/idBoard?key=${key}&token=${token}&value=${targetBoardId}`;
  const res = await fetch(url, { method: 'PUT' });
  if (!res.ok) throw new Error(`Error al mover lista al tablero: ${res.status}`);
  return res.json();
}

// ✅ Archivar todas las tarjetas en una lista
export async function archiveAllCards(listId) {
  const url = `https://api.trello.com/1/lists/${listId}/archiveAllCards?key=${key}&token=${token}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Error al archivar todas las tarjetas: ${res.status}`);
  return res.json();
}

// ✅ Mover todas las tarjetas de una lista a otra
export async function moveAllCards(listId, idBoard, targetListId) {
  const url = `https://api.trello.com/1/lists/${listId}/moveAllCards?key=${key}&token=${token}&idBoard=${idBoard}&idList=${targetListId}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Error al mover todas las tarjetas: ${res.status}`);
  return res.json();
}
