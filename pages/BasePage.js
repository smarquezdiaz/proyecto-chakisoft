class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' }); 
  }

  async click(locator) {
    await locator.click();
  }

  async fill(locator, value) {
    await locator.fill(value);
  }

  async isVisible(locator) {
    return await locator.isVisible();
  }

}

module.exports = { BasePage };