require('dotenv').config('./.env');
const checkOnline = require('is-online');

/**@typedef {string|number|boolean|null|undefined} env */

const preCheck = async () => {
  const isOnline = await checkOnline();
  if (!isOnline) {
    console.error('沒有網路連線');
    return false;
  }

  try {
    /** @type {env[]} */
    const envsToCheck = ['FB_USER_NAME', 'FB_PASS_WORD'];
    checkEnv(envsToCheck);
  } catch (error) {
    console.error(error);
    return false;
  }

  console.log('environment ready!')
  return true;
};

/**
 * @param {env[]} envs
 */
const checkEnv = (envs) => {
  const missingEnvs = [];

  /**
   * @param {env} env
   */
  envs.forEach((env) => {
    const isExist = process.env[env];
    if (!isExist) {
      missingEnvs.push(env);
    }
  });

  const hasAnyMissingEnv = !!missingEnvs.length;
  if (hasAnyMissingEnv) {
    throw new Error(`env 缺少 ${missingEnvs} `);
  }
};

module.exports = preCheck;
