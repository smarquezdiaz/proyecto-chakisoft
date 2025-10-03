const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const path = require('path');

class commentCard extends BasePage {
    constructor(page) {
        super(page);
        this.cardName = page.locator('[data-testid="card-name"]');
        //test 14
        this.commentBox = page.locator('button[data-testid="card-back-new-comment-input-skeleton"]');
        this.inputComment = page.locator('[data-testid="editor-content-container"] .ProseMirror[contenteditable="true"]');
        this.saveComment = page.locator('button[data-testid="card-back-comment-save-button"]');
        this.comments = page.locator('[data-testid="comment-container"] p');
        //test 15
        this.lastCommentActions = page.locator('[data-testid="card-back-action-container"]')
        //16
        this.deleteCommentButton = page.getByRole('button', { name: 'Eliminar comentario' });
        //17
        this.attachButton = page.locator('button[aria-label="Attach and insert link"]');
        this.attachmentName = page.locator('[data-testid="attachment-thumbnail-name"]');
        this.fileInput = page.locator('input[type="file"]');
        //18
        this.commentMention = page.locator('[aria-relevant="additions removals"]')
        //19
        this.reactionButton = page.locator('button.FSZAhAlBNcoU5W');
        this.reactionLike = page.locator('button[aria-posinset="1"]');
        this.reactionEmoji = this.lastCommentActions.locator('.emoji-mart-emoji');
        //20
        this.ctrlB = page.locator('button[aria-label="Negrita Ctrl+B"]');
        this.boldText = this.comments.locator('strong[data-renderer-mark="true"]');
        //21
        this.menuList = page.locator('button[aria-label="Listas"]');
        this.numberListOption = page.locator('span[data-item-title="true"]', { hasText: 'Lista numerada' });
        this.lastCommentListItem = this.lastCommentActions.locator('ol li');//ojo
        //22
        this.addTruncateButton = page.getByRole('button', { name: 'Truncar' });
        //23
        this.addAttachmentButton = page.getByRole('button', { name: 'Añadir como un adjunto' });
        //24
        this.helpButton = page.locator('button[aria-label="Open help dialog"]');
        this.modal = page.locator('[data-testid="help-modal-dialog--positioner"]');
        //25
        this.closeButton = page.locator('button[aria-label="Cerrar diálogo"]');
        this.lastCommentDraft = page.locator('[data-testid="editor-content-container"] p');
        this.closeButtonHelp = page.locator('[aria-label="Cerrar el diálogo de ayuda"]');
        //26
        this.InsertElements = page.locator('button[aria-label="Insertar elementos"]');
        this.emojiPickerpage = page.locator('button[data-testid="element-item-3"]');
        this.emojiPicker = page.locator('span[aria-label=":smile:"]');
        this.emojiComment = page.locator('[data-emoji-id="smile"]');
    }
    async writeComment(comment) {
        await this.page.waitForTimeout(3000);
        await this.fillComment(comment);
        await this.saveComment.click();
    }

    async editComment(edit) {
        await this.lastCommentActions.getByRole('link', { name: 'Editar' }).first().click();
        await this.inputComment.fill(edit);
        await this.saveComment.click();
    }

    async deleteComment() {
        await this.lastCommentActions.getByRole('link', { name: 'Eliminar' }).first().click(), { delay: 2000 };
        await this.deleteCommentButton.click(), { delay: 2000 };
    }

    async attachFile(fileName) {
        const filePath = path.join(__dirname, '../data', fileName);
        await this.commentBox.dblclick();
        await this.attachButton.click();
        await this.fileInput.setInputFiles(filePath);
    }

    async fillComment(input) {
        await this.commentBox.click();
        await this.inputComment.fill(input);
    }

    async addReaction() {
        await this.reactionButton.last().click();
        await this.reactionLike.click();
    }

    async listComment(comment) {
        await this.commentBox.click();
        await this.menuList.click();
        await this.numberListOption.click();
        await this.inputComment.type(comment);
        await this.saveComment.click();
    }

    async ctrlBComment(comment) {
        await this.commentBox.click();
        await this.ctrlB.click();
        await this.inputComment.fill(comment);
        await this.saveComment.click();
    }

    async addAttachment() {
        await this.addAttachmentButton.click();
    }

    async writeEmoji() {
        await this.commentBox.click();
        await this.InsertElements.click();
        await this.emojiPickerpage.click();
        await this.emojiPicker.click();
        await this.saveComment.click();
    }

    async typeComment(comment, type) {
        switch (type) {
            case 'normal':
                await this.writeComment(comment);
                await expect(this.comments.first()).toHaveText(comment);
                break;
            case 'negrilla':
                await this.ctrlBComment(comment);
                await expect(this.boldText.first()).toBeVisible();
                break;
            case 'numerado':
                await this.listComment(comment);
                await expect(this.lastCommentActions.locator('ol')).toBeVisible();
                break;
            default:
                throw new Error(`Escenario no manejado: ${type}`);
        }
    }

    async truncatedOrTxt(type) {
        if (type === 'truncado') {
            await this.addTruncateButton.click();
            await expect(this.saveComment).toBeVisible();
            await this.saveComment.click();
        } else {
            await this.addAttachment();
            await expect(this.attachmentName).toHaveText('comment.txt');
        }
    }

    async openHelp() {
        await this.commentBox.click();
        await expect(this.helpButton).toBeVisible();
        await this.helpButton.click();
        await expect(this.modal).toBeVisible();
    }

    async closeHelp() {
        await this.closeButtonHelp.click();
        await expect(this.modal).toBeHidden();
    }
}
module.exports = { commentCard };