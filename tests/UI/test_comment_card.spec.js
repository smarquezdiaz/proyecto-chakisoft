const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/commetCardFixture');
const { commentCard } = require('../../pages/commentCardPage');
const { commentType, commentEditDelete, commentLarge } = require('../../data/commentDataUI');

test.use({ storageState: 'playwright/.auth/user.json' });

commentType.forEach(({ comment, type }) => {
    test(`Verificar escribir comentario de tipo: ${type}`, async ({ createCardPage }) => {
        allure.tag('API');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('normal'); const commentPage = new commentCard(createCardPage);
        await commentPage.typeComment(comment, type);
    });
});

commentEditDelete.forEach(({ input, edit }) => {
    test("Verificar editar comentario recien creado", async ({ createCardPage }) => {
        allure.tag('API');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('normal');
        const commentPage = new commentCard(createCardPage);
        await commentPage.writeComment(input);
        await commentPage.editComment(edit);
        await expect(commentPage.comments.first()).toHaveText(edit);
    });
});

commentEditDelete.forEach(({ input, edit }) => {
    test("Verificar eliminar un comentario el ultimo creado", async ({ createCardPage }) => {
        allure.tag('API');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('normal');
        const commentPage = new commentCard(createCardPage);
        await commentPage.writeComment(input);
        await commentPage.writeComment(edit);
        await commentPage.deleteComment();
        await expect(commentPage.comments.last()).toHaveText(input);
    });
});

test("Verificar subir imagen en un comentario", async ({ createCardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const commentPage = new commentCard(createCardPage);
    await commentPage.attachFile('imageForComment.png');
    await expect(commentPage.attachmentName).toHaveText('imageForComment.png');
});

test("Verificar que no se pueda mencionar en comentario a miembros que no estan el board", async ({ createCardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const commentPage = new commentCard(createCardPage);
    await commentPage.fillComment("@perosonanoesta");
    await expect(commentPage.commentMention).toHaveCount(0);
});

test("Verificar poder reaccionar a un comentario", async ({ createCardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const commentPage = new commentCard(createCardPage);
    await commentPage.writeComment("input");
    await commentPage.addReaction();
    await expect(commentPage.reactionEmoji.last()).toHaveCount(1);
});

commentLarge.forEach(({ input, type }) => {
    test(`Verificar que al llegar al limite de cracteres en comentario se pueda publicar como ${type}`, async ({ createCardPage }) => {
        allure.tag('API');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('normal');
        const commentPage = new commentCard(createCardPage);
        await commentPage.fillComment(input);
        await commentPage.truncatedOrTxt(type);
    });
});

test("Verificar que el icono de ayuda abre documentación", async ({ createCardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const commentPage = new commentCard(createCardPage);
    await commentPage.openHelp();
    await commentPage.closeHelp();
});

test("Verificar guardar borrador de comentario", async ({ createCardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const commentPage = new commentCard(createCardPage);
    await commentPage.writeComment("Mi comentario de prueba");
    await commentPage.closeButton.click(), { delay: 3000 };
    await commentPage.cardName.click();
    await expect(commentPage.comments.first()).toHaveText('Mi comentario de prueba');
});

test("Verificar publicar comentario con emoji", async ({ createCardPage }) => {
    allure.tag('API');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('normal');
    const commentPage = new commentCard(createCardPage);
    await commentPage.writeEmoji();
    await expect(commentPage.emojiComment).toBeVisible();
});
