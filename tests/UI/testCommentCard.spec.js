const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/commetCardFixture');
const { commentCard } = require('../../pages/commentCardPage');
const { commentType, commentEditDelete, commentLarge } = require('../../data/commentDataUI');

const { allure } = require('allure-playwright');
const logger = require('../../utils/logger');

test.use({ storageState: 'playwright/.auth/user.json' });
test.describe.configure({ mode: 'serial' });

commentType.forEach(({ comment, type, id, mark }) => {
    test(`DR-UI-TC-${id} Verificar que se pueda comentar un comentario ${type} en una tarjeta ${mark}`, async ({ createCardPage }) => {
        allure.tag('UI');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('alta'); 
        logger.info('Iniciando test');
        const commentPage = new commentCard(createCardPage);
        logger.info('publicando comentario');
        await commentPage.typeComment(comment, type);
        logger.success('comentario publicado en una tarjeta');
    });
});

commentEditDelete.forEach(({ input, edit }) => {
    test("DR-UI-TC-15 Verificar editar comentario recien creado @positive @regression", async ({ createCardPage }) => {
        allure.tag('UI');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('media');
        logger.info('Iniciando test');
        const commentPage = new commentCard(createCardPage);
        await commentPage.writeComment(input);
        logger.info('publicando comentario');
        await commentPage.editComment(edit);
        logger.info('editando comentario');
        await expect(commentPage.comments.first()).toHaveText(edit);
        logger.success('el comentario se actualizo');
    });
});

commentEditDelete.forEach(({ input, edit }) => {
    test("DR-UI-TC-16 Verificar eliminar el ultimo comentario creado @positive @regression", async ({ createCardPage }) => {
        allure.tag('UI');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('media');
        logger.info('Iniciando test');
        const commentPage = new commentCard(createCardPage);
        await commentPage.writeComment(input);
        logger.info('publicando primer comentario');
        await commentPage.writeComment(edit);
        logger.info('publicando segundo comentario');
        await commentPage.deleteComment();
        logger.info('borrando ultimo comentario');
        await expect(commentPage.comments.last()).toHaveText(input);
        logger.success('se borro el ultimo comentario');
    });
});

test("DR-UI-TC-17 Verificar subir imagen por el boton de adjuntar del comentario @positive @regression", async ({ createCardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const commentPage = new commentCard(createCardPage);
    await commentPage.attachFile('imageForComment.png');
    logger.info('subiendo imagen adjunto en un comentario');
    await expect(commentPage.attachmentName).toHaveText('imageForComment.png');
    logger.success('imagen subida con exito');
});

test("DR-UI-TC-18 Verificar que no se pueda mencionar en comentario a miembros que no estan el board @negative @regression", async ({ createCardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const commentPage = new commentCard(createCardPage);
    logger.info('mencionando a un miembro que no esta en el board');
    await commentPage.fillComment("@perosonanoesta");
    await expect(commentPage.commentMention).toHaveCount(0);
    logger.success('la mencion solo se publica como texto');
});

test("DR-UI-TC-19 Verificar poder reaccionar a un comentario con un emoji @positive @regression", async ({ createCardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const commentPage = new commentCard(createCardPage);
    logger.info('publicand un comentario');
    await commentPage.writeComment("input");
    logger.info('reaccionand con un emoji al comentario');
    await commentPage.addReaction();
    await expect(commentPage.reactionEmoji.last()).toHaveCount(1);
    logger.success('el comentario tiene una reaccion con un emoji');
});

commentLarge.forEach(({ input, type, id }) => {
    test(`DR-UI-TC-${id} Verificar que al llegar al limite de cracteres en comentario se pueda publicar como ${type} @positive @regression`, async ({ createCardPage }) => {
        allure.tag('UI');
        allure.owner('David Gregori Rodriguez Calle');
        allure.severity('media');
        logger.info('Iniciando test');
        const commentPage = new commentCard(createCardPage);
        logger.info('escribiendo comentario que supera el limite');
        await commentPage.fillComment(input);
        await commentPage.truncatedOrTxt(type);
        logger.success('el comentario si se pudo publicar');
    });
});

test("DR-UI-TC-24 Verificar que el icono de ayuda abre documentación @positive @regression", async ({ createCardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const commentPage = new commentCard(createCardPage);
    logger.info('ariendo el panel de ayuda');
    await commentPage.openHelp();
    logger.success('se abrio la documentacion');
    await commentPage.closeHelp();
});

test("DR-UI-TC-25 Verificar guardar borrador de comentario si se cierra el panel de un tarjeta @positive @regression", async ({ createCardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const commentPage = new commentCard(createCardPage);
    logger.info('escribiendo comentario');
    await commentPage.writeComment("Mi comentario de prueba");
    logger.info('cerrando tarjeta');
    await commentPage.closeButton.click(), { delay: 3000 };
    logger.info('abriendo tarjeta');
    await commentPage.cardName.click();
    await expect(commentPage.comments.first()).toHaveText('Mi comentario de prueba');
    logger.success('el comentario se guardo en el borrador');
});

test("DR-UI-TC-26 Verificar publicar comentario con solo un emoji @positive @regression", async ({ createCardPage }) => {
    allure.tag('UI');
    allure.owner('David Gregori Rodriguez Calle');
    allure.severity('media');
    logger.info('Iniciando test');
    const commentPage = new commentCard(createCardPage);
    logger.info('escribiendo comentario con emoji');
    await commentPage.writeEmoji();
    await expect(commentPage.emojiComment).toBeVisible();
    logger.success('se publico el comentario con un emoji');
});
