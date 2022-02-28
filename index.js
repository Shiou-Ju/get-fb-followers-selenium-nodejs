require('dotenv').config('./.env');

const webDriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const checkDriver = require('./checkDriver');

const { until, By } = webDriver;

const userName = process.env.FB_USER_NAME;
const passWord = process.env.FB_PASS_WORD;

const loginFacebook = async () => {
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

const goToFanPage = async (driver) => {
  const notificationClass = `//*[contains(@class,"fzdkajry")]`;
  await driver.wait(until.elementLocated(By.xpath(notificationClass)));
  const fanPageUrl = 'https://www.facebook.com/legal.taiwan';
  await driver.get(fanPageUrl);
};

const getFollowersNumber = async (driver) => {
  const fanPageName = '一起讀判決';

  const initResultObject = () => {
    return {
      fanPageName,
      followersNumber: null,
      isAccurate: true,
    };
  };
  const result = initResultObject();

  const targetClassXpath = `//*[contains(@class,"knvmm38d")]`;
  /** @type {webDriver.WebElement[]} */
  const elementsWithSameClass = await driver.wait(
    until.elementsLocated(By.xpath(targetClassXpath))
  );

  const allElementsText = [];

  const classicDisplayText = '人在追蹤';
  const newDisplayText = '萬位追蹤者';
  for (const element of elementsWithSameClass) {
    const elementText = await element.getText();

    const hasClassicDisplayText = elementText.includes(classicDisplayText);
    const hasNewDisplayText = elementText.includes(newDisplayText);

    if (hasClassicDisplayText) {
      result.followersNumber = elementText;
      allElementsText.push(elementText);
    } else if (hasNewDisplayText) {
      const tenThousands = elementText.replace(newDisplayText, '');
      result.followersNumber = parseFloat(tenThousands) * 10000;
      result.isAccurate = false;
      allElementsText.push(elementText);
    } else {
      /** 此種做法，若最後文字有數字，則會被取代為該數字。例如：「80萬元交保」 */
      // const accurateNumber = elementText.replace(/\D/g, '');
      // result.followersNumber = accurateNumber;
    }
  }

  if (!result.followersNumber) {
    console.log(result.followersNumber);
    console.error(allElementsText.join('\n'));
    throw new Error('找不到追蹤人數');
  }

  console.log(result);
  return result;
};

const main = async () => {
  const driver = await loginFacebook();
  await goToFanPage(driver);
  await getFollowersNumber(driver);
};

main();
