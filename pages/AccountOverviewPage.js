const { expect } = require('@playwright/test');

class AccountOverviewPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountTable = page.locator('#accountTable');
  }

  async verifyOnAccountOverviewPage() {
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
  }

  async getAccountBalance() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
    
    // Use getByText to find the first cell in the table that has a dollar sign
    const balanceCell = this.accountTable.getByText('$').first();
    await expect(balanceCell).toBeVisible({ timeout: 5000 });
    
    const balanceText = await balanceCell.innerText();
    return balanceText.trim();
  }
}

module.exports = { AccountOverviewPage };
