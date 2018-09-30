const {BU} = require('base-util-jh');
// require('../../../src/inverter/das_1.3/EchoServer');
const Control = require('../../../src/Control');

require('../../../../default-intelligence');

const mapList = require('../../../src/mapList');

function testConstruct() {
  /**
   * @type {protocol_info[]}
   */
  const deviceList = [
    {
      mainCategory: 'UPSAS',
      subCategory: 'xbee',
    },
    {
      mainCategory: 'UPSAS',
      subCategory: 'xbee',
    },
    {
      mainCategory: 'UPSAS',
      subCategory: 'xbee',
    },
  ];
  const control = new Control(9000);

  control.attachDevice(deviceList, mapList.UPSAS.muan6kW);

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
