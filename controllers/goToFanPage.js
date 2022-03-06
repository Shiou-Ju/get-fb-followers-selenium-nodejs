require('dotenv').config('./.env');

const webDriver = require('selenium-webdriver');
const { until, By } = webDriver;

/**
 * 
 * @param {webDriver.WebDriver} driver 
 * @param {string} fanPageUrl 
 */
const goToFanPage = async (driver, fanPageUrl) => {
  const notificationClass = `//*[contains(@class,"fzdkajry")]`;
  const intervalToReduceFetchFrequency =
    Math.floor(Math.random() * 4 + 3) * 1000;
  await driver.sleep(intervalToReduceFetchFrequency);
  await driver.wait(until.elementLocated(By.xpath(notificationClass)));
  await driver.get(fanPageUrl);
};

module.exports = goToFanPage;
