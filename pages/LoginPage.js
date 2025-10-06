const { BasePage } = require('./BasePage');

export class LoginPage extends BasePage {

    constructor(page){
        super(page);

        this.loginLink = page.locator('[data-uuid="MJFtCCgVhXrVl7v9HA7EH_login"]');
        this.emailInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginSubmitBtn = page.locator('[data-testid="login-submit-idf-testid"]');
        
        this.url = 'https://trello.com/';
    }

    async goTo(){
        await this.goto(this.url);
    }

    async login(username, password) {
        await this.click(this.loginLink); 
        await this.fill(this.emailInput, username); 
        await this.click(this.loginSubmitBtn); 
        await this.fill(this.passwordInput, password);
        await this.click(this.loginSubmitBtn);
    }

}