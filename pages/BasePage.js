export class BasePage {
 
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async fill(selector, value) {
    await this.page.fill(selector, value);
  }

  async click(selector) {
    await this.page.click(selector);
  }

}