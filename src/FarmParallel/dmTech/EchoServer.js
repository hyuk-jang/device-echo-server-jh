const _ = require('lodash');

const {BU} = require('base-util-jh');

const Model = require('../Model');

class EchoServer extends Model {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocolInfo
   * @param {mDeviceMap} deviceMap
   */
  constructor(protocolInfo, deviceMap) {
    super(protocolInfo, deviceMap);

    this.init();
    // BU.CLI(this.nodeList);

    this.bufDataBattery = Buffer.from([0x31, 0x30, 0x2e, 0x32]);

    this.normalDeviceOperTime = 500;
    this.pumpDeviceOperTime = 1000;
  }

  /**
   * 장치들의 초기값을 설정
   */
  init() {
    const {
      CO2,
      DEFAULT,
      IS_RAIN,
      LUX,
      OUTSIDE_AIR_REH,
      OUTSIDE_AIR_TEMPERATURE,
      R1,
      SOIL_REH,
      SOIL_TEMPERATURE,
      SOIL_WATER_VALUE,
      SOLAR,
      WIND_DIRECTRION,
      WIND_SPEED,
      WRITE_DATE,
    } = this.device;
    this.nodeList.forEach(nodeInfo => {
      switch (nodeInfo.defId) {
        case CO2.KEY:
          nodeInfo.data = _.random(300, 500);
          break;
        case IS_RAIN.KEY:
          nodeInfo.data = _.random(0, 1);
          break;
        case LUX.KEY:
          nodeInfo.data = _.random(0, 30);
          break;
        case OUTSIDE_AIR_REH.KEY:
        case SOIL_REH.KEY:
          nodeInfo.data = _.random(30, 95);
          break;
        case OUTSIDE_AIR_TEMPERATURE.KEY:
        case SOIL_TEMPERATURE.KEY:
          nodeInfo.data = _.random(15, 35);
          break;
        case R1.KEY:
          nodeInfo.data = _.random(0, 35);
          break;
        case SOIL_WATER_VALUE.KEY:
          nodeInfo.data = _.random(0, 50);
          break;
        case SOLAR.KEY:
          nodeInfo.data = _.random(0, 1000);
          break;
        case WIND_DIRECTRION.KEY:
          nodeInfo.data = _.random(0, 360);
          break;
        case WIND_SPEED.KEY:
          nodeInfo.data = _.random(0, 20);
          break;
        case WRITE_DATE.KEY:
          nodeInfo.data = new Date();
          break;
        default:
          break;
      }
    });
  }

  /**
   *
   * @param {*} bufData
   */
  onData(bufData) {
    BU.CLI(bufData);
    // BU.CLI(xbeeApi0x10);
    const returnValue = '';
    return returnValue;
  }
}
module.exports = EchoServer;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const mapList = require('../../mapList');

  const echoServer = new EchoServer(
    {
      deviceId: '001',
      mainCategory: 'FarmParallel',
      subCategory: 'dmTech',
    },
    mapList.FP.yungSanPo,
  );

  echoServer.reload();
  // 수문
  let msg = echoServer.onData({
    destination64: '0013A20040F7ACC8',
    data: '@cgo',
  });

  // 밸브
  msg = echoServer.onData({
    destination64: '0013A20040F7B47F',
    data: '@cvo',
  });

  // 게이트형 밸브
  msg = echoServer.onData({
    destination64: '0013A20040F7AB81',
    data: '@cvo',
  });
  BU.CLI(msg.toString());

  // 펌프
  msg = echoServer.onData({
    destination64: '0013A20040F7B446',
    data: '@cpo',
  });

  // 육상 모듈
  msg = echoServer.onData({
    destination64: '0013A20040F7AB86',
    data: '@sts',
  });
  BU.CLI(msg.toString());
}

/**
 * @typedef {Object} detailNodeInfo
 * @property {string} classId
 * @property {string} className
 * @property {string} defId
 * @property {string} defName
 * @property {number} isSensor
 * @property {string} nodeId
 * @property {*} data
 */

/**
 * @typedef {Object} detailDataloggerIInfo
 * @property {string} className
 * @property {string} prefix
 * @property {string} dataLoggerId
 * @property {string} serialNumber
 * @property {string[]} nodeList
 */
