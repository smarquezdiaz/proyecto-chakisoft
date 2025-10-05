// import fetch from 'node-fetch';

const key = '5e757829ec9ca787c647d01e126b476b';
const token = 'ATTA5b7ff9373f9a61301f5dc68f630a7763771ea987fdd4fdc5c15e67207fb215880E09D7AD';

// ==================== LISTS API ====================
export async function getBoardLists(boardId) {
  const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET /boards/${boardId}/lists failed: ${res.status}`);
  return res.json();
}

export async function createList(boardId, name) {
  const url = `https://api.trello.com/1/lists?key=${key}&token=${token}&name=${encodeURIComponent(name)}&idBoard=${boardId}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`POST /lists failed: ${res.status}`);
  return res.json();
}

export async function renameList(listId, newName) {
  const url = `https://api.trello.com/1/lists/${listId}?key=${key}&token=${token}&name=${encodeURIComponent(newName)}`;
  const res = await fetch(url, { method: 'PUT' });
  if (!res.ok) throw new Error(`PUT /lists/${listId} failed: ${res.status}`);
  return res.json();
}


export async function archiveList(listId, archive = true) {
  const url = `https://api.trello.com/1/lists/${listId}/closed?key=${key}&token=${token}&value=${archive}`;
  const res = await fetch(url, { method: 'PUT' });
  if (!res.ok) throw new Error(`PUT /lists/${listId}/closed failed: ${res.status}`);
  return res.json();
}

export async function moveListToBoard(listId, targetBoardId) {
  const url = `https://api.trello.com/1/lists/${listId}/idBoard?key=${key}&token=${token}&value=${targetBoardId}`;
  const res = await fetch(url, { method: 'PUT' });
  if (!res.ok) throw new Error(`PUT /lists/${listId}/idBoard failed: ${res.status}`);
  return res.json();
}

export async function archiveAllCards(listId) {
  const url = `https://api.trello.com/1/lists/${listId}/archiveAllCards?key=${key}&token=${token}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`POST /lists/${listId}/archiveAllCards failed: ${res.status}`);
  return res.json();
}

export async function moveAllCards(listId, idBoard, targetListId) {
  const url = `https://api.trello.com/1/lists/${listId}/moveAllCards?key=${key}&token=${token}&idBoard=${idBoard}&idList=${targetListId}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`POST /lists/${listId}/moveAllCards failed: ${res.status}`);
  return res.json();
}

// ==================== CARDS API ====================
export async function createCard(cardData) {
  const params = new URLSearchParams({ key, token, idList: cardData.idList });
  if (cardData.name) params.append('name', cardData.name);
  if (cardData.desc) params.append('desc', cardData.desc);
  if (cardData.pos !== undefined) params.append('pos', cardData.pos);
  if (cardData.due) params.append('due', cardData.due);
  if (cardData.start) params.append('start', cardData.start);
  if (cardData.dueComplete !== undefined) params.append('dueComplete', cardData.dueComplete);
  if (cardData.idMembers) params.append('idMembers', cardData.idMembers.join(','));
  if (cardData.idLabels) params.append('idLabels', cardData.idLabels.join(','));
  if (cardData.urlSource) params.append('urlSource', cardData.urlSource);

  const url = `https://api.trello.com/1/cards?${params.toString()}`;
  const res = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`POST /cards failed: ${res.status}`);
  return res.json();
}

export async function getCardsFromList(listId) {
  const url = `https://api.trello.com/1/lists/${listId}/cards?key=${key}&token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET /lists/${listId}/cards failed: ${res.status}`);
  return res.json();
}