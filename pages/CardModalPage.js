const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class CardModalPage extends BasePage {

    constructor(page) {
        super(page);
  
        this.addToCardButton = this.page.locator('[data-testid="card-back-add-to-card-button"]');
        this.dueDateBadge = this.page.getByTestId('due-date-badge-with-date-range-picker');
        this.cardBackDueDateBadge = this.page.locator('[data-testid="card-back-due-date-badge"]');

        this.attachmentButton = this.page.getByTestId('card-back-attachment-button').nth(0);
        this.dueDateMenuButton = this.page.locator('[data-testid="card-back-due-date-button"]');
        this.checklistMenuButton = this.page.locator('[data-testid="card-back-checklist-button"]');

        this.saveButton = this.page.locator('[data-testid="save-date-button"], [data-testid="link-picker-insert-button"]');
        
        this.linkUrlInput = this.page.getByTestId('link-url');
        this.linkTextInput = this.page.getByTestId('link-text');
        this.linkActionsButton = this.page.getByTestId('link-attachment-actions');
        this.editLinkButton = this.page.getByTestId('edit-link-attachment');
        this.deleteLinkButton = this.page.getByTestId('delete-link-attachment');
        this.confirmDeleteLinkButton = this.page.getByTestId('confirm-delete-link-attachment');
        this.clearUrlButton = this.page.locator('[data-testid="link-url-container"] [data-testid="clear-text"]');
        this.clearCommentButton = this.page.locator('[data-testid="link-text-container"] [data-testid="clear-text"]');

        this.startDateCheckbox = this.page.locator('input[aria-labelledby="date-field-label-Fecha de inicio"]');
        this.startDateInput = this.page.locator('input[data-testid="start-date-field"]');
        this.dueDateInput = this.page.locator('input[data-testid="due-date-field"]');
        this.timeInput = this.page.locator('input[placeholder="Añadir hora"]');
        this.reminderDropdown = this.page.locator('[data-testid="due-reminder-select-select--indicators-container"]');
        this.dateRemoveButton = this.page.getByRole('button', { name: 'Quitar' });

        this.checklistNameInput = this.page.locator('input[id="id-checklist"]');
        this.checklistAddButton = this.page.locator('[data-testid="checklist-add-button"]');
        this.checkItemInput = this.page.locator('textarea[data-testid="check-item-name-input"]');
        this.checkItemAddButton = this.page.locator('[data-testid="check-item-add-button"]');
        this.checklistCancelButton = this.page.getByRole('button', { name: 'Cancelar' });
        this.hideCompletedItemsButton = this.page.locator('button:has-text("Ocultar los elementos marcados")');
    }

    // Métodos Dinámicos
  
    getChecklistDeleteButton(checklistName) {
        return this.page.locator(`section, hgroup`)
            .filter({ hasText: checklistName })
            .locator('[data-testid="checklist-delete-button"]')
            .first();
    }

    getConfirmChecklistDelButton() {
        return this.page.locator('button:has-text("Eliminar lista de comprobación")');
    }

    getCheckItemByName(itemName) {
        return this.page.locator(`[data-testid="check-item-name"]:has-text("${itemName}")`);
    }

    getCheckItemCheckbox(itemName) {
        return this.page.locator(`input[aria-label="${itemName}"]`);
    }

    getAttachmentByUrl(url) {
        return this.page.locator(`a[href*="${url}"]`);
    }

    // Métodos de Checklist

    async createChecklist(checklistName) {
        await this.click(this.addToCardButton);
        await this.click(this.checklistMenuButton);
        await this.fill(this.checklistNameInput, checklistName);
        await this.click(this.checklistAddButton);
    }

    async addCheckItem(itemName) {
        await this.fill(this.checkItemInput, itemName);
        await this.click(this.checkItemAddButton);
    }

    async cancelCheckItemEdition() {
        await this.click(this.checklistCancelButton);
    }

    async editCheckItem(oldName, newName) {
        const item = this.getCheckItemByName(oldName).first();
        await item.dblclick();
        
        const editInput = this.page.locator('textarea[id^="edit-checkitem"]');
        await editInput.waitFor({ state: 'visible' });
        await this.fill(editInput, newName);
        await this.page.keyboard.press('Enter');
        
        await this.page.waitForTimeout(500);
    }

    async checkItem(itemName) {
        const checkbox = this.getCheckItemCheckbox(itemName);
        await checkbox.check({ force: true });
    }

    async hideCompletedItems() {
        await this.click(this.hideCompletedItemsButton);
    }

    async deleteChecklist(checklistName) {
        const deleteButton = this.getChecklistDeleteButton(checklistName);
        await this.click(deleteButton);
        
        const confirmButton = this.getConfirmChecklistDelButton();
        await this.click(confirmButton);
    }

    // Métodos de URL
    async openAttachmentModal() {
        await this.click(this.addToCardButton);
        await this.click(this.attachmentButton);
    }
    
    async addOrEditLink(url, text, isEdit = false) {
        if (isEdit) {
            await this.click(this.clearUrlButton);
            await this.click(this.clearCommentButton);
        }
        await this.fill(this.linkUrlInput, url);
        await this.fill(this.linkTextInput, text);
        await this.click(this.saveButton);
    }

    async editLinkAttachment() {
        await this.click(this.linkActionsButton);
        await this.click(this.editLinkButton);
    }

    async deleteLinkAttachment() {
        await this.click(this.linkActionsButton);
        await this.click(this.deleteLinkButton);
        await this.click(this.confirmDeleteLinkButton);
    }

    // Métodos de Fechas
    async selectReminder(reminderText) {
        await this.click(this.reminderDropdown);
        await this.page.waitForTimeout(500);
        
        const reminderOption = this.page.locator(`[role="option"]:has-text("${reminderText}")`);
        await reminderOption.scrollIntoViewIfNeeded();
        await this.click(reminderOption);
    }

    async openDatesModal() {
        await this.click(this.addToCardButton);
        await this.click(this.dueDateMenuButton);
    }

    async setStartDate(date) {
        await this.startDateCheckbox.check({ force: true });
        await this.fill(this.startDateInput, date);
    }

    async setDueDate(date) {
        await this.fill(this.dueDateInput, date);
    }

    async setTime(time) {
        await this.fill(this.timeInput, time);
    }

    async removeDate() {
        await this.click(this.dueDateBadge);
        await this.dateRemoveButton.waitFor({ state: 'visible' });
        await this.click(this.dateRemoveButton);
    }
}

module.exports = CardModalPage;