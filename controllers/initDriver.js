require('dotenv').config('./.env');

const webDriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const checkDriver = require('./checkDriver');
const { program: commander } = require('commander');

const getCommanderOpts = () => {
  commander.option('--hide-images', '不要顯示網站的圖片', false);
  commander.parse();
  return commander.opts();
};

const customizeOptions = () => {
  const { hideImages } = getCommanderOpts();
  const isHideImages = !!hideImages;

  const options = new chrome.Options();

  // hide images
  if (isHideImages) {
    options.addArguments('--blink-settings=imagesEnabled=false');
  }

  return options;
};

const initDriver = async () => {
  const isDriverOk = checkDriver();
  if (!isDriverOk) {
    console.error('exit process');
    return;
  }

  try {
    const serviceBuilder = new chrome.ServiceBuilder();
    const options = customizeOptions();

    const driver = await new webDriver.Builder()
      .forBrowser('chrome')
      .setChromeService(serviceBuilder)
      .setChromeOptions(options)
      .build();

    return driver;
  } catch (error) {
    console.error(error);
  }
};

module.exports = initDriver;
