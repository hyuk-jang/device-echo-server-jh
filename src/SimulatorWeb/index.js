const SimulatorApp = require('./SimulatorApp');

module.exports = SimulatorApp;

if (require !== undefined && require.main === module) {
  console.log('__main__');
  const deviceMap = require('../deviceMap');
  const simulatorApp = new SimulatorApp(3000, deviceMap.UPSAS.muan6kW);
  simulatorApp.init();
}
