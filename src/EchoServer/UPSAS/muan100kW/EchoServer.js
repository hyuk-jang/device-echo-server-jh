/* eslint-disable no-nested-ternary */
const _ = require('lodash');

const { BU } = require('base-util-jh');

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

    this.normalDeviceOperTime = 30;
    this.pumpValveOperTime = 0;
  }

  /**
   * 장치들의 초기값을 설정
   */
  init() {
    this.nodeList.forEach(nodeInfo => {
      const numCode = _.toNumber(nodeInfo.targetCode);

      switch (nodeInfo.defId) {
        case this.device.WATER_DOOR.KEY:
          nodeInfo.data = this.device.WATER_DOOR.STATUS.CLOSE;
          break;
        case this.device.VALVE.KEY:
        case this.device.GATE_VALVE.KEY:
          nodeInfo.data = this.device.VALVE.STATUS.CLOSE;
          break;
        case this.device.PUMP.KEY:
          nodeInfo.data = this.device.PUMP.STATUS.OFF;
          break;
        case this.device.BRINE_TEMPERATURE.KEY:
          nodeInfo.data = _.random(35.1, 39.9);
          break;
        case this.device.MODULE_FRONT_TEMPERATURE.KEY:
        case this.device.MODULE_REAR_TEMPERATURE.KEY:
          nodeInfo.data = _.random(30.1, 35.9);
          break;
        case this.device.WATER_LEVEL.KEY:
          nodeInfo.data =
            numCode <= 2
              ? _.random(50, 120)
              : numCode <= 4
              ? _.random(9, 14, true)
              : numCode <= 8
              ? _.random(50, 120, true)
              : numCode <= 16
              ? _.random(4, 7, true)
              : _.random(50, 120);
          break;
        case this.device.SALINITY.KEY:
          nodeInfo.data =
            numCode < 1
              ? _.random(3, 5, true)
              : numCode < 7
              ? _.random(6, 9, true)
              : numCode < 10
              ? _.random(11, 17, true)
              : _.random(0, 10);
          break;
        case this.device.CONNECTOR_GROUND_RELAY.KEY:
          nodeInfo.data = _.random(0, 1);
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
    // BU.CLI('controlWaterDoor');
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
        }, this.normalDeviceOperTime);
      }
    } else if (cmd === OPEN) {
      // 현재 상태가 닫혀있다면
      if (nodeInfo.data === DEVICE.STATUS.CLOSE) {
        // 여는 상태로 변경
        // BU.CLI('여는 상태로 변경');
        // BU.CLI(nodeInfo.data);
        nodeInfo.data = DEVICE.STATUS.OPENING;
        setTimeout(() => {
          // BU.CLI('열림');
          nodeInfo.data = DEVICE.STATUS.OPEN;
        }, this.normalDeviceOperTime);
      }
    }
  }

  /**
   * 밸브 제어 요청이 들어왔을 경우
   * @param {string} cmd
   * @param {detailNodeInfo} nodeInfo
   */
  controlValve(cmd, nodeInfo) {
    // BU.CLI(cmd, nodeInfo)
    const DEVICE = this.device.VALVE;
    const CLOSE = _.get(_.head(DEVICE.COMMAND.CLOSE), 'cmd');
    const OPEN = _.get(_.head(DEVICE.COMMAND.OPEN), 'cmd');

    // 요청 명령이 닫는 명령이라면
    if (cmd === CLOSE) {
      // 현재 상태가 열려있는 상태라면
      if (nodeInfo.data === DEVICE.STATUS.OPEN) {
        setTimeout(() => {
          nodeInfo.data = DEVICE.STATUS.CLOSE;
        }, this.pumpValveOperTime);
      }
    } else if (cmd === OPEN) {
      // 현재 상태가 닫혀있다면
      if (nodeInfo.data === DEVICE.STATUS.CLOSE) {
        // BU.CLI(nodeInfo);
        setTimeout(() => {
          nodeInfo.data = DEVICE.STATUS.OPEN;
          // BU.CLI(nodeInfo);
        }, this.pumpValveOperTime);
      }
    }
  }

  /**
   * 게이트 밸브 제어 요청이 들어왔을 경우
   * @param {string} cmd
   * @param {detailDataloggerInfo} dlInfo
   */
  controlGateValve(cmd, dlInfo) {
    const {
      STATUS: { OPEN, CLOSE },
    } = this.device.VALVE;

    const realCmd = cmd.slice(0, 4);

    const nodeIndex = Number(cmd.slice(4, 6));

    const nodeInfo = this.nodeList.find(node => node.nodeId === dlInfo.nodeList[nodeIndex - 1]);

    // 요청 명령이 닫는 명령이라면
    if (realCmd === '@ctc') {
      nodeInfo.data = CLOSE;
    } else if (realCmd === '@cto') {
      nodeInfo.data = OPEN;
    }
  }

  /**
   * 펌프 제어 요청이 들어왔을 경우
   * @param {string} cmd
   * @param {detailDataloggerInfo} dlInfo
   */
  controlPump(cmd, dlInfo) {
    const {
      STATUS: { OFF, ON },
    } = this.device.PUMP;

    // BU.CLIN(dlInfo);
    const realCmd = cmd.slice(0, 4);

    const nodeIndex = Number(cmd.slice(4, 6));
    // BU.CLI(nodeIndex);

    const nodeInfo = this.nodeList.find(node => node.nodeId === dlInfo.nodeList[nodeIndex - 1]);
    // BU.CLI(nodeInfo);

    // 요청 명령이 닫는 명령이라면
    if (realCmd === '@ctc') {
      nodeInfo.data = OFF;
    } else if (realCmd === '@cto') {
      nodeInfo.data = ON;
    }
  }

  /**
   * @param {detailNodeInfo} nodeInfo
   * @param {detailNodeInfo[]} nodeList
   */
  getWaterDoor(nodeInfo, nodeList) {
    // BU.CLIS(nodeInfo);
    const bufHeader = Buffer.from([0x23, 0x30, 0x30, 0x30, 0x31, 0x30, 0x30, 0x30, 0x31]);

    const DEVICE = this.device.WATER_DOOR;
    let deviceHex;
    switch (nodeInfo.data) {
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
    // BU.CLI(deviceHex);

    // Level: 2, Salinity: 4, Batter: 4
    return Buffer.concat([bufHeader, Buffer.from(deviceHex), this.bufDataBattery]);
  }

  /**
   * @param {detailNodeInfo} nodeInfo
   * @param {detailNodeInfo[]} nodeList
   */
  getValve(nodeInfo, nodeList) {
    // BU.CLI('getValve', nodeInfo)
    const bufHeader = Buffer.from([0x23, 0x30, 0x30, 0x30, 0x31, 0x30, 0x30, 0x30, 0x32]);
    const DEVICE = this.device.VALVE;
    let deviceHex;
    switch (nodeInfo.data) {
      case DEVICE.STATUS.CLOSE:
        deviceHex = [0x30, 0x30];
        break;
      case DEVICE.STATUS.OPEN:
        deviceHex = [0x30, 0x31];
        break;
      default:
        break;
    }

    const nodeWL = _.find(nodeList, { defId: this.device.WATER_LEVEL.KEY });
    const nodeBT = _.find(nodeList, { defId: this.device.BRINE_TEMPERATURE.KEY });
    const nodeMRT = _.find(nodeList, { defId: this.device.MODULE_REAR_TEMPERATURE.KEY });

    let tempData;

    tempData = _.isEmpty(nodeWL) ? 0 : _.round(nodeWL.data * 10);
    const bufDataWL = this.protocolConverter.convertNumToBuf(tempData, 4);

    // 모듈 염수 온도
    tempData = _.isEmpty(nodeBT) ? 0 : _.round(nodeBT.data, 1);
    const bufDataBT = this.protocolConverter.convertNumToBuf(tempData, 6);

    // 모듈 후면 온도
    tempData = _.isEmpty(nodeMRT) ? 0 : _.round(nodeMRT.data, 1);
    const bufDataMRT = this.protocolConverter.convertNumToBuf(tempData, 6);

    return Buffer.concat([
      bufHeader,
      Buffer.from(deviceHex),
      bufDataWL,
      bufDataBT,
      bufDataMRT,
      this.bufDataBattery,
    ]);
  }

  /**
   * @param {detailDataloggerInfo} dlInfo
   */
  getGateValve(dlInfo) {
    // BU.CLI('getValve', nodeInfo)
    const bufHeader = Buffer.from([0x23, 0x30, 0x30, 0x30, 0x31, 0x30, 0x30, 0x30, 0x34]);
    const {
      STATUS: { OPEN, CLOSE },
    } = this.device.VALVE;

    // FIXME: index에 맞는 장치가 정확히 세팅되어 있다고 가정함
    const gateValveBufList = this.nodeList
      .filter(node => dlInfo.nodeList.includes(node.nodeId))
      .sort((prevNode, nextNode) => prevNode.dlIdx - nextNode.dlIdx)
      .reduce((results, node, index) => {
        let deviceStatus;
        switch (node.data) {
          case CLOSE:
            deviceStatus = '0';
            break;
          case OPEN:
            deviceStatus = '1';
            break;
          default:
            deviceStatus = '0';
            break;
        }

        results.write(deviceStatus, index);

        return results;
      }, Buffer.alloc(16, '0'));

    return Buffer.concat([bufHeader, gateValveBufList, this.bufDataBattery]);
  }

  /**
   * @param {detailDataloggerInfo} dlInfo
   */
  getPump(dlInfo) {
    // BU.CLI('getValve', nodeInfo)
    const bufHeader = Buffer.from([0x23, 0x30, 0x30, 0x30, 0x31, 0x30, 0x30, 0x30, 0x35]);
    const {
      STATUS: { OFF, ON },
    } = this.device.PUMP;

    // FIXME: index에 맞는 장치가 정확히 세팅되어 있다고 가정함
    const pumpBufList = this.nodeList
      .filter(node => dlInfo.nodeList.includes(node.nodeId))
      .sort((prevNode, nextNode) => prevNode.dlIdx - nextNode.dlIdx)
      .reduce((results, node, index) => {
        let deviceStatus;
        switch (node.data) {
          case OFF:
            deviceStatus = '0';
            break;
          case ON:
            deviceStatus = '1';
            break;
          default:
            deviceStatus = '0';
            break;
        }

        results.write(deviceStatus, index);

        return results;
      }, Buffer.alloc(16, '0'));

    return Buffer.concat([bufHeader, pumpBufList, this.bufDataBattery]);
  }

  /**
   * @param {detailNodeInfo[]} nodeList
   */
  getSensor(nodeList) {
    const bufHeader = Buffer.from([0x23, 0x30, 0x30, 0x30, 0x31, 0x30, 0x30, 0x31, 0x31]);

    // 염도 센서 값
    const nodeWL = _.find(nodeList, { defId: this.device.WATER_LEVEL.KEY });
    const nodeS = _.find(nodeList, { defId: this.device.SALINITY.KEY });
    const nodeBT = _.find(nodeList, { defId: this.device.BRINE_TEMPERATURE.KEY });
    const nodeMRT = _.find(nodeList, { defId: this.device.MODULE_REAR_TEMPERATURE.KEY });

    let tempData;
    tempData = _.isEmpty(nodeWL) ? 0 : _.round(nodeWL.data, 1);
    const bufDataWL = this.protocolConverter.convertNumToBuf(tempData, 4);

    tempData = _.isEmpty(nodeS) ? 0 : _.round(nodeS.data, 1);
    const bufDataS = this.protocolConverter.convertNumToBuf(tempData, 4);

    // 모듈 염수 온도
    const bufDataBT = _.isEmpty(nodeBT)
      ? '+0.000'
      : _.chain(nodeBT.data)
          .round(1)
          .thru(num => {
            const mathSign = num >= 0 ? '+' : '-';
            return Buffer.from(mathSign + _.padStart(num, 5, '0'));
          })
          .value();

    // 모듈 후면 온도
    const bufDataMRT = _.isEmpty(nodeMRT)
      ? '+0.000'
      : _.chain(nodeMRT.data)
          .round(1)
          .thru(num => {
            const mathSign = num >= 0 ? '+' : '-';
            return Buffer.from(mathSign + _.padStart(num, 5, '0'));
          })
          .value();

    return Buffer.concat([
      bufHeader,
      this.bufDataBattery,
      bufDataS,
      bufDataWL,
      bufDataBT,
      bufDataMRT,
    ]);
  }

  /**
   *
   * @param {xbeeApi_0x10} xbeeApi0x10
   */
  onData(xbeeApi0x10) {
    // BU.CLI(xbeeApi0x10);
    const strData = xbeeApi0x10.toString();
    if (BU.IsJsonString(strData)) {
      const jsonData = JSON.parse(strData);
      _.forEach(jsonData, (v, k) => {
        if (_.get(v, 'type') === 'Buffer') {
          jsonData[k] = Buffer.from(v);
        }
      });
      xbeeApi0x10 = jsonData;
    }

    // this.reload();
    xbeeApi0x10 = this.peelFrameMsg(xbeeApi0x10);
    // BU.CLI(this.nodeList)

    const dataLoggerInfo = this.findDataLogger(xbeeApi0x10.destination64);

    if (_.isEmpty(dataLoggerInfo)) {
      return;
    }

    // BU.CLIN(dataLoggerInfo);

    // BU.CLI(foundDataLogger.nodeList)
    const dlNodeList = dataLoggerInfo.nodeList.map(nodeId => _.find(this.nodeList, { nodeId }));
    // BU.CLI(dlNodeList);

    let nodeInfo;
    let dataLoggerData;
    // 찾은 데이터로거 접두사로 판별
    switch (dataLoggerInfo.prefix) {
      case 'D_G':
        nodeInfo = _.find(dlNodeList, { defId: this.device.WATER_DOOR.KEY });
        // 무슨 명령인지 모르니 일단 제어 요청
        this.controlWaterDoor(xbeeApi0x10.data, nodeInfo);
        dataLoggerData = this.getWaterDoor(nodeInfo, dlNodeList);
        break;
      case 'D_GV':
        // 무슨 명령인지 모르니 일단 제어 요청
        this.controlGateValve(xbeeApi0x10.data, dataLoggerInfo);
        dataLoggerData = this.getGateValve(dataLoggerInfo);
        break;
      case 'D_P':
        nodeInfo = _.find(dlNodeList, { defId: this.device.PUMP.KEY });
        // 무슨 명령인지 모르니 일단 제어 요청
        this.controlPump(xbeeApi0x10.data, dataLoggerInfo);
        dataLoggerData = this.getPump(dataLoggerInfo);
        break;
      case 'D_S':
        dataLoggerData = this.getSensor(dlNodeList);
        break;
      default:
        break;
    }

    // BU.CLI('dataLoggerData', dataLoggerData);
    dataLoggerData = this.wrapFrameMsg(dataLoggerData);
    // BU.CLI('dataLoggerData', dataLoggerData)

    /** @type {xbeeApi_0x8B} */
    const returnValue = {
      remote64: xbeeApi0x10.destination64,
      type: 0x90,
      data: dataLoggerData,
    };

    // BU.CLI(returnValue);

    return returnValue;
  }
}
module.exports = EchoServer;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const deviceMap = require('../../../deviceMap');

  const echoServer = new EchoServer(
    {
      deviceId: '001',
      mainCategory: 'UPSAS',
      subCategory: 'muan100kW',
    },
    deviceMap.UPSAS.muan100kW,
  );

  echoServer.reload();
  // 수문
  const msg = echoServer.onData({
    destination64: '0013A20040E58A22',
    data: '@cto',
  });

  // 밸브
  echoServer.msg = echoServer.onData({
    destination64: '0013A2004190EC8A',
    data: '@cto04',
  });
  // BU.CLI(echoServer.msg);
  // 펌프
  echoServer.msg = echoServer.onData({
    destination64: '0013A2004190EC6B',
    data: '@cto07',
  });
  // BU.CLI(echoServer.msg);

  // 센서
  echoServer.msg = echoServer.onData({
    destination64: '0013A20040E589FC',
    data: '@sts',
  });
  BU.CLI(echoServer.msg.data.toString());

  // // 게이트형 밸브
  // msg = echoServer.onData({
  //   destination64: '0013A20040F7AB81',
  //   data: '@cto',
  // });
  // BU.CLI(msg.toString());

  // // 펌프
  // msg = echoServer.onData({
  //   destination64: '0013A20040F7B446',
  //   data: '@cto',
  // });

  // // 육상 모듈
  // msg = echoServer.onData({
  //   destination64: '0013A20040F7AB86',
  //   data: '@sts',
  // });
  // BU.CLI(msg.toString());
}
