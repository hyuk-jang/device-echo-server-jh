const mapList = require('../../../src/mapList');

module.exports = [
  {
    connectInfo: {
      port: 8001,
      uuid: '001',
    },
    fp: {
      protocolInfo: {
        mainCategory: 'FarmParallel',
        subCategory: 'dmTech',
        wrapperCategory: 'default',
        deviceId: 1,
      },
      deviceMap: mapList.FP.Naju,
    },
    inverter: {
      protocolList: [
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '001',
        },
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '002',
        },
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '003',
        },
      ],
    },
  },
  {
    connectInfo: {
      port: 8001,
      uuid: '002',
    },
    fp: {
      protocolInfo: {
        mainCategory: 'FarmParallel',
        subCategory: 'dmTech',
        wrapperCategory: 'default',
        deviceId: 2,
      },
      deviceMap: mapList.FP.Gangjin,
    },
    inverter: {
      protocolList: [
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '001',
        },
      ],
    },
  },
  {
    connectInfo: {
      port: 8001,
      uuid: '003',
    },
    fp: {
      protocolInfo: {
        mainCategory: 'FarmParallel',
        subCategory: 'dmTech',
        wrapperCategory: 'default',
        deviceId: 3,
      },
      deviceMap: mapList.FP.Boseong,
    },
    inverter: {
      protocolList: [
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '001',
        },
      ],
    },
  },
  {
    connectInfo: {
      port: 8001,
      uuid: '004',
    },
    fp: {
      protocolInfo: {
        mainCategory: 'FarmParallel',
        subCategory: 'dmTech',
        wrapperCategory: 'default',
        deviceId: 4,
      },
      deviceMap: mapList.FP.Ochang,
    },
    inverter: {
      protocolList: [
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '001',
        },
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '002',
        },
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '003',
        },
      ],
    },
  },
  {
    connectInfo: {
      port: 8001,
      uuid: '005',
    },
    fp: {
      protocolInfo: {
        mainCategory: 'FarmParallel',
        subCategory: 'dmTech',
        wrapperCategory: 'default',
        deviceId: 5,
      },
      deviceMap: mapList.FP.Yeongheung,
    },
    inverter: {
      protocolList: [
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '001',
        },
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '002',
        },
        {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          deviceId: '003',
        },
      ],
    },
  },
];
