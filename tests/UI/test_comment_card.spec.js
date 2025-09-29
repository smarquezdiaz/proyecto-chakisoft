const { expect } = require('@playwright/test');
const { test } = require('../../data/card');
const { commentCard } = require('../../pages/commentCardPage');
const { commentType } = require('../../data/commentData');

test.use({ storageState: 'playwright/.auth/user.json' });

commentType.forEach(({ comment, type}) => {
    test(`Verificar escribir comentario de tipo: ${type}`, async ({ cardUrl }) => {
        const commentPage = new commentCard(cardUrl);
        switch (type) {
            case 'normal':
                await commentPage.writeComment(comment);
                break;
            case 'negrilla':
                await commentPage.writeComment(comment);
                break;
            case 'numerado':
                await commentPage.writeComment(comment);
                break;
            default:
                throw new Error(`Escenario no manejado: ${type}`);
        }
    });
});

