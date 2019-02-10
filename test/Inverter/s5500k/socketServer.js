const net = require('net');

const { BU } = require('base-util-jh');
// require('../../../src/inverter/s5500k/EchoServer');
const Control = require('../../../src/Control');

require('../../../../default-intelligence');

function operationServer() {
  /**
   * @type {protocol_info[]}
   */
  const deviceList = [
    {
      deviceId: '\u0001',
      mainCategory: 'Inverter',
      subCategory: 's5500k',
      // wrapperCategory: 'default',
      protocolOptionInfo: {
        hasTrackingData: true,
      },
      option: {
        amount: 5.5,
      },
    },
    // {
    //   deviceId: '\u0002',
    //   mainCategory: 'Inverter',
    //   subCategory: 's5500k',
    //   // wrapperCategory: 'default',
    //   protocolOptionInfo: {
    //     hasTrackingData: true,
    //   },
    //   option: {
    //     amount: 5.5,
    //   },
    // },
  ];
  const control = new Control(9001);

  control.attachDevice(deviceList);
}

function startTest() {
  const client = net.createConnection(9001);

  client.on('data', data => {
    BU.CLI(data.toString());
  });
  // Sytem
  setTimeout(() => {
    client.write(Buffer.from([0x0a, 0x96, 0x01, 0x54, 0x18, 0x05, 0x6d]));
  }, 100);
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
