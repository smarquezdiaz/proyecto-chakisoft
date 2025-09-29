const { BasePage } = require('./BasePage');

class commentCard extends BasePage {
    constructor(page) {
        super(page);
        //test 14
        this.commentBox = page.locator('button[data-testid="card-back-new-comment-input-skeleton"]');
        this.inputComment = page.locator('[data-testid="editor-content-container"] .ProseMirror[contenteditable="true"]');
        this.saveComment = page.locator('button[data-testid="card-back-comment-save-button"]');
        this.comments = page.locator('[data-testid="comment-container"] p');
    }
    async writeComment(comment) {
        await this.commentBox.click();
        await this.inputComment.fill(comment);
        await this.saveComment.click();
    }
}
module.exports = { commentCard };