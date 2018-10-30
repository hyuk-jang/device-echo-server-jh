const _ = require('lodash');

const { BU } = require('base-util-jh');

const Model = require('../Model');

/** @type {Array.<{id: Buffer, instance: EchoServer}>} */
const instanceList = [];
class EchoServer extends Model {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocolInfo
   */
  constructor(protocolInfo) {
    super(protocolInfo);

    this.isKwGnd = _.get(protocolInfo, 'option') === true;

    // 기존에 객체에 생성되어 있는지 체크
    const foundInstance = _.find(instanceList, instanceInfo => _.eq(instanceInfo.id, protocolInfo));

    // 없다면 신규로 생성
    if (_.isEmpty(foundInstance)) {
      instanceList.push({ id: protocolInfo, instance: this });
    } else {
      return foundInstance.instance;
    }

    this.SOP = Buffer.from('^');
    this.DELIMETER = Buffer.from(',');
    this.REQ_CODE = Buffer.from('P');
    this.RES_CODE = Buffer.from('D');

    this.RES_HEAD = [this.SOP, this.RES_CODE];

    this.HEADER_INFO = {
      BYTE: {
        SOP: 1,
        CODE: 1,
        ADDR: 1,
        LENGTH: 2,
        ID: 3,
        CHECKSUM: 2,
        CMD: 3,
      },
    };

    BU.CLI('Das_1.3 Inverter EchoServer Created', this.dialing);
  }

  /**
   * 체크섬 구해서 반환
   * @param {Array.<Buffer>} dataBodyBufList
   * @return
   */
  calcChecksum(dataBodyBufList) {
    const bodyBuf = Buffer.concat(dataBodyBufList);
    const strChecksum = this.protocolConverter
      .returnBufferExceptDelimiter(bodyBuf, this.DELIMETER.toString())
      .toString();

    let calcChecksum = 0;
    _.forEach(strChecksum, str => {
      let num = _.toNumber(str);
      // 문자라면 A~Z --> 10~35로 변환
      num = _.isNaN(num) ? _.head(Buffer.from(str)) - 55 : num;
      calcChecksum += num;
    });

    return this.protocolConverter.convertNumToBuf(calcChecksum, 2);
  }

  // 시스템 메시지 반환
  makeSystem() {
    const dataBody = [
      Buffer.from('017'),
      this.dialing,
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(this.BASE.sysIsSingle ? 1 : 3, 1),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.sysCapaKw * 10), 4),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.sysLineVoltage), 3),
      this.DELIMETER,
    ];

    const resBuf = Buffer.concat(_.concat(this.RES_HEAD, dataBody));
    return this.wrapFrameMsg(Buffer.concat([resBuf, this.calcChecksum(dataBody)]));
  }

  makePv() {
    const pvCurrentScale = this.isKwGnd ? 10 : 1000;
    const dataBody = [
      Buffer.from('120'),
      // Buffer.from('128'),
      this.dialing,
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.pvVol), 3),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.pvAmp * 10), 4),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.pvKw * pvCurrentScale), 4),
      this.DELIMETER,
      // this.protocolConverter.convertNumToBuf(_.round(this.BASE.powerCpKwh / _.random(0.1, 0.2)), 7),
      // this.DELIMETER
    ];

    const resBuf = Buffer.concat(_.concat(this.RES_HEAD, dataBody));
    return this.wrapFrameMsg(Buffer.concat([resBuf, this.calcChecksum(dataBody)]));
  }

  makeGridVol() {
    const dataBody = [
      Buffer.from('222'),
      this.dialing,
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.gridRsVol), 3),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.gridStVol), 3),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.gridTrVol), 3),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.gridLf * 10), 3),
      this.DELIMETER,
    ];

    const resBuf = Buffer.concat(_.concat(this.RES_HEAD, dataBody));
    return this.wrapFrameMsg(Buffer.concat([resBuf, this.calcChecksum(dataBody)]));
  }

  makeGridAmp() {
    const dataBody = [
      Buffer.from('321'),
      this.dialing,
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.gridRAmp * 10), 4),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.gridSAmp * 10), 4),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.gridTAmp * 10), 4),
      this.DELIMETER,
    ];

    const resBuf = Buffer.concat(_.concat(this.RES_HEAD, dataBody));
    return this.wrapFrameMsg(Buffer.concat([resBuf, this.calcChecksum(dataBody)]));
  }

  makePower() {
    const pvCurrentScale = this.isKwGnd ? 10 : 1000;
    const dataBody = [
      Buffer.from('419'),
      this.dialing,
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.powerGridKw * pvCurrentScale), 4),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(_.round(this.BASE.powerCpKwh), 7),
      this.DELIMETER,
    ];

    const resBuf = Buffer.concat(_.concat(this.RES_HEAD, dataBody));
    return this.wrapFrameMsg(Buffer.concat([resBuf, this.calcChecksum(dataBody)]));
  }

  makeOperation() {
    const dataBody = [
      Buffer.from('612'),
      this.dialing,
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(this.BASE.operIsError, 1),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(this.BASE.operIsRun ? 0 : 1, 1),
      this.DELIMETER,
      this.protocolConverter.convertNumToBuf(2, 1),
      // this.protocolConverter.convertNumToBuf(_.random(0, 9), 1),
      this.DELIMETER,
    ];

    const resBuf = Buffer.concat(_.concat(this.RES_HEAD, dataBody));
    return this.wrapFrameMsg(Buffer.concat([resBuf, this.calcChecksum(dataBody)]));
  }

  /**
   *
   * @param {Buffer} bufData
   */
  onData(bufData) {
    BU.CLI(this.dialing, bufData);
    this.reload();
    bufData = this.peelFrameMSg(bufData);
    const SOP = Buffer.from([_.head(bufData)]);

    // SOP 일치 여부 체크
    if (!_.isEqual(SOP, Buffer.from('^'))) {
      BU.CLI(`Not Matching SOP expect: ${this.SOP} res: ${SOP}`);
      return;
    }

    // check Length (SOP, CODE, ADDRESS 제외)
    const dialing = bufData.slice(
      _.sum([this.HEADER_INFO.BYTE.SOP, this.HEADER_INFO.BYTE.CODE]),
      _.subtract(bufData.length, this.HEADER_INFO.BYTE.CMD),
    );

    // 국번 일치 여부 체크(다르다면 응답하지 않음)
    if (!_.isEqual(dialing, this.dialing)) {
      return;
    }

    BU.CLI('bufData', bufData);

    const cmd = bufData.slice(
      _.sum([this.HEADER_INFO.BYTE.SOP, this.HEADER_INFO.BYTE.CODE, this.HEADER_INFO.BYTE.ID]),
    );

    // 모델 데이터 변화
    // BU.CLI(cmd.toString());
    switch (cmd.toString()) {
      case 'MOD':
        return this.makeSystem();
      case 'ST1':
        return this.makePv();
      case 'ST2':
        return this.makeGridVol();
      case 'ST3':
        return this.makeGridAmp();
      case 'ST4':
        return this.makePower();
      case 'ST6':
        return this.makeOperation();
      default:
        break;
    }
  }
}
module.exports = EchoServer;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const echoServer = new EchoServer({ deviceId: '001', subCategory: 'das_1.3', option: true });

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
