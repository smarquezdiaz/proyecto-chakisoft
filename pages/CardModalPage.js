// pages/CardModalPage.js

const { expect } = require('@playwright/test');

class CardModalPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
  
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
        await this.addToCardButton.click();
        await this.checklistMenuButton.click();
        await this.checklistNameInput.fill(checklistName);
        await this.checklistAddButton.click();
    }

    async addCheckItem(itemName) {
        await this.checkItemInput.fill(itemName);
        await this.checkItemAddButton.click();
    }

    async cancelCheckItemEdition() {
        await this.checklistCancelButton.click();
    }

    async editCheckItem(oldName, newName) {
        const item = this.getCheckItemByName(oldName).first();
        await item.dblclick();
        
        const editInput = this.page.locator('textarea[id^="edit-checkitem"]');
        await editInput.waitFor({ state: 'visible' });
        await editInput.fill(newName);
        await this.page.keyboard.press('Enter');
        
        await this.page.waitForTimeout(500);
    }

    async checkItem(itemName) {
        const checkbox = this.getCheckItemCheckbox(itemName);
        await checkbox.check({ force: true });
    }

    async hideCompletedItems() {
        await this.hideCompletedItemsButton.click();
    }

    async deleteChecklist(checklistName) {
        const deleteButton = this.getChecklistDeleteButton(checklistName);
        await deleteButton.click();
        
        const confirmButton = this.getConfirmChecklistDelButton();
        await confirmButton.click();
    }


    // Métodos de URL
    async openAttachmentModal() {
        await this.addToCardButton.click();
        await this.attachmentButton.click();
    }
    
    async addOrEditLink(url, text, isEdit = false) {
        if (isEdit) {
            await this.clearUrlButton.click();
            await this.clearCommentButton.click();
        }
        await this.linkUrlInput.fill(url);
        await this.linkTextInput.fill(text);
        await this.saveButton.click();
    }

    async editLinkAttachment() {
        await this.linkActionsButton.click();
        await this.editLinkButton.click();
    }

    async deleteLinkAttachment() {
        await this.linkActionsButton.click();
        await this.deleteLinkButton.click();
        await this.confirmDeleteLinkButton.click();
    }
    // Métodos de Fechas
    async selectReminder(reminderText) {
        await this.reminderDropdown.click();
        await this.page.waitForTimeout(500);
        
        const reminderOption = this.page.locator(`[role="option"]:has-text("${reminderText}")`);
        await reminderOption.scrollIntoViewIfNeeded();
        await reminderOption.click();
    }

    async openDatesModal() {
        await this.addToCardButton.click();
        await this.dueDateMenuButton.click();
    }

    async setStartDate(date) {
        await this.startDateCheckbox.check({ force: true });
        await this.startDateInput.fill(date);
    }

    async setDueDate(date) {
        await this.dueDateInput.fill(date);
    }

    async setTime(time) {
        await this.timeInput.fill(time);
    }

    async removeDate() {
        await this.dueDateBadge.click();
        await this.dateRemoveButton.waitFor({ state: 'visible' });
        await this.dateRemoveButton.click();
    }
}

module.exports = CardModalPage;