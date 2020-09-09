const _ = require('lodash');
const { BU } = require('base-util-jh');

module.exports = class {
  /**
   * @param {AbstModel} echoServer
   */
  constructor(echoServer) {
    const {
      isExistCrc = true,
      dataLoggerList,
      nodeList,
      protocolConverter,
      protocolInfo,
      peelFrameMsg,
      findDataLogger,
      wrapFrameMsg,
    } = echoServer;

    // 국번은 Buffer로 변환하여 저장함.
    const { deviceId } = protocolInfo;
    if (Buffer.isBuffer(deviceId)) {
      protocolInfo.deviceId = deviceId;
    } else if (_.isNumber(deviceId)) {
      protocolInfo.deviceId = protocolConverter.convertNumToWriteInt(deviceId);
    } else if (_.isString(deviceId)) {
      protocolInfo.deviceId = Buffer.from(deviceId, 'hex');
    }

    this.echoServer = echoServer;
    this.isExistCrc = isExistCrc;
    this.dataLoggerList = dataLoggerList;
    this.nodeList = nodeList;
    this.protocolConverter = protocolConverter;
    this.protocolInfo = protocolInfo;
    // Method
    this.peelFrameMsg = peelFrameMsg;
    this.findDataLogger = findDataLogger;
    this.wrapFrameMsg = wrapFrameMsg;
  }

  /**
   * 장치 상태 변경 데이터가 들어왔을 경우
   * @param {detailNodeInfo} nodeInfo
   * @param {*} newData
   */
  controlDevice(nodeInfo, newData) {
    nodeInfo.data = newData;
    this.emitReload();
  }

  /**
   * @interface
   * Zigbee Transmit Request 요청 시 상속받는 객체에서 구현
   * @param {dataLoggerInfo} dataLogger
   * @param {Buffer} atCommandFrame
   */
  processTransmitRequest(dataLoggerInfo, atCommandFrame) {}

  /**
   * Zigbee Receive Packet
   * @param {Buffer} deviceData
   */
  refineZigbeeReceivePacket(deviceData) {
    if (deviceData === undefined) {
      return undefined;
    }
    const bufBody = Buffer.concat([
      // Frame Type
      Buffer.from('90', 'hex'),
      // 64-bit Destination Address
      this.protocolInfo.deviceId,
      // 16-bit Destination Network Address(2byte),
      Buffer.from('FFFE', 'hex'),
      // Options
      Buffer.from('01', 'hex'),
      // RF Data
      deviceData,
    ]);

    const frameLength = Buffer.alloc(2, 0);
    frameLength.writeUInt16BE(bufBody.length);

    const bufHeader = Buffer.concat([
      // Start Delimiter
      Buffer.from('7E', 'hex'),
      // Length(2byte),
      frameLength,
    ]);

    const checkSum = this.protocolConverter.getDigiChecksum(bufBody);

    const command = Buffer.concat([bufHeader, bufBody, checkSum]);

    return command;
  }

  /**
   *
   * @param {Buffer} bufData
   */
  onData(bufData) {
    BU.CLIS(bufData); // Frame을 쓴다면 벗겨냄
    const xbeeFrame = this.peelFrameMsg(bufData);

    const RES_FRAME_TYPE_INDEX = 3;
    const RES_64BIT_ADDR = 4;
    // const RES_LAST_INDEX = xbeeFrame.length - 1;

    const resFrameType = xbeeFrame.readUInt8(RES_FRAME_TYPE_INDEX);
    const destination64 = xbeeFrame.slice(RES_64BIT_ADDR, RES_64BIT_ADDR + 8);

    const dataLoggerInfo = this.findDataLogger(destination64);

    if (_.isEmpty(dataLoggerInfo)) {
      return;
    }

    /** @type {Buffer} */
    let deviceData;
    // 해당 프로토콜에서 생성된 명령인지 체크
    switch (resFrameType) {
      // Zigbee Transmit Request
      case 0x10:
        deviceData = this.echoServer.processTransmitRequest(dataLoggerInfo, xbeeFrame);
        // 0x90 Zigbee Receive Packet
        deviceData = this.refineZigbeeReceivePacket(deviceData);
        break;
      default:
        throw new Error(`Not Matching Type ${resFrameType}`);
    }

    // 데이터가 없으면 반환
    if (_.isEmpty(deviceData)) return undefined;

    // Wrapping 처리
    const returnBuffer = this.wrapFrameMsg(deviceData);

    return returnBuffer;
  }
};
