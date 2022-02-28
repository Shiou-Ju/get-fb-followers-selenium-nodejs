require('dotenv').config('./.env');

const webDriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const checkDriver = require('./checkDriver');

const initDriver = async () => {
  const isDriverOk = checkDriver();
  if (!isDriverOk) {
    console.error('exit process');
    return;
  }

  try {
    const serviceBuilder = new chrome.ServiceBuilder();
    const driver = await new webDriver.Builder()
      .forBrowser('chrome')
      .setChromeService(serviceBuilder)
      .build();

    return driver;
  } catch (error) {
    console.error(error);
  }
};

module.exports = initDriver;
