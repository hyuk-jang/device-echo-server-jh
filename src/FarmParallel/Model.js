const _ = require('lodash');
const {BU} = require('base-util-jh');

const {BaseModel} = require('../../../device-protocol-converter-jh');
const AbstModel = require('../Default/AbstModel');

class Model extends AbstModel {
  /**
   * @param {protocol_info} protocolInfo
   * @param {mDeviceMap} deviceMap
   */
  constructor(protocolInfo, deviceMap) {
    super(protocolInfo, deviceMap);

    // Intellisense를 위한 device 재정의
    this.device = new BaseModel.FarmParallel(protocolInfo).device;
  }
}
module.exports = Model;
