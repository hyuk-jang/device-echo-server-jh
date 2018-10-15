const Promise = require('bluebird');
const net = require('net');
const _ = require('lodash');
const { BU } = require('base-util-jh');
// require('../../../src/inverter/das_1.3/EchoServer');
const Control = require('../../../src/Control');
require('../../../../default-intelligence');

const mapList = require('../../../src/mapList');

const { MainConverter } = require('../../../../device-protocol-converter-jh');

const EchoServer = require('../../../src/FarmParallel/dmTech/EchoServer');

/** @type {MainConverter} */
let mainConverter;
/** @type {Control} */
let control;
/** @type {EchoServer} */
let echoServer;

const protocolInfo = {
  mainCategory: 'FarmParallel',
  subCategory: 'dmTech',
  wrapperCategory: 'default',
  deviceId: 1,
};

/**
 *
 * @param {{deviceMap: mDeviceMap, socketPort: number, protocolInfo: protocol_info}} serverInfo
 */
function operationServer(serverInfo) {
  control = new Control(serverInfo.socketPort);
  echoServer = new EchoServer(serverInfo.protocolInfo, serverInfo.deviceMap);
  mainConverter = new MainConverter(serverInfo.protocolInfo);
  mainConverter.setProtocolConverter();

  control.attachDevice(serverInfo.protocolInfo, serverInfo.deviceMap);
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

// operationServer({ deviceMap: mapList.FP.YeongSanPo, socketPort: 9000, protocolInfo });
// startTest();

// MultiTest
for (let index = 9000; index < 9002; index++) {
  operationServer({ deviceMap: mapList.FP.Naju, socketPort: index, protocolInfo });
}

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
