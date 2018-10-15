const _ = require('lodash');
const { BU } = require('base-util-jh');
const { BaseModel } = require('../../../device-protocol-converter-jh');

const { ESS, FarmParallel, Inverter, UPSAS } = BaseModel;

const commonUtils = require('../util/common');

/** @type {Array.<{id: mDeviceMap, instance: EchoServer}>} */
const instanceList = [];
class AbstModel {
  /**
   * @param {protocol_info} protocolInfo
   * @param {mDeviceMap} deviceMap
   */
  constructor(protocolInfo, deviceMap) {
    // 기존에 객체에 생성되어 있는지 체크
    const foundInstance = _.find(instanceList, instanceInfo =>
      _.isEqual(instanceInfo.id, deviceMap),
    );

    // 없다면 신규로 생성
    if (_.isEmpty(foundInstance)) {
      instanceList.push({ id: deviceMap, instance: this });
    } else {
      return foundInstance.instance;
    }

    // Strategy Pattern
    switch (protocolInfo.mainCategory) {
      case 'UPSAS':
        this.model = new UPSAS(protocolInfo);
        break;
      case 'FarmParallel':
        this.model = new FarmParallel(protocolInfo);
        break;
      default:
        break;
    }

    // DPC 모델
    this.device = this.model.device;
    this.protocolConverter = this.model.protocolConverter;

    // 프로토콜 정보 정의
    this.protocolInfo = protocolInfo;

    // 현재 쓰이는 맵 정보 정의(instance Id로 사용)
    this.deviceMap = deviceMap;
    // 실제 장치 데이터
    this.nodeList = commonUtils.makeNodeList(deviceMap);

    // 장치들의 데이터를 취합하는 데이터 로거
    this.dataLoggerList = commonUtils.makeDataLoggerList(deviceMap);

    // BU.CLIN(this);

    this.reload();
    setInterval(() => {
      this.reload();
    }, 10000);
  }

  /** 장치가 수치를 측정하는 센서이고  */
  reload() {
    this.nodeList.forEach(nodeInfo => {
      // 센서이고 현재 데이터가 숫자이면서 float형인 경우만 랜덤 수치를 적용
      if (nodeInfo.isSensor && _.isNumber(nodeInfo.data) && nodeInfo.data % 1 !== 0) {
        // 현재 값을 기준으로 95% ~ 105% 사이의 랜덤 값을 사용
        nodeInfo.data = _.multiply(nodeInfo.data, _.random(0.951, 1.051));
      }
    });
  }

  /**
   *
   * @param {string|number} dataloggerSerialNumber
   */
  findDataLogger(dataloggerSerialNumber) {
    return _.find(this.dataLoggerList, { serialNumber: dataloggerSerialNumber });
  }

  /**
   * passiveClient를 사용할 경우 전송 Frame을 씌워서 보내야하므로 DPC에 frame을 씌워줄 것을 요청
   * passiveClient를 사용하지 않을 경우 원본 데이터 반환
   * @param {Buffer} msg 인버터 프로토콜에 따른 실제 데이터
   */
  wrapFrameMsg(msg) {
    return BaseModel.defaultWrapper.wrapFrameMsg(this.protocolInfo, msg);
  }

  /**
   * passiveClient를 사용할 경우 전송 Frame을 씌워서 보내므로 해당 Frame을 해제하고 실제 데이터 추출하여 반환
   * passiveClient를 사용하지 않을 경우 원본 데이터 반환
   * @param {Buffer} msg 인버터 프로토콜에 따른 실제 데이터
   */
  peelFrameMSg(msg) {
    return BaseModel.defaultWrapper.peelFrameMsg(this.protocolInfo, msg);
  }
}
module.exports = AbstModel;
