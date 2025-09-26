import {expect, Locator, Page} from "@playwright/test";

export class LoginPage{

    constructor(page){
        this.page = page;
        this.loginLink = page.locator('[data-uuid="MJFtCCgVhXrVl7v9HA7EH_login"]');
        this.email = page.locator('input[name="username"]');
        this.password = page.locator('input[name="password"]');
        this.loginBtn = page.locator('[data-testid="login-submit-idf-testid"]');
    }

    async goTo(){
        await this.page.goto('https://trello.com/');
    }

    async login(username, password) {
        await this.loginLink.click();
        await this.email.fill(username);
        await this.loginBtn.click();
        await this.password.fill(password);
        await this.loginBtn.click();
    }

}