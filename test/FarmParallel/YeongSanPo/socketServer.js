const Promise = require('bluebird');
const net = require('net');
const _ = require('lodash');
const { BU } = require('base-util-jh');
// require('../../../src/inverter/das_1.3/EchoServer');
const Control = require('../../../src/Control');
require('../../../../default-intelligence');

const mapList = require('../../../src/mapList');

const { MainConverter } = require('../../../../device-protocol-converter-jh');

const EchoServer = require('../../../src/FarmParallel/YeongSanPo/EchoServer');

/** @type {MainConverter} */
let mainConverter;
/** @type {Control} */
let control;
/** @type {EchoServer} */
let echoServer;
function operationServer() {
  /**
   * @type {protocol_info[]}
   */
  const deviceList = [
    {
      mainCategory: 'FarmParallel',
      subCategory: 'YeongSanPo',
      // wrapperCategory: 'default',
      deviceId: 1,
    },
  ];
  control = new Control(9000);
  BU.CLI(_.head(deviceList));
  echoServer = new EchoServer(_.head(deviceList), mapList.FP.YeongSanPo);
  mainConverter = new MainConverter(_.head(deviceList));
  mainConverter.setProtocolConverter();

  control.attachDevice(deviceList, mapList.FP.YeongSanPo);

  // 2개 장치 구동
  if (control.deviceModelList.length !== 1) {
    throw new Error(`expect ${1}\t res: ${control.deviceModelList.length}`);
  }
}

async function startTest() {
  const client = net.createConnection(9000);

  client.on('data', data => {
    BU.CLI(data);
  });

  // BU.CLI(mainConverter);
  // BU.CLI(echoServer);
  // BU.CLI(echoServer.device);
  let cmdList = mainConverter.generationCommand({ key: echoServer.device.DEFAULT.KEY, value: 2 });
  let writeMsg = _.head(cmdList).data;
  BU.CLI(writeMsg);

  // Socket Server 접속 기다림
  await Promise.delay(10);

  client.write(writeMsg);

  await Promise.delay(1000);
  cmdList = mainConverter.generationCommand({ key: echoServer.device.LUX.KEY, value: 2 });
  writeMsg = _.head(cmdList).data;
  BU.CLI(writeMsg);
  client.write(writeMsg);
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