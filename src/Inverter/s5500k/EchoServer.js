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

    // kW 단위를 사용할 것인지 여부(default kW)
    this.isKwUnit = _.get(protocolInfo, 'option.isKwUnit', true) === true;

    // 기존에 객체에 생성되어 있는지 체크
    const foundInstance = _.find(instanceList, instanceInfo => _.eq(instanceInfo.id, protocolInfo));

    // 없다면 신규로 생성
    if (_.isEmpty(foundInstance)) {
      instanceList.push({ id: protocolInfo, instance: this });
    } else {
      return foundInstance.instance;
    }

    BU.CLI('s5500k Inverter EchoServer Created', this.dialing);
  }

  /**
   * 체크섬 구해서 반환
   * @param {Buffer} dataBodyBufList
   * @return
   */
  calcChecksum(dataBodyBufList) {
    return this.protocolConverter.getSumBuffer(dataBodyBufList);
  }

  /**
   * 체크섬 구해서 반환
   * @param {Buffer} dataBodyBufList
   * @return
   */
  calcXorChecksum(dataBodyBufList) {
    return this.protocolConverter.getXorBuffer(dataBodyBufList);
  }

  /**
   *
   * @param {number} data 변환하고자 하는 데이터
   * @param {number=} scale 배율
   * @param {number=} allocSize 반환하는 Buffer Size
   */
  convert16UIntLE(data, scale = 1, allocSize = 2) {
    // 버퍼 2 자리 생성
    const buf = Buffer.allocUnsafe(allocSize);

    // 배율이 존재할 경우 곱셈
    if (scale !== 1) {
      data = _.round(_.multiply(data, scale));
    }
    // BE 형식으로 반환
    buf.writeUInt16LE(data);

    return buf;
  }

  /**
   * 동양 E&P 데이터 반환
   */
  makeDefault() {
    const dataBody = [
      Buffer.from([0xb1, 0xb5]),
      this.dialing,
      this.convert16UIntLE(this.BASE.pvVol, 10),
      this.convert16UIntLE(this.BASE.pvAmp, 100),
      this.convert16UIntLE(this.BASE.pvKw, 1000),
      this.convert16UIntLE(this.BASE.pvVol, 10),
      this.convert16UIntLE(this.BASE.pvAmp, 100),
      this.convert16UIntLE(this.BASE.pvKw, 1000),
      this.convert16UIntLE(this.BASE.gridRsVol, 10),
      this.convert16UIntLE(this.BASE.gridRAmp, 100),
      this.convert16UIntLE(this.BASE.powerGridKw, 1000),
      this.convert16UIntLE(this.BASE.gridLf, 10),
      this.convert16UIntLE(this.BASE.powerCpKwh, 1, 3),
      this.convert16UIntLE(this.BASE.powerDailyKwh, 100),
      Buffer.from([0x60, 0x01, 0x00, 0x8e, 0x89, 0x00]),
      Buffer.from([0x40, 0x80, 0x10, 0x20, 0x08]),
    ];

    // BU.CLI(dataBody);

    const resBuf = Buffer.concat(dataBody);

    return this.wrapFrameMsg(Buffer.concat([resBuf, this.calcXorChecksum(resBuf)]));
  }

  /**
   *
   * @param {Buffer} bufData
   */
  onData(bufData) {
    // BU.CLI(this.dialing, bufData);
    // BU.CLI(this.BASE);
    bufData = this.peelFrameMSg(bufData);

    const REQ_HEADER = Buffer.from([0x0a, 0x96]);

    const SOP = bufData.slice(0, 2);

    // SOP 일치 여부 체크
    if (!_.isEqual(SOP, REQ_HEADER)) {
      BU.CLI(`Not Matching SOP expect: ${REQ_HEADER} res: ${SOP}`);
      return;
    }

    const dialing = bufData.slice(2, 3);
    // 국번 일치 여부 체크(다르다면 응답하지 않음)
    if (!_.isEqual(dialing, this.dialing)) {
      BU.CLIS(dialing, this.dialing);
      return;
    }

    // 체크섬 체크
    const bodyBuffer = bufData.slice(2, 5);
    const checkSum = bufData.slice(6);
    const calcCheckSum = this.calcChecksum(bodyBuffer);
    if (!_.isEqual(checkSum, calcCheckSum)) {
      BU.CLI(`Not Matching checkSum expect: ${calcCheckSum} res: ${checkSum}`);
      return;
    }

    // BU.CLI('bufData', bufData);

    // 명령 체크
    const cmd = bufData.slice(3, 4);

    if (_.isEqual(Buffer.from([0x54]), cmd)) {
      return this.makeDefault();
    }
  }
}
module.exports = EchoServer;

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');

  const echoServer = new EchoServer({
    deviceId: '\u0001',
    mainCategory: 'Inverter',
    subCategory: 's5500k',
  });

  echoServer.reload();
  const msg = echoServer.makeDefault();
  BU.CLI(msg.length, msg);
  // BU.CLI(msg.toString());
}
