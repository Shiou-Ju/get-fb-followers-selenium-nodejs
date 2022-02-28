require('dotenv').config('./.env');

const webDriver = require('selenium-webdriver');
const loginFacebook = require('./loginFacebook');
const initDriver = require('./initDriver');

const { until, By } = webDriver;

const goToFanPage = async (driver) => {
  const fanPageUrl = 'https://www.facebook.com/legal.taiwan';
  const notificationClass = `//*[contains(@class,"fzdkajry")]`;
  await driver.wait(until.elementLocated(By.xpath(notificationClass)));
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
  const driver = await initDriver();
  await loginFacebook(driver);
  await goToFanPage(driver);
  await getFollowersNumber(driver);
};

main();
