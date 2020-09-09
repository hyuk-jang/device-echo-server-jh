// eslint-disable-next-line import/no-dynamic-require
const dynamicModule = require(`./${process.env.P_MAIN_ID}/${process.env.P_SUB_ID}`);

module.exports = dynamicModule;
