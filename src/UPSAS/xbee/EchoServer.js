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
    BU.CLI(this.nodeList);
  }

  /**
   * 장치들의 초기값을 설정
   */
  init() {
    this.nodeList.forEach(nodeInfo => {
      switch (nodeInfo.defId) {
        case this.device.WATER_DOOR.KEY:
        case this.device.GATE_VALVE.KEY:
          nodeInfo.data = this.device.WATER_DOOR.STATUS.CLOSE;
          break;
        case this.device.VALVE.KEY:
          nodeInfo.data = this.device.VALVE.STATUS.CLOSE;
          break;
        case this.device.PUMP.KEY:
          nodeInfo.data = this.device.PUMP.STATUS.OFF;
          break;
        case this.device.BRINE_TEMPERATURE.KEY:
        case this.device.MODULE_FRONT_TEMPERATURE.KEY:
        case this.device.MODULE_REAR_TEMPERATURE.KEY:
          nodeInfo.data = _.random(15.1, 45.9);
          break;
        case this.device.WATER_LEVEL.KEY:
          nodeInfo.data = _.random(0.0, 12.9);
          break;
        case this.device.SALINITY.KEY:
          nodeInfo.data = _.random(0.0, 15.0);
          break;
        default:
          break;
      }
    });
  }

  /**
   * 수문 제어 요청이 들어왔을 경우
   * @param {string} cmd
   * @param {detailNodeInfo} nodeInfo
   */
  controlWaterDoor(cmd, nodeInfo) {
    const DEVICE = this.device.WATER_DOOR;
    const CLOSE = _.get(_.head(DEVICE.COMMAND.CLOSE), 'cmd');
    const OPEN = _.get(_.head(DEVICE.COMMAND.OPEN), 'cmd');

    // 요청 명령이 닫는 명령이라면
    if (cmd === CLOSE) {
      // 현재 상태가 열려있는 상태라면
      if (nodeInfo.data === DEVICE.STATUS.OPEN) {
        // 닫는 상태로 변경
        nodeInfo.data = DEVICE.STATUS.CLOSING;
        setTimeout(() => {
          nodeInfo.data = DEVICE.STATUS.CLOSE;
        }, 5000);
      }
    } else if (cmd === OPEN) {
      // 현재 상태가 닫혀있다면
      if (nodeInfo.data === DEVICE.STATUS.CLOSE) {
        // 여는 상태로 변경
        nodeInfo.data = DEVICE.STATUS.OPENING;
        setTimeout(() => {
          nodeInfo.data = DEVICE.STATUS.OPEN;
        }, 5000);
      }
    }
  }

  /**
   * 밸브 제어 요청이 들어왔을 경우
   * @param {string} cmd
   * @param {detailNodeInfo} nodeInfo
   */
  controlValve(cmd, nodeInfo) {
    const DEVICE = this.device.VALVE;
    const CLOSE = _.get(_.head(DEVICE.COMMAND.CLOSE), 'cmd');
    const OPEN = _.get(_.head(DEVICE.COMMAND.OPEN), 'cmd');

    // 요청 명령이 닫는 명령이라면
    if (cmd === CLOSE) {
      // 현재 상태가 열려있는 상태라면
      if (nodeInfo.data === DEVICE.STATUS.OPEN) {
        // 닫는 상태로 변경
        nodeInfo.data = DEVICE.STATUS.CLOSING;
        setTimeout(() => {
          nodeInfo.data = DEVICE.STATUS.CLOSE;
        }, 5000);
      }
    } else if (cmd === OPEN) {
      // 현재 상태가 닫혀있다면
      if (nodeInfo.data === DEVICE.STATUS.CLOSE) {
        // 여는 상태로 변경
        nodeInfo.data = DEVICE.STATUS.OPENING;
        setTimeout(() => {
          nodeInfo.data = DEVICE.STATUS.OPEN;
        }, 5000);
      }
    }
  }

  /**
   * 펌프 제어 요청이 들어왔을 경우
   * @param {string} cmd
   * @param {detailNodeInfo} nodeInfo
   */
  controlPump(cmd, nodeInfo) {
    const DEVICE = this.device.PUMP;
    const OFF = _.get(_.head(DEVICE.COMMAND.OFF), 'cmd');
    const ON = _.get(_.head(DEVICE.COMMAND.ON), 'cmd');

    // 요청 명령이 닫는 명령이라면
    if (cmd === OFF) {
      // 현재 상태가 열려있는 상태라면
      if (nodeInfo.data === DEVICE.STATUS.ON) {
        // 닫는 상태로 변경
        setTimeout(() => {
          nodeInfo.data = DEVICE.STATUS.OFF;
        }, 5000);
      }
    } else if (cmd === ON) {
      // 현재 상태가 닫혀있다면
      if (nodeInfo.data === DEVICE.STATUS.OFF) {
        // 여는 상태로 변경
        setTimeout(() => {
          nodeInfo.data = DEVICE.STATUS.ON;
        }, 5000);
      }
    }
  }

  /**
   * @param {detailNodeInfo} nodeInfo
   * @param {detailNodeInfo[]} nodeList
   */
  getWaterDoor(nodeInfo, nodeList) {
    const bufHeader = Buffer.from([0x23, 0x30, 0x30, 0x30, 0x31, 0x30, 0x30, 0x30, 0x31]);

    const DEVICE = this.device.WATER_DOOR;
    let deviceHex;
    switch (nodeInfo.data) {
      case DEVICE.STATUS.STOP:
        deviceHex = [0x30, 0x30];
        break;
      case DEVICE.STATUS.OPEN:
        deviceHex = [0x30, 0x32];
        break;
      case DEVICE.STATUS.CLOSING:
        deviceHex = [0x30, 0x33];
        break;
      case DEVICE.STATUS.CLOSE:
        deviceHex = [0x30, 0x34];
        break;
      case DEVICE.STATUS.OPENING:
        deviceHex = [0x30, 0x35];
        break;
      default:
        break;
    }

    // 염도 센서 값
    const waterLevelNode = _.find(nodeList, {defId: this.device.WATER_LEVEL.KEY});
    const salinityNode = _.find(nodeList, {defId: this.device.SALINITY.KEY});

    let waterLevelBuf;
    if (_.isEmpty(waterLevelNode)) {
      waterLevelBuf = this.protocolConverter.convertNumToBuf(0, 2);
    } else {
      waterLevelBuf = this.protocolConverter.convertNumToBuf(_.round(waterLevelNode.data * 10), 2);
    }

    let salinityBuf;
    if (_.isEmpty(salinityNode)) {
      salinityBuf = this.protocolConverter.convertNumToBuf(0, 4);
    } else {
      salinityBuf = this.protocolConverter.convertNumToBuf(_.round(salinityNode.data * 10), 4);
    }

    // Level: 2, Salinity: 4, Batter: 4
    return Buffer.concat([
      bufHeader,
      Buffer.from(deviceHex),
      waterLevelBuf,
      salinityBuf,
      Buffer.from([0x31, 0x30, 0x2e, 0x32]),
    ]);
  }

  /**
   *
   * @param {xbeeApi_0x10} xbeeApi0x10
   */
  onData(xbeeApi0x10) {
    this.reload();
    xbeeApi0x10 = this.peelFrameMSg(xbeeApi0x10);

    const foundDataLogger = this.findDataLogger(xbeeApi0x10.destination64);

    const foundNodeList = foundDataLogger.nodeList.map(nodeId => _.find(this.nodeList, {nodeId}));

    let findDevice;
    let returnValue;
    // 찾은 데이터로거 접두사로 판별
    switch (foundDataLogger.prefix) {
      case 'D_G':
        findDevice = _.find(foundNodeList, {classId: this.device.WATER_DOOR.KEY});
        this.controlWaterDoor(xbeeApi0x10.data, findDevice);
        returnValue = this.getWaterDoor(foundNodeList, findDevice);
        break;
      case 'D_V':
        findDevice = _.find(foundNodeList, {classId: this.device.VALVE.KEY});
        this.controlWaterDoor(xbeeApi0x10.data, findDevice);
        break;
      case 'D_GV':
        findDevice = _.find(foundNodeList, {classId: this.device.GATE_VALVE.KEY});
        this.controlWaterDoor(xbeeApi0x10.data, findDevice);
        break;
      case 'D_P':
        findDevice = _.find(foundNodeList, {classId: this.device.PUMP.KEY});
        this.controlWaterDoor(xbeeApi0x10.data, findDevice);
        break;
      default:
        break;
    }
  }
}
module.exports = EchoServer;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const echoServer = new EchoServer({deviceId: '001', subCategory: 'das_1.3', option: true});

  echoServer.reload();
  let msg = echoServer.makeSystem();
  BU.CLI(msg.toString());

  msg = echoServer.makePv();
  BU.CLI(msg.toString());

  msg = echoServer.makeGridVol();
  BU.CLI(msg.toString());

  msg = echoServer.makeGridAmp();
  BU.CLI(msg.toString());

  msg = echoServer.makePower();
  BU.CLI(msg.toString());

  msg = echoServer.makeOperation();
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
