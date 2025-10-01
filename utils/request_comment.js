const headersBase = require('../data/schemaComment/header.json');

async function requestPost(request, text, validID, options = {}) {
    const response = await request.post(url(validID),
        { params: generateParams({ text, ...options }), headers: generateHeaders(options)}
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
    }else{ID = process.env.CARD_ID_INVALID;}
      return  `https://api.trello.com/1/cards/${ID}/actions/comments`;
}
module.exports = { requestPost, requestDelete };