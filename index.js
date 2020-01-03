const Control = require('./src/Control');
const Main = require('./src/Main');
const config = require('./config');

module.exports = Control;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const main = new Main();

  main.init(config.fp);

  // const controlList = main.createServer(config.fp);
  // const controlList = main.createServer([config.fp[0]]);

  // const control = main.getEchoServer('001')

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
