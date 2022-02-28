require('dotenv').config('./.env');

const initDriver = require('./initDriver');
const loginFacebook = require('./loginFacebook');
const goToFanPage = require('./goToFanPage');
const getFollowersNumber = require('./getFollowersNumber');

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
};

main();
