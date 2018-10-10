const mapList = require('../../../src/mapList');

module.exports = [
  {
    connectInfo: {
      port: 8888,
      uuid: '001',
    },
    fp: {
      protocolInfo: {
        mainCategory: 'FarmParallel',
        subCategory: 'dmTech',
        wrapperCategory: 'default',
        deviceId: 1,
      },
      deviceMap: mapList.FP.YeongSanPo,
    },
    inverter: {
      protocolInfo: {
        mainCategory: 'Inverter',
        subCategory: 'das_1.3',
        wrapperCategory: 'default',
        deviceId: '001',
      },
    },
  },
  {
    connectInfo: {
      port: 8888,
      uuid: '002',
    },
    fp: {
      protocolInfo: {
        mainCategory: 'FarmParallel',
        subCategory: 'dmTech',
        wrapperCategory: 'default',
        deviceId: 1,
      },
      deviceMap: mapList.FP.YeongSanPo,
    },
    inverter: {
      protocolInfo: {
        mainCategory: 'Inverter',
        subCategory: 'das_1.3',
        wrapperCategory: 'default',
        deviceId: '001',
      },
    },
  },
];
