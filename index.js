require("dotenv").config("./.env");

const webDriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");
const fs = require("fs");
const { setTimeout } = require("timers/promises");

const filePath = "./chromedriver";
const driverPath = path.join(__dirname, filePath);

const checkDriver = () => {
  try {
    chrome.getDefaultService();
  } catch (err) {
    console.log(driverPath);

    const isExistChromeDriver = fs.existsSync(driverPath);
    if (isExistChromeDriver) {
      const service = new chrome.ServiceBuilder(driverPath).build();
      chrome.setDefaultService(service);
      console.log("done setting route");
    } else {
      console.error("can not mount driver route");
      return false;
    }
    return true;
  }
};

const loginFacebook = async () => {
  const isDriverOk = checkDriver();
  if (isDriverOk) return;

  const { until, By } = webDriver;

  const userName = process.env.FB_USER_NAME;
  const passWord = process.env.FB_PASS_WORD;

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
  } catch (error) {
    console.error(error);
  }
};

loginFacebook();
