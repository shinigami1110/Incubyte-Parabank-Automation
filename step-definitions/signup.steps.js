const { Given, When, Then } = require('@cucumber/cucumber');
const { pageFixture } = require('../hooks/hooks');
const { HomePage } = require('../pages/HomePage');
const { RegistrationPage } = require('../pages/RegistrationPage');
const { generateRandomUser } = require('../utils/randomUserGenerator');
const { testDataStore } = require('../utils/testData');
const { logger } = require('../utils/logger');

let homePage;
let registrationPage;

Given('user navigates to Parabank website', async function () {
  homePage = new HomePage(pageFixture.page);
  registrationPage = new RegistrationPage(pageFixture.page);
  
  // Set connection type to SOAP to ensure registration succeeds
  await homePage.setConnectionTypeViaUrl('SOAP');
});

When('user registers with valid details', async function () {
  const randomUser = generateRandomUser();
  // Save credentials for the login scenario
  testDataStore.setRegisteredUser(randomUser);
  
  logger.info(`Clicking register link`);
  await homePage.clickRegisterLink();
  
  logger.info(`Registering user: ${randomUser.username}`);
  await registrationPage.register(randomUser);
});

Then('account should be created successfully', async function () {
  logger.info('Verifying registration success');
  const user = testDataStore.getRegisteredUser();
  await registrationPage.verifyRegistrationSuccess(user);
  
  // Switch back to JDBC connection type to satisfy the objective
  await homePage.setConnectionTypeViaUrl('JDBC');
});
