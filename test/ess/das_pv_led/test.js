const {
  BU
} = require('base-util-jh');
// require('../../../src/inverter/das_1.3/EchoServer');
require('../../../src/format/defaultDefine');






function testConstruct() {
  const Control = require('../../../src/Control');
  /**
   * @type {Array.<protocol_info>}
   */
  const deviceList = [{
    deviceId: '000',
    mainCategory: 'ess',
    subCategory: 'das_pv_led',
    protocolOptionInfo: {
      hasTrackingData: true
    },
    option: {
      isUseKw: false
    }
  }, {
    deviceId: '002',
    mainCategory: 'ess',
    subCategory: 'das_pv_led',
    protocolOptionInfo: {
      hasTrackingData: true
    },
    option: {
      isUseKw: true
    }
  }, {
    deviceId: '002',
    mainCategory: 'ess',
    subCategory: 'das_pv_led',
    protocolOptionInfo: {
      hasTrackingData: true
    },
    option: {
      isUseKw: true
    }
  }];
  let control = new Control(9000);

  control.attachDevice(deviceList);

  // 2개 장치 구동
  if (control.deviceModelList.length !== 2) {
    throw new Error(`expect ${2}\t res: ${control.deviceModelList.length}`);
  }






}

function startTest() {
  const socketClient = require('net');

  let client = socketClient.createConnection(9000);


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

  // OPERATION
  setTimeout(() => {
    client.write('^P002ST7');
  }, 700);

  // OPERATION
  setTimeout(() => {
    client.write('^P002ST8');
  }, 800);

  // OPERATION
  setTimeout(() => {
    client.write('^P002ST9');
  }, 900);

} 
 

testConstruct();
startTest();


process.on('uncaughtException', function (err) {
  // BU.debugConsole();
  console.error(err.stack);
  console.log(err.message);
  console.log('Node NOT Exiting...');
});


process.on('unhandledRejection', function (err) {
  // BU.debugConsole();
  console.error(err.stack);
  console.log(err.message);
  console.log('Node NOT Exiting...');
});