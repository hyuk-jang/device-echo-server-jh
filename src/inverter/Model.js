'use strict';
const _ = require('lodash');

const {BaseModel} =  require('../../../device-protocol-converter-jh');

class Model extends BaseModel.Inverter {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocol_info
   */
  constructor(protocol_info) {
    super();

    // 국번 세팅
    let dialing = _.get(protocol_info, 'deviceId');

    console.trace(protocol_info);
    this.dialing = Buffer.isBuffer(dialing) ? dialing : this.makeMsg2Buffer(dialing);

    this.BASE = this.baseFormat;
  }
  
  reload(){
    this.BASE.gridLf = _.random(59.7, 60.5);
    this.BASE.gridRAmp = _.random(1.5, 8.3);
    this.BASE.gridRsVol = _.random(200, 245.9);
    this.BASE.gridSAmp = _.random(1.5, 8.3);
    this.BASE.gridStVol = _.random(200, 245.9);
    this.BASE.gridTAmp = _.random(1.5, 8.3);
    this.BASE.gridTrVol = _.random(200, 245.9);
    this.BASE.operIsError = _.random(0, 1);
    this.BASE.operIsRun = _.random(0, 1);
    this.BASE.operTemperature = _.random(15.1, 36.2);
    this.BASE.operTroubleList = [];
    this.BASE.operWarningList = [];
    this.BASE.powerCpKwh = _.random(1234.1, 3456.1);
    this.BASE.powerDailyKwh = _.random(1.1, 12.1);
    this.BASE.powerGridKw = _.random(0.3, 3.7);
    this.BASE.powerPf = _.divide(this.BASE.powerGridKw, this.BASE.powerPvKw);
    this.BASE.pvAmp = _.random(0.3, 7.7);
    this.BASE.pvVol = _.random(160.1, 190.1);
    this.BASE.pvKw = _.multiply(_.multiply(this.BASE.pvAmp, this.BASE.pvVol), 0.001) ;
    this.BASE.sysCapaKw = _.random(0.5, 20);
    this.BASE.sysIsSingle = _.random(0, 1);
    this.BASE.sysLineVoltage = this.BASE.sysIsSingle ? 220 : 380;
    this.BASE.sysProductYear = _.random(2015, 2018);
    this.BASE.sysSn = _.random(1, 9);
  }


}
module.exports = Model;