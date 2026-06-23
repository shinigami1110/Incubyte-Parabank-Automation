const { logger } = require('../utils/logger');

class HomePage {
  constructor(page) {
    this.page = page;
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  async navigateTo(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async clickRegisterLink() {
    await this.registerLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async setConnectionTypeViaUrl(type) {
    logger.info(`Setting connection type to ${type} via URL query parameter`);
    await this.page.goto(`https://parabank.parasoft.com/parabank/index.htm?ConnType=${type}`);
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { HomePage };
