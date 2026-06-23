const { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const fs = require('fs-extra');
const path = require('path');
const { logger } = require('../utils/logger');

setDefaultTimeout(30000);

const pageFixture = {
  page: undefined
};

let browser;
let context;

BeforeAll(async function () {
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  const videosDir = path.join(process.cwd(), 'videos');
  const reportsDir = path.join(process.cwd(), 'reports');

  // Ensure directories exist
  fs.ensureDirSync(screenshotsDir);
  fs.ensureDirSync(videosDir);
  fs.ensureDirSync(reportsDir);

  // Clear old screenshots and videos before execution starts
  fs.emptyDirSync(screenshotsDir);
  fs.emptyDirSync(videosDir);
  logger.info('Cleaned old screenshots and videos directories.');

  logger.info('Initializing browser instance');
  browser = await chromium.launch({ headless: true });
});

Before(async function () {
  logger.info('Creating browser context and page');
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: './videos/',
      size: { width: 1280, height: 720 }
    }
  });
  const page = await context.newPage();
  pageFixture.page = page;
});

After(async function (scenario) {
  const isSuccess = scenario.result?.status === Status.PASSED;

  let videoPath = '';
  const video = pageFixture.page.video();
  if (video) {
    videoPath = await video.path();
  }

  if (isSuccess && scenario.pickle.name.toLowerCase().includes('login')) {
    // Capture and store successful login screenshot
    const screenshotPath = path.join(process.cwd(), 'screenshots', 'login_success.png');
    const screenshot = await pageFixture.page.screenshot({ path: screenshotPath, type: 'png' });
    await this.attach(screenshot, 'image/png');
    logger.info(`Screenshot captured after successful login: ${screenshotPath}`);
  }

  logger.info(`Closing page and context for scenario: ${scenario.pickle.name}`);
  await pageFixture.page.close();
  await context.close();

  // Rename/move successful login video, delete all other videos/failed run artifacts
  if (isSuccess && scenario.pickle.name.toLowerCase().includes('login') && videoPath) {
    const targetVideoPath = path.join(process.cwd(), 'videos', 'login_success.webm');
    
    // Wait for the video file to be completely written by Playwright
    let attempts = 0;
    while (!fs.existsSync(videoPath) && attempts < 15) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    if (fs.existsSync(videoPath)) {
      fs.moveSync(videoPath, targetVideoPath, { overwrite: true });
      logger.info(`Video successfully renamed to: ${targetVideoPath}`);
    }
  }

  // Final cleanup: remove any temporary browser videos left in the videos folder
  const videosDir = path.join(process.cwd(), 'videos');
  if (fs.existsSync(videosDir)) {
    const files = fs.readdirSync(videosDir);
    for (const file of files) {
      if (file !== 'login_success.webm') {
        fs.removeSync(path.join(videosDir, file));
      }
    }
  }
});

AfterAll(async function () {
  logger.info('Closing browser');
  await browser.close();
});

module.exports = { pageFixture };
