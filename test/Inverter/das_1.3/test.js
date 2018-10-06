const { BU } = require('base-util-jh');
// require('../../../src/inverter/das_1.3/EchoServer');
const Control = require('../../../src/Control');

require('../../../../default-intelligence');

function testConstruct() {
  /**
   * @type {protocol_info[]}
   */
  const deviceList = [
    {
      deviceId: '001',
      mainCategory: 'inverter',
      subCategory: 'das_1.3',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        isUseKw: false,
      },
    },
    {
      deviceId: '001',
      mainCategory: 'inverter',
      subCategory: 'das_1.3',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        isUseKw: true,
      },
    },
    {
      deviceId: '002',
      mainCategory: 'inverter',
      subCategory: 'das_1.3',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        isUseKw: true,
      },
    },
  ];
  const control = new Control(9000);

  control.attachDevice(deviceList);

  // 2개 장치 구동
  if (control.deviceModelList.length !== 2) {
    throw new Error(`expect ${2}\t res: ${control.deviceModelList.length}`);
  }
}

function startTest() {
  const socketClient = require('net');

  const client = socketClient.createConnection(9000);

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

testConstruct();
startTest();

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
