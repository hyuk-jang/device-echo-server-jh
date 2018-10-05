const _ = require('lodash');

const moment = require('moment');
const { BU } = require('base-util-jh');

const Model = require('../Model');

const { MainConverter, BaseModel } = require('../../../../device-protocol-converter-jh');

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
  }

  /**
   *
   * @param {dataLoggerInfo} dataLogger
   * @param {modbusReadFormat} modbusData
   */
  readInputRegister(dataLogger, modbusData) {
    // BU.CLIS(dataLogger, modbusData);
    const registerAddr = modbusData.address;
    const { dataLength } = modbusData;

    /** @type {detailNodeInfo[]} */
    const foundNodeList = dataLogger.nodeList.map(nodeId => _.find(this.nodeList, { nodeId }));
    // BU.CLI(foundNodeList);

    const ModelFP = BaseModel.FarmParallel;

    const protocolList = [
      {},
      {},
      {},
      {},
      {},
      {},
      {
        key: ModelFP.BASE_KEY.lux,
      },
      {
        key: ModelFP.BASE_KEY.solar,
      },
      {
        key: ModelFP.BASE_KEY.soilTemperature,
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.soilReh,
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.co2,
      },
      {
        key: ModelFP.BASE_KEY.soilWaterValue,
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.outsideAirTemperature,
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.outsideAirReh,
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.windDirection,
      },
      {
        key: ModelFP.BASE_KEY.windSpeed,
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.r1,
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.isRain,
      },
    ];

    const dataHeader = [
      moment().format('YYYY'),
      moment().format('MM'),
      moment().format('DD'),
      moment().format('HH'),
      moment().format('mm'),
      moment().format('ss'),
    ];

    const nodeDataList = [];
    let calcData;
    const dataLoggerData = protocolList.map((protocolInfo, index) => {
      const nodeInfo = _.find(foundNodeList, { defId: protocolInfo.key });
      if (_.isUndefined(nodeInfo)) {
        return parseInt(_.nth(dataHeader, index), 0);
      }
      calcData = nodeInfo.data;
      if (_.isNumber(protocolInfo.scale)) {
        calcData = _.round(_.divide(calcData, protocolInfo.scale));
      } else {
        calcData = _.round(calcData);
      }

      nodeDataList.push(_.pick(nodeInfo, ['defId', 'data']));
      // BU.CLI(_.pick(nodeInfo, ['defId', 'data']));
      return calcData;
    });
    BU.CLI(nodeDataList);

    return dataLoggerData.slice(registerAddr, _.sum([registerAddr, dataLength]));
  }

  /**
   *
   * @param {Buffer} bufData
   */
  onData(bufData) {
    BU.CLI(bufData);
    // frame을 쓰고 있다면 벗겨냄
    const convertedBufData = this.peelFrameMSg(bufData);
    // Buffer를 문자로 변경
    const strData = convertedBufData.toString();
    /** @type {modbusReadFormat} */
    let modbusData;
    // JSON 형식인지 체크
    if (BU.IsJsonString(strData)) {
      const jsonData = JSON.parse(strData);
      _.forEach(jsonData, (v, k) => {
        if (_.get(v, 'type') === 'Buffer') {
          jsonData[k] = Buffer.from(v);
        }
      });
      modbusData = jsonData;
    }
    // Frame을 쓴다면 벗겨냄
    let dataList;
    // BU.CLI(modbusData);

    const slaveAddr = modbusData.unitId;
    const { fnCode } = modbusData;

    // BU.CLI(this.dataLoggerList);
    // slaveAddr를 기준으로 dataLogger 찾음
    const foundDataLogger = this.findDataLogger(slaveAddr);

    switch (fnCode) {
      case 4:
        dataList = this.readInputRegister(foundDataLogger, modbusData);
        break;

      default:
        break;
    }

    // BU.CLI(dataList);
    // Wrapping 처리
    const returnBuffer = this.wrapFrameMsg(dataList);
    return returnBuffer;
  }
}
module.exports = EchoServer;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const mapList = require('../../mapList');

  const protocolInfo = {
    deviceId: '001',
    mainCategory: 'FarmParallel',
    subCategory: 'dmTech',
  };

  const echoServer = new EchoServer(protocolInfo, mapList.FP.YeongSanPo);

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
