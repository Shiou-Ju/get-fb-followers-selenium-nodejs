require('dotenv').config('./.env');

const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');

const filePath = './chromedriver';
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
      console.log('done setting route');
    } else {
      console.error('can not mount driver route');
      return false;
    }
  }
  console.log('driver checked!');
  return true;
};

module.exports = checkDriver;
