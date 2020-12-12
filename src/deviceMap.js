/* eslint-disable global-require */
module.exports = {
  ETC: {
    solarIot: require('./mapStorage/ETC/solarIot'),
  },
  FP: {
    Naju: require('./mapStorage/FarmParallel/Naju.map'),
    Gangjin: require('./mapStorage/FarmParallel/Gangjin.map'),
    Boseong: require('./mapStorage/FarmParallel/Boseong.map'),
    Ochang: require('./mapStorage/FarmParallel/Ochang.map'),
    Yeongheung: require('./mapStorage/FarmParallel/Yeongheung.map'),
  },
  Inverter: {
    'das_1.3': 'das_1.3',
  },
  S2W: {
    grapeFarm: require('./mapStorage/S2W/grapeFarm.map'),
  },
  NI: {
    compressor: require('./mapStorage/NI/cDaq.map'),
  },
  UPSAS: {
    muan6kW: require('./mapStorage/UPSAS/muan6kW'),
    muan100kW: require('./mapStorage/UPSAS/muan100kW'),
  },
};
