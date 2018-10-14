const _ = require('lodash');
const { BU } = require('base-util-jh');

const { BaseModel } = require('../../../device-protocol-converter-jh');
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

  /**
   * 장치들의 초기값을 설정
   */
  init() {
    const {
      CO2,
      IS_RAIN,
      LUX,
      OUTSIDE_AIR_REH,
      OUTSIDE_AIR_TEMPERATURE,
      R1,
      SOIL_REH,
      SOIL_TEMPERATURE,
      PV_REAR_TEMPERATURE,
      SOIL_WATER_VALUE,
      SOLAR,
      WIND_DIRECTRION,
      WIND_SPEED,
      WRITE_DATE,
    } = this.device;
    this.nodeList.forEach(nodeInfo => {
      switch (nodeInfo.defId) {
        case CO2.KEY:
          nodeInfo.data = _.random(300, 500, true);
          break;
        case IS_RAIN.KEY:
          nodeInfo.data = _.random(0, 1);
          break;
        case LUX.KEY:
          nodeInfo.data = _.random(0, 130, true);
          break;
        case OUTSIDE_AIR_REH.KEY:
        case SOIL_REH.KEY:
          nodeInfo.data = _.random(30, 95, true);
          break;
        // 40 도를 올림
        case OUTSIDE_AIR_TEMPERATURE.KEY:
        case SOIL_TEMPERATURE.KEY:
        case PV_REAR_TEMPERATURE.KEY:
          nodeInfo.data = _.random(55, 75, true);
          break;
        case R1.KEY:
          nodeInfo.data = _.random(0, 10, true);
          break;
        case SOIL_WATER_VALUE.KEY:
          nodeInfo.data = _.random(40, 50, true);
          break;
        case SOLAR.KEY:
          nodeInfo.data = _.random(0, 1000, true);
          break;
        case WIND_DIRECTRION.KEY:
          nodeInfo.data = _.random(0, 360);
          break;
        case WIND_SPEED.KEY:
          nodeInfo.data = _.random(20, 30, true);
          break;
        case WRITE_DATE.KEY:
          nodeInfo.data = new Date();
          break;
        default:
          break;
      }
    });
  }
}
module.exports = Model;
