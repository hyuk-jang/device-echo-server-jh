// eslint-disable-next-line import/no-dynamic-require
let dynamicModule = {};
// const dynamicModule = require(`./${process.env.P_MAIN_ID}/${process.env.P_SUB_ID}.js`);

const solarIot = require('./ETC/solarIot');
const fp = require('./fp/fp');
const compressor = require('./ni/compressor');
const s2w = require('./s2w/s2w');
const first = require('./STP/first');
const upsas = require('./upsas/upsas');

switch (process.env.P_MAIN_ID) {
  case 'ETC':
    dynamicModule = solarIot;
    break;
  case 'fp':
    dynamicModule = fp;
    break;
  case 'ni':
    dynamicModule = compressor;
    break;
  case 's2w':
    dynamicModule = s2w;
    break;
  case 'STP':
    dynamicModule = first;
    break;
  case 'upsas':
    dynamicModule = upsas;
    break;

  default:
    break;
}

module.exports = dynamicModule;
