const _ = require('lodash');

const { BU } = require('base-util-jh');

const Model = require('../Model');

const { MainConverter } = require('../../../../device-protocol-converter-jh');

const protocol = require('./protocol');

class EchoServer extends Model {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocolInfo
   * @param {mDeviceMap} deviceMap
   */
  constructor(protocolInfo, deviceMap) {
    super(protocolInfo, deviceMap);

    this.decodingTable = protocol(this.protocolInfo);

    this.init();

    // BU.CLIN(this.nodeList);
  }

  /**
   *
   * @param {dataLoggerInfo} dataLogger
   * @param {Buffer} bufData
   */
  readInputRegister(dataLogger, bufData) {
    // BU.CLI('readInputRegister');
    const slaveAddr = bufData.readIntBE(0, 1);
    const registerAddr = bufData.readInt16BE(2);
    const dataLength = bufData.readInt16BE(4);

    // BU.CLIS(registerAddr, dataLength);

    /** @type {detailNodeInfo[]} */
    const foundNodeList = dataLogger.nodeList.map(nodeId => _.find(this.nodeList, { nodeId }));
    // BU.CLI(foundNodeList);

    let decodingTable;
    // NOTE: 모듈 후면 온도, 경사 일사량이 붙어 있는 로거
    const pvRearTempTableList = [1, 4];
    // NOTE: 모듈 하부 일사량이 붙어 있는 로거
    const inclinedSolarTableList = [3, 6];
    // NOTE: 추가 일사량 4기 로거
    const fourSolarSiteList = [31, 32, 33, 34, 35, 36];
    // NOTE: 외기 환경 데이터 로거 번호
    const horizontalSiteList = [7, 9, 11, 13, 16];
    // 장치 addr
    const numDeviceId = slaveAddr;

    if (_.includes(pvRearTempTableList, numDeviceId)) {
      decodingTable = this.decodingTable.PRT_SITE;
    } else if (_.includes(inclinedSolarTableList, numDeviceId)) {
      decodingTable = this.decodingTable.INCLINED_SITE;
    } else if (_.includes(horizontalSiteList, numDeviceId)) {
      decodingTable = this.decodingTable.HORIZONTAL_SITE;
    } else if (_.includes(fourSolarSiteList, numDeviceId)) {
      decodingTable = this.decodingTable.FOUR_SOLAR_SITE;
    } else {
      decodingTable = this.decodingTable.PUS_SITE;
    }

    // BU.CLI(this.nodeList);

    // const dataHeader = [
    //   moment().format('YYYY'),
    //   moment().format('MM'),
    //   moment().format('DD'),
    //   moment().format('HH'),
    //   moment().format('mm'),
    //   moment().format('ss'),
    // ];

    // BU.CLI(protocolList);
    // const nodeDataList = [];
    // BU.CLIN(decodingTable);
    let calcData;
    const dataLoggerData = decodingTable.decodingDataList.map(decodingInfo => {
      const nodeInfo = _.find(foundNodeList, { defId: decodingInfo.key });
      if (_.isUndefined(nodeInfo)) {
        return 0;
      }
      calcData = nodeInfo.data;
      if (_.isNumber(decodingInfo.scale)) {
        calcData = _.round(_.divide(calcData, decodingInfo.scale));
      } else {
        calcData = _.round(calcData);
      }

      // nodeDataList.push(_.pick(nodeInfo, ['defId', 'data']));
      // BU.CLI(_.pick(nodeInfo, ['defId', 'data']));
      return calcData;
    });
    // BU.CLI(nodeDataList);
    // BU.CLI(dataLoggerData);
    return dataLoggerData.slice(registerAddr, _.sum([registerAddr, dataLength]));
  }

  /**
   *
   * @param {Buffer} bufData
   */
  onData(bufData) {
    // BU.CLIS(this.protocolInfo, bufData);
    // Frame을 쓴다면 벗겨냄
    const convertedBufData = this.peelFrameMSg(bufData);
    // BU.CLI(convertedBufData);

    let dataList;

    const slaveAddr = convertedBufData.readIntBE(0, 1);
    const fnCode = convertedBufData.readIntBE(1, 1);

    // BU.CLIS(slaveAddr, fnCode);
    // BU.CLI(this.dataLoggerList);
    // slaveAddr를 기준으로 dataLogger 찾음
    const foundDataLogger = this.findDataLogger(slaveAddr);
    // BU.CLI(foundDataLogger);

    if (_.isUndefined(foundDataLogger)) {
      // BU.CLI(this.deviceMap.setInfo.mainInfo);
      return;
    }

    switch (fnCode) {
      case 4:
        dataList = this.readInputRegister(foundDataLogger, convertedBufData);
        break;

      default:
        break;
    }

    // BU.CLI(dataList.length);
    // Modbus Header 구성
    const mbapHeader = Buffer.concat([
      Buffer.from([slaveAddr, fnCode]),
      this.protocolConverter.convertNumToHxToBuf(dataList.length * 2, 1),
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
