const _ = require('lodash');

const { BU } = require('base-util-jh');

const Model = require('../Model');

const { MainConverter } = require('../../../../device-protocol-converter-jh');

class EchoServer {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocolInfo
   * @param {mDeviceMap} deviceMap
   */
  constructor(protocolInfo, deviceMap) {
    // super(protocolInfo, deviceMap);
    // this.init();

    this.rtd0 = 1;
    this.rtd1 = 10;
    this.rtd2 = 100;

    this.counting = 0;
  }

  /**
   *
   * @param {Buffer} bufData
   */
  onData(bufData) {
    const strData = bufData.toString();

    let returnBuffer;
    if (strData === '21 get rtd\r') {
      this.counting += 1;
      if (this.counting > 3) {
        this.rtd0 = 100;
        this.rtd1 = 200;
        this.rtd2 = 300;
      }
      // this.rtd0 += 0.1;
      // this.rtd1 += 1;
      // this.rtd2 += 10;
      returnBuffer = Buffer.from(
        `: 21 rtd0 ${this.rtd0} rtd1 ${this.rtd1} rtd2 ${this.rtd2} rtd3 1000.0 \r`,
      );
    }

    // Wrapping 처리
    return returnBuffer;
  }
}
module.exports = EchoServer;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const deviceMap = require('../../deviceMap');

  const protocolInfo = {
    deviceId: '001',
    mainCategory: 'FarmParallel',
    subCategory: 'dmTech',
  };

  const echoServer = new EchoServer(protocolInfo, deviceMap.FP.YeongSanPo);

  const mainConverter = new MainConverter(protocolInfo);
  mainConverter.setProtocolConverter();
  BU.CLI(echoServer.device.DEFAULT.COMMAND.STATUS);
  let cmdList = mainConverter.generationCommand(echoServer.device.DEFAULT.COMMAND.STATUS);
  let result = echoServer.onData(_.head(cmdList).data);
  BU.CLI(result);
  cmdList = mainConverter.generationCommand(echoServer.device.LUX.COMMAND.STATUS);
  result = echoServer.onData(_.head(cmdList).data);
  BU.CLI(result);

  // echoServer.reload();
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

// const DEVICE = this.model.device;
// const pickIndex = [
//   DEVICE.LUX.KEY,
//   DEVICE.SOLAR.KEY,
//   DEVICE.SOIL_TEMPERATURE.KEY,
//   DEVICE.SOIL_REH.KEY,
//   DEVICE.CO2.KEY,
//   DEVICE.SOIL_WATER_VALUE.KEY,
//   DEVICE.OUTSIDE_AIR_TEMPERATURE.KEY,
//   DEVICE.OUTSIDE_AIR_REH.KEY,
//   DEVICE.WIND_SPEED.KEY,
//   DEVICE.WIND_DIRECTRION.KEY,
//   DEVICE.R1.KEY,
//   DEVICE.IS_RAIN.KEY,
// ];
