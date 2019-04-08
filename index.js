const Control = require('./src/Control');

module.exports = Control;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const control = new Control(9000);
  control.attachDevice(
    {
      mainCategory: 'UPSAS',
      subCategory: 'xbee',
    },
    control.deviceMapInfo.UPSAS.muan6kW,
  );

  process.on('uncaughtException', err => {
    // BU.debugConsole();
    console.error(err);
    console.log('Node NOT Exiting...');
  });

  process.on('unhandledRejection', err => {
    // BU.debugConsole();
    console.error(err);
    console.log('Node NOT Exiting...');
  });
}
