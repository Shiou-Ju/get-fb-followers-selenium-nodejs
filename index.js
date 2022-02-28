require('dotenv').config('./.env');

const initDriver = require('./controllers/initDriver');
const loginFacebook = require('./controllers/loginFacebook');
const goToFanPage = require('./controllers/goToFanPage');
const getFollowersNumber = require('./controllers/getFollowersNumber');

const importFanPages = () => {
  const fanPages = [
    {
      fanPageName: '一起讀判決',
      fanPageUrl: 'https://www.facebook.com/legal.taiwan',
    },
    {
      fanPageName: '市宅街冰店',
      fanPageUrl: 'https://www.facebook.com/amabingdien/',
    },
  ];
  return fanPages;
};

const main = async () => {
  const fanPages = importFanPages();
  const driver = await initDriver();

  await loginFacebook(driver);

  const followersOfPages = [];
  for (const fanPage of fanPages) {
    const { fanPageName, fanPageUrl } = fanPage;
    await goToFanPage(driver, fanPageUrl);
    const result = await getFollowersNumber(driver, fanPageName);
    followersOfPages.push(result);
  }

  console.log(followersOfPages);

  driver.sleep(3000);
  driver.quit();
};

main();
