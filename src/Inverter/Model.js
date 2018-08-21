const _ = require('lodash');

const {BaseModel} = require('../../../device-protocol-converter-jh');

class Model extends BaseModel.Inverter {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocolInfo
   */
  constructor(protocolInfo) {
    super();

    // 국번 세팅
    const dialing = _.get(protocolInfo, 'deviceId');

    this.dialing = this.protocolConverter.makeMsg2Buffer(dialing);

    this.BASE = BaseModel.Inverter.BASE_MODEL;
    this.BASE.powerCpKwh = 100; // 100 kWh 부터 시작
    this.index = 0;

    this.reload();
    setInterval(() => {
      this.reload();
    }, 10000);
  }

  reload() {
    this.BASE.pvAmp = _.random(0.3, 7.7);
    this.BASE.pvVol = _.random(160.1, 190.1);
    this.BASE.pvKw = _.multiply(_.multiply(this.BASE.pvAmp, this.BASE.pvVol), 0.001);
    this.BASE.gridLf = _.random(59.7, 60.5);
    this.BASE.gridRAmp = _.multiply(this.BASE.pvAmp, _.random(0.8, 0.99));
    this.BASE.gridRsVol = _.multiply(this.BASE.pvVol, _.random(0.9, 1.0));
    this.BASE.gridSAmp = _.multiply(this.BASE.pvAmp, _.random(0.8, 0.99));
    this.BASE.gridStVol = _.multiply(this.BASE.pvVol, _.random(0.9, 1.0));
    this.BASE.gridTAmp = _.multiply(this.BASE.pvAmp, _.random(0.8, 0.99));
    this.BASE.gridTrVol = _.multiply(this.BASE.pvVol, _.random(0.9, 1.0));
    this.BASE.operIsError = _.random(0, 1);
    this.BASE.operIsRun = _.random(0, 1);
    this.BASE.operTemperature = _.random(15.1, 36.2);
    this.BASE.operTroubleList = [];
    this.BASE.operWarningList = [];
    this.BASE.sysCapaKw = _.random(0.5, 20);
    this.BASE.sysIsSingle = _.random(0, 1);
    this.BASE.sysLineVoltage = this.BASE.sysIsSingle ? 220 : 380;
    this.BASE.sysProductYear = _.random(2015, 2018);
    this.BASE.sysSn = _.random(1, 9);
    this.BASE.powerCpKwh += _.random(0.1, 1);
    this.BASE.powerDailyKwh = _.sum([10, this.index]);
    this.BASE.powerPvKw = this.BASE.pvKw;
    this.BASE.powerGridKw = _.divide(_.multiply(this.BASE.gridRAmp, this.BASE.gridRsVol), 1000);
    this.BASE.powerPf = _.multiply(_.divide(this.BASE.powerGridKw, this.BASE.powerPvKw), 100);

    this.index += 1;
  }
}
module.exports = Model;