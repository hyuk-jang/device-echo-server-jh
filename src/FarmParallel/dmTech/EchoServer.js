const _ = require('lodash');

const moment = require('moment');
const {BU} = require('base-util-jh');

const Model = require('../Model');

const {MainConverter, BaseModel} = require('../../../../device-protocol-converter-jh');

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

    this.dataIndexList = [];
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
   * @param {dataLoggerInfo} dataLogger
   * @param {Buffer} bufData
   */
  readInputRegister(dataLogger, bufData) {
    const registerAddr = bufData.readInt16BE(2);
    const dataLength = bufData.readInt16BE(4);

    /** @type {detailNodeInfo[]} */
    const foundNodeList = dataLogger.nodeList.map(nodeId => _.find(this.nodeList, {nodeId}));
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
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.solar,
        scale: 0.1,
        fixed: 1,
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
        scale: 0.1,
        fixed: 1,
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
        key: ModelFP.BASE_KEY.windSpeed,
        scale: 0.1,
        fixed: 1,
      },
      {
        key: ModelFP.BASE_KEY.windDirection,
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

    const dataLoggerData = protocolList.map((protocolInfo, index) => {
      const nodeInfo = _.find(foundNodeList, {defId: protocolInfo.key});
      if (_.isUndefined(nodeInfo)) {
        return parseInt(_.nth(dataHeader, index), 0);
      }
      if (_.isNumber(protocolInfo.scale)) {
        nodeInfo.data = _.round(_.divide(nodeInfo.data, protocolInfo.scale));
      }
      // BU.CLI(_.pick(nodeInfo, ['defId', 'data']));
      return nodeInfo.data;
    });

    return dataLoggerData.slice(registerAddr, _.sum([registerAddr, dataLength]));
  }

  /**
   *
   * @param {Buffer} bufData
   */
  onData(bufData) {
    BU.CLI(bufData);
    // Frame을 쓴다면 벗겨냄
    bufData = this.peelFrameMSg(bufData);
    BU.CLI(bufData);

    let dataList;

    const slaveAddr = bufData.readIntBE(0, 1);
    const fnCode = bufData.readIntBE(1, 1);

    // BU.CLIS(slaveAddr, fnCode);
    // BU.CLI(this.dataLoggerList);
    // slaveAddr를 기준으로 dataLogger 찾음
    const foundDataLogger = this.findDataLogger(slaveAddr);

    switch (fnCode) {
      case 4:
        dataList = this.readInputRegister(foundDataLogger, bufData);
        break;

      default:
        break;
    }

    // BU.CLI(dataList.length);
    // Modbus Header 구성
    const mbapHeader = Buffer.concat([
      Buffer.from([slaveAddr, fnCode]),
      this.protocolConverter.convertNumToHxToBuf(dataList.length, 2),
    ]);
    // BU.CLI(mbapHeader);
    // 장치 데이터 Hi-Lo 형태로 변환
    const bufferDataList = dataList.map(data =>
      this.protocolConverter.convertNumToHxToBuf(data, 2),
    );

    // MBAP Header 붙임
    bufferDataList.unshift(mbapHeader);

    // Wrapping 처리
    const returnBuffer = this.wrapFrameMsg(Buffer.concat(bufferDataList));

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

  const echoServer = new EchoServer(protocolInfo, mapList.FP.yungSanPo);

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
