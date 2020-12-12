/* eslint-disable global-require */
module.exports = {
  Inverter: {
    'das_1.3': 'das_1.3',
  },
  UPSAS: {
    muan6kW: require('./mapStorage/UPSAS/muan6kW'),
    muan100kW: require('./mapStorage/UPSAS/muan100kW'),
  },
  FP: {
    Naju: require('./mapStorage/FarmParallel/Naju.map'),
    Gangjin: require('./mapStorage/FarmParallel/Gangjin.map'),
    Boseong: require('./mapStorage/FarmParallel/Boseong.map'),
    Ochang: require('./mapStorage/FarmParallel/Ochang.map'),
    Yeongheung: require('./mapStorage/FarmParallel/Yeongheung.map'),
  },
  S2W: {
    grapeFarm: require('./mapStorage/S2W/grapeFarm.map'),
  },
  NI: {
    compressor: require('./mapStorage/NI/cDaq.map'),
  },
};
