const net = require('net');

const { BU } = require('base-util-jh');
// require('../../../src/inverter/das_1.3/EchoServer');
const Control = require('../../../src/Control');

require('../../../../default-intelligence');

function operationServer() {
  /**
   * @type {protocol_info[]}
   */
  const deviceList = [
    {
      deviceId: '001',
      mainCategory: 'Inverter',
      subCategory: 'das_1.3',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 33.3,
      },
    },
    {
      deviceId: '001',
      mainCategory: 'Inverter',
      subCategory: 'das_1.3',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 10,
      },
    },
    {
      deviceId: '002',
      mainCategory: 'Inverter',
      subCategory: 'das_1.3',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 33.3,
      },
    },
    {
      deviceId: '003',
      mainCategory: 'Inverter',
      subCategory: 'das_1.3',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 33.3,
      },
    },
    {
      deviceId: '004',
      mainCategory: 'Inverter',
      subCategory: 'das_1.3',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 33.3,
      },
    },
    {
      deviceId: '005',
      mainCategory: 'Inverter',
      subCategory: 'das_1.3',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 33.3,
      },
    },
    {
      deviceId: '006',
      mainCategory: 'Inverter',
      subCategory: 'das_1.3',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 33.3,
      },
    },
    {
      deviceId: '007',
      mainCategory: 'Inverter',
      subCategory: 'das_1.3',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 33.3,
      },
    },
  ];
  const control = new Control(9001);

  control.attachDevice(deviceList);
}

function startTest() {
  const client = net.createConnection(9000);

  client.on('data', data => {
    BU.CLI(data.toString());
  });
  // Sytem
  setTimeout(() => {
    client.write('^P000MOD');
  }, 100);

  // PV
  setTimeout(() => {
    client.write('^P002ST1');
  }, 200);

  // GRID VOL
  setTimeout(() => {
    client.write('^P002ST2');
  }, 300);

  // GRID AMP
  setTimeout(() => {
    client.write('^P000ST3');
  }, 400);

  // POWER
  setTimeout(() => {
    client.write('^P000ST4');
  }, 500);

  // OPERATION
  setTimeout(() => {
    client.write('^P002ST6');
  }, 600);
}

operationServer();
// startTest();

process.on('uncaughtException', err => {
  // BU.debugConsole();
  console.error(err.stack);
  console.log(err.message);
  console.log('Node NOT Exiting...');
});

process.on('unhandledRejection', err => {
  // BU.debugConsole();
  console.error(err.stack);
  console.log(err.message);
  console.log('Node NOT Exiting...');
});
