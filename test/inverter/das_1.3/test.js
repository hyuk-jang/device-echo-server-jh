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
    deviceId: '001',
    mainCategory: 'inverter',
    subCategory: 'das_1.3',
    option: true
  }, {
    deviceId: '002',
    mainCategory: 'inverter',
    subCategory: 'das_1.3',
    option: false
  }, {
    deviceId: '002',
    mainCategory: 'inverter',
    subCategory: 'das_1.3',
    option: true
  }];
  let control = new Control(9000);

  control.attachDevice(deviceList);

  // 2개 장치 구동
  if (control.deviceModelList.length !== 2) {
    throw new Error(`expect ${2}\t res: ${control.deviceModelList.length}`);
  }





  function startTest() {
    const Socket = require('net');

    let client = Socket.createConnection(9000);
  
  
    client.on('data', data => {
      BU.CLI(data.toString());
    });
    // Sytem
    setTimeout(() => {
      client.write('^P001MOD');
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
      client.write('^P001ST3');
    }, 400);

    // POWER
    setTimeout(() => {
      client.write('^P001ST4');
    }, 500);

    // OPERATION
    setTimeout(() => {
      client.write('^P002ST6');
    }, 600);

  }
}

  
 

testConstruct();



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