require('dotenv').config('./.env');

const preCheck = require('./controllers/preCheck');
const initDriver = require('./controllers/initDriver');
const importFanPages = require('./controllers/importFanPages');
const loginFacebook = require('./controllers/loginFacebook');
const goToFanPage = require('./controllers/goToFanPage');
const getFollowersNumber = require('./controllers/getFollowersNumber');

const main = async () => {
  const isEnvironmentReady = await preCheck();
  if (!isEnvironmentReady) return;

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
