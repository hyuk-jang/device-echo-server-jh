module.exports = {
  Inverter: {
    'das_1.3': 'das_1.3',
  },
  UPSAS: {
    muan6kW: require('./mapStorage/UPSAS/muan6kW'),
  },
  FP: {
    Naju: require('./mapStorage/FarmParallel/Naju.map'),
    Gangjin: require('./mapStorage/FarmParallel/Gangjin.map'),
    Boseong: require('./mapStorage/FarmParallel/Boseong.map'),
    Ochang: require('./mapStorage/FarmParallel/Ochang.map'),
    Yeongheung: require('./mapStorage/FarmParallel/Yeongheung.map'),
  },
};
