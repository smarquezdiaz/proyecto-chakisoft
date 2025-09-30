const { expect } = require('@playwright/test');
const { test } = require('../../data/card');
const { commentCard } = require('../../pages/commentCardPage');
const { commentType, commentEditDelete, commentLarge } = require('../../data/commentData');

test.use({ storageState: 'playwright/.auth/user.json' });

commentType.forEach(({ comment, type }) => {
    test(`Verificar escribir comentario de tipo: ${type}`, async ({ cardUrl }) => {
        const commentPage = new commentCard(cardUrl);
        switch (type) {
            case 'normal':
                await commentPage.writeComment(comment);
                await expect(commentPage.comments.first()).toHaveText(comment);
                break;
            case 'negrilla':
                await commentPage.ctrlBComment(comment);
                await expect(commentPage.boldText.first()).toBeVisible();
                break;
            case 'numerado':
                await commentPage.listComment(comment);
                await expect(commentPage.lastCommentActions.locator('ol')).toBeVisible();
                break;
            default:
                throw new Error(`Escenario no manejado: ${type}`);
        }
    });
});

commentEditDelete.forEach(({ input, edit }) => {
    test("Verificar editar comentario", async ({ cardUrl }) => {
        const commentPage = new commentCard(cardUrl);
        await commentPage.writeComment(input);
        await commentPage.editComment(edit);
        await expect(commentPage.comments.first()).toHaveText(edit);
    });
});

commentEditDelete.forEach(({ input, edit }) => {
    test("Verificar eliminar un comentario", async ({ cardUrl }) => {
        const commentPage = new commentCard(cardUrl);
        await commentPage.writeComment(input);
        await commentPage.writeComment(edit);
        await commentPage.deleteComment();
        await expect(commentPage.comments.last()).toHaveText(input);
    });
});

test("Verificar subir imagen en un comentario", async ({ cardUrl }) => {
    const commentPage = new commentCard(cardUrl);
    await commentPage.attachFile('imagen.png');
    await expect(commentPage.attachmentName).toHaveText('imagen.png');
});

test("Verificar que no se pueda mencionar en comentario a miembros que no esyan el board", async ({ cardUrl }) => {
    const commentPage = new commentCard(cardUrl);
    await commentPage.fillComment("@perosonanoesta");
    await expect(commentPage.commentMention).toHaveCount(0);
});

test("Verificar poder reaccionar a un comentario", async ({ cardUrl }) => {
    const commentPage = new commentCard(cardUrl);
    await commentPage.writeComment("input");
    await commentPage.addReaction();
    await expect(commentPage.reactionEmoji.last()).toHaveCount(1);
});

commentLarge.forEach(({ input, type }) => {
    test(`Verificar que al llegar al limite de cracteres en comentario se pueda publicar como ${type}`, async ({ cardUrl }) => {
        const commentPage = new commentCard(cardUrl);
        await commentPage.fillComment(input);
        if (type === 'truncado') {
            await commentPage.addTruncateButton.click();
            await expect(commentPage.saveComment).toBeVisible();
            await commentPage.saveComment.click();
        } else {
            await commentPage.addAttachment();
            await expect(commentPage.attachmentName).toHaveText('comment.txt');
        }
    });
});

test("Verificar que el icono de ayuda abre documentación", async ({ cardUrl }) => {
    const commentPage = new commentCard(cardUrl);
    await commentPage.commentBox.click();
    await expect(commentPage.helpButton).toBeVisible();
    await commentPage.helpButton.click();
    await expect(commentPage.modal).toBeVisible();
    await commentPage.closeButtonHelp.click();
    await expect(commentPage.modal).toBeHidden();
});

test("Verificar guardar borrador de comentario", async ({ cardUrl }) => {
    const commentPage = new commentCard(cardUrl);
    await commentPage.writeComment("Mi comentario de prueba");
    await commentPage.closeButton.click(), { delay: 3000 };
    await commentPage.cardName.click();
    await expect(commentPage.comments.first()).toHaveText('Mi comentario de prueba');
});

test("Verificar publicar comentario con emoji", async ({ cardUrl }) => {
    const commentPage = new commentCard(cardUrl);
    await commentPage.writeEmoji();
    await expect(commentPage.emojiComment).toBeVisible();
});
