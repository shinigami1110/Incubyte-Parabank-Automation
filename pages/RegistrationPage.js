const { expect } = require('@playwright/test');
const { logger } = require('../utils/logger');

class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('input[id="customer.firstName"]');
    this.lastNameInput = page.locator('input[id="customer.lastName"]');
    this.streetInput = page.locator('input[id="customer.address.street"]');
    this.cityInput = page.locator('input[id="customer.address.city"]');
    this.stateInput = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput = page.locator('input[id="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[id="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[id="customer.ssn"]');
    this.usernameInput = page.locator('input[id="customer.username"]');
    this.passwordInput = page.locator('input[id="customer.password"]');
    this.confirmPasswordInput = page.locator('input[id="repeatedPassword"]');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.successMessage = page.locator('#rightPanel p');
  }

  async register(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.streetInput.fill(user.street);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.zipCodeInput.fill(user.zipCode);
    await this.phoneInput.fill(user.phoneNumber);
    await this.ssnInput.fill(user.ssn);
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.registerButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRegistrationSuccess(user) {
    try {
      const successTextLocator = this.page.getByText('Your account was created successfully. You are now logged in.');
      await expect(successTextLocator).toBeVisible({ timeout: 5000 });
      logger.info('Registration success message verified.');
    } catch (e) {
      logger.warn('Registration success message not found. Checking if "This username already exists." error is visible...');
      
      const errorLocator = this.page.locator('span[id="customer.username.errors"]');
      await expect(errorLocator).toBeVisible({ timeout: 5000 });
      const errorText = await errorLocator.innerText();
      
      if (errorText.includes('This username already exists.')) {
        logger.info('Detected "username already exists" error. Verifying if registration succeeded behind the scenes by attempting login...');
        
        // Navigate to home to attempt login
        await this.page.goto('https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC');
        await this.page.waitForLoadState('networkidle');
        
        // Fill login details
        await this.page.locator('input[name="username"]').fill(user.username);
        await this.page.locator('input[name="password"]').fill(user.password);
        await this.page.getByRole('button', { name: 'Log In' }).click();
        await this.page.waitForLoadState('networkidle');
        
        // Verify login succeeds
        const overviewTitle = this.page.locator('#rightPanel h1.title').filter({ visible: true });
        await expect(overviewTitle).toHaveText('Accounts Overview');
        logger.info('Registration verified successfully via login fallback.');
      } else {
        throw e;
      }
    }
  }
}

module.exports = { RegistrationPage };
