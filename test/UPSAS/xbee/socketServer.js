const Promise = require('bluebird');
const { BU } = require('base-util-jh');
// require('../../../src/inverter/das_1.3/EchoServer');
const Control = require('../../../src/Control');

require('../../../../default-intelligence');

const mapList = require('../../../src/mapList');

function operationServer() {
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
  if (control.deviceModelList.length !== 1) {
    throw new Error(`expect ${1}\t res: ${control.deviceModelList.length}`);
  }
}

async function startTest() {
  const socketClient = require('net');

  const client = socketClient.createConnection(9000);

  client.on('data', data => {
    BU.CLI(data.toString());
  });

  /** @type {xbeeApi_0x10} */
  const writeMsg = {
    destination64: '0013A20040F7ACC8',
    data: '@cgo',
  };

  // Socket SErver 접속 기다림
  await Promise.delay(10);

  // 수문 개방 요청
  client.write(JSON.stringify(writeMsg));

  await Promise.delay(1000);

  writeMsg.data = '@sts';
  // 개방 상태 확인
  client.write(JSON.stringify(writeMsg));
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
