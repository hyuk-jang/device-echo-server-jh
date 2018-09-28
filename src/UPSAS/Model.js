const _ = require('lodash');
const {BU} = require('base-util-jh');
const {BaseModel} = require('../../../device-protocol-converter-jh');

class Model extends BaseModel.UPSAS {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocolInfo
   * @param {mDeviceMap} mapInfo
   */
  constructor(protocolInfo, mapInfo) {
    super();
  }
}
module.exports = Model;
