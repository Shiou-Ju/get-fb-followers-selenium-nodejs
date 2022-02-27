require("dotenv").config("./.env");

const webDriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const checkDriver = require("./checkDriver");

const { until, By } = webDriver;

const userName = process.env.FB_USER_NAME;
const passWord = process.env.FB_PASS_WORD;

const loginFacebook = async () => {
  const isDriverOk = checkDriver();
  if (!isDriverOk) {
    console.error("exit process");
    return;
  }

  try {
    const serviceBuilder = new chrome.ServiceBuilder();
    const driver = await new webDriver.Builder()
      .forBrowser("chrome")
      .setChromeService(serviceBuilder)
      .build();

    const url = "https://www.facebook.com/login";

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
  const fanPageUrl = "https://www.facebook.com/legal.taiwan";
  await driver.get(fanPageUrl);
};

const main = async () => {
  const driver = await loginFacebook();
  await goToFanPage(driver);
};

main();
