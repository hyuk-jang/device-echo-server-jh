const SimulatorApp = require('./SimulatorApp');

module.exports = SimulatorApp;

if (require !== undefined && require.main === module) {
  console.log('__main__');
  const deviceMap = require('../deviceMap');
  const EchoServer = require('../UPSAS/xbee/EchoServer');
  const echoServer = new EchoServer(
    {
      mainCategory: 'UPSAS',
      subCategory: 'xbee',
      parserOption: {
        parser: 'delimiterParser',
        option: '}',
      },
    },
    deviceMap.UPSAS.muan6kW,
  );
  const simulatorApp = new SimulatorApp(3000, echoServer);
  simulatorApp.init();
}
