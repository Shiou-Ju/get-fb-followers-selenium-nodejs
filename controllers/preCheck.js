require('dotenv').config('./.env');
const checkOnline = require('is-online');
const fs = require('fs');

/**@typedef {string|number|boolean|null|undefined} env */

const preCheck = async () => {
  const isOnline = await checkOnline();
  if (!isOnline) {
    console.error('沒有網路連線');
    return false;
  }

  const getDotEnvVariables = () => {
    const fileContent = fs.readFileSync('./.env', 'utf-8');
    const envArrays = fileContent.split('\n');
    const result = envArrays.map((env) => {
      const [splitEqual] = env.split(' =');
      return splitEqual;
    });
    return result;
  };

  try {
    /** @type {env[]} */
    const envsToCheck = getDotEnvVariables();
    checkEnv(envsToCheck);
  } catch (error) {
    console.error(error);
    return false;
  }

  console.log('environment ready!');
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
    const isExist = !!process.env[env];
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
