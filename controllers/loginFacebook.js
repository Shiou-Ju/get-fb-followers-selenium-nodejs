require('dotenv').config('./.env');

const webDriver = require('selenium-webdriver');

const { until, By } = webDriver;

const userName = process.env.FB_USER_NAME;
const passWord = process.env.FB_PASS_WORD;

/**
 * 
 * @param {webDriver.WebDriver} driver 
 * @returns 
 */
const loginFacebook = async (driver) => {
  try {
    const url = 'https://www.facebook.com/login';

    await driver.get(url);

    const emailXpath = `//*[@id="email"]`;
    const pwXpath = `//*[@id="pass"]`;
    const loginXpath = `//*[@id="loginbutton"]`;

    const emailElement = await driver.wait(
      until.elementLocated(By.xpath(emailXpath))
    );
    const pwElement = await driver.wait(
      until.elementLocated(By.xpath(pwXpath))
    );
    const loginBtn = await driver.wait(
      until.elementLocated(By.xpath(loginXpath))
    );

    await emailElement.sendKeys(userName);
    await pwElement.sendKeys(passWord);

    await loginBtn.click();
    return driver;
  } catch (error) {
    console.error(error);
  }
};

module.exports = loginFacebook;
