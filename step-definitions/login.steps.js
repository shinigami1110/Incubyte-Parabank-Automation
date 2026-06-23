const { Given, When, Then } = require('@cucumber/cucumber');
const { pageFixture } = require('../hooks/hooks');
const { HomePage } = require('../pages/HomePage');
const { LoginPage } = require('../pages/LoginPage');
const { RegistrationPage } = require('../pages/RegistrationPage');
const { AccountOverviewPage } = require('../pages/AccountOverviewPage');
const { generateRandomUser } = require('../utils/randomUserGenerator');
const { testDataStore } = require('../utils/testData');
const { logger } = require('../utils/logger');

let homePage;
let loginPage;
let registrationPage;
let accountOverviewPage;

Given('user has a registered account', async function () {
  homePage = new HomePage(pageFixture.page);
  loginPage = new LoginPage(pageFixture.page);
  registrationPage = new RegistrationPage(pageFixture.page);
  accountOverviewPage = new AccountOverviewPage(pageFixture.page);

  const targetUrl = 'https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC';
  
  let user;
  try {
    user = testDataStore.getRegisteredUser();
    logger.info(`Found registered user: ${user.username} in test data store.`);
    logger.info(`Navigating to ${targetUrl} for login`);
    await homePage.navigateTo(targetUrl);
  } catch (error) {
    logger.warn('No user has been registered in this run yet. Registering a user dynamically first...');
    
    // Set connection type to SOAP to ensure registration succeeds
    await homePage.setConnectionTypeViaUrl('SOAP');
    await homePage.clickRegisterLink();
    
    user = generateRandomUser();
    await registrationPage.register(user);
    await registrationPage.verifyRegistrationSuccess(user);
    testDataStore.setRegisteredUser(user);
    
    // Set connection type back to JDBC to prepare for the login scenario
    await homePage.setConnectionTypeViaUrl('JDBC');
    
    // Log out first so we can log back in
    logger.info('Logging out after registration to prepare for login scenario');
    await pageFixture.page.locator('a[href*="logout.htm"]').click();
    await pageFixture.page.waitForLoadState('networkidle');
  }
});

When('user logs in', async function () {
  // Retrieve saved credentials
  const user = testDataStore.getRegisteredUser();
  logger.info(`Attempting login for user: ${user.username}`);
  await loginPage.login(user.username, user.password);
});

Then('account overview page should be displayed', async function () {
  logger.info('Verifying navigation to Account Overview page');
  await accountOverviewPage.verifyOnAccountOverviewPage();
});

Then('account balance should be printed', async function () {
  logger.info('Reading account balance');
  const balance = await accountOverviewPage.getAccountBalance();
  logger.info(`Account Balance: ${balance}`);
  console.log(`\n=========================================`);
  console.log(`ACCOUNT BALANCE RECORDED: ${balance}`);
  console.log(`=========================================\n`);
});
