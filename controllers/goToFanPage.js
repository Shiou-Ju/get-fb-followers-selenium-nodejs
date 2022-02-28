require('dotenv').config('./.env');

const webDriver = require('selenium-webdriver');
const { until, By } = webDriver;

const goToFanPage = async (driver, fanPageUrl) => {
  const notificationClass = `//*[contains(@class,"fzdkajry")]`;
  await driver.wait(until.elementLocated(By.xpath(notificationClass)));
  await driver.get(fanPageUrl);
};

module.exports = goToFanPage;
