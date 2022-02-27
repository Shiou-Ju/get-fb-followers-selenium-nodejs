require("dotenv").config;

const webDriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");
const fs = require("fs");

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

const openCrawler = async () => {
  const isDriverOk = checkDriver();
  if (isDriverOk) return;

  try {
    const serviceBuilder = new chrome.ServiceBuilder();
    const driver = await new webDriver.Builder()
      .forBrowser("chrome")
      .setChromeService(serviceBuilder)
      .build();

    const url = "http://google.com";
    await driver.get(url);
    await driver.findElement(By.name("q")).sendKeys("webdriver", Key.RETURN);
  } catch (error) {
    console.error(error);
    console.error("can not establish a new browser");
    return;
  }
};

openCrawler();
