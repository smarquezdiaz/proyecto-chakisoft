
const { test : base } = require('@playwright/test');
const { requestDelete } = require('../utils/requestComment');

export const test = base.extend({
  commentId: async ({ request }, use) => {
    let id = null;
    await use({
      get: () => id,
      set: (newId) => { id = newId; }
    });
    if (id) {
      await requestDelete(request, id);
    }
  },
});
