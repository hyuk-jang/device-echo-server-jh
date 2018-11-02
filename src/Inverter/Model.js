const _ = require('lodash');
const moment = require('moment');
const { BU } = require('base-util-jh');
const { BaseModel } = require('../../../device-protocol-converter-jh');

class Model extends BaseModel.Inverter {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocolInfo
   */
  constructor(protocolInfo) {
    super();

    // 국번 세팅
    const dialing = _.get(protocolInfo, 'deviceId');

    this.protocolInfo = protocolInfo;
    this.dialing = this.protocolConverter.makeMsg2Buffer(dialing);

    // 인버터 용량 불러옴. default: 30 kW
    this.amount = _.get(protocolInfo.option, 'amount', 30);
    // 단상, 삼상 여부
    this.isSingle = this.amount <= 3 ? 1 : 0;

    // 전압 200을 기본으로 두고. 용량 30kW * 5 = 150kW, 150 A * 200 V = 30000 W -> 30 kW
    this.basePvA = this.amount * 5;

    this.BASE = BaseModel.Inverter.BASE_MODEL;
    // TEST
    this.BASE.powerCpKwh = this.amount * _.random(10, 10.5, true); // 100 kWh 부터 시작
    this.index = 0;

    this.intervalMinute = 1;
    // 누적 발전량에 곱할 가중치
    this.cumulativeScale = this.intervalMinute / 60;

    this.reload();
    setInterval(() => {
      this.reload();
    }, 1000 * 60 * this.intervalMinute);
  }

  reload() {
    const hour = moment().hour();
    const minute = moment().minute();

    const hourSolarList = [
      0, // 0시
      0, // 1시
      0, // 2시
      0, // 3시
      0, // 4시
      0, // 5시
      0, // 6시
      41, // 7시
      82, // 8시
      524, // 9시
      762, // 10시
      866, // 11시
      899, // 12시
      841, // 13시
      689, // 14시
      444, // 15시
      162, // 16시
      39, // 17시
      1, // 18시
      0, // 19시
      0, // 20시
      0, // 21시
      0, // 22시
      0, // 23시
      0, // 24시
    ];

    const currSolar = _.nth(hourSolarList, hour);
    const nextSolar = _.nth(hourSolarList, hour + 1);
    const subtractSolar = _.subtract(nextSolar, currSolar);

    const minuteSolarList = [];

    // 분단위 일사량
    const unitSolar = subtractSolar / 60;
    for (let index = 0; index < 60; index += 1) {
      minuteSolarList.push(_.multiply(unitSolar, index));
    }
    // 시간, 분을 적용한 현재 일사량을 구함
    const currRealSolar = _.sum([currSolar, _.nth(minuteSolarList, minute)]);

    // 일사량 1000일 경우 100% 달성한다고 가정
    const BASE_SOLAR = 1000;
    //
    const currHourScale = _.divide(currRealSolar, BASE_SOLAR);

    this.BASE.pvAmp = _.multiply(this.basePvA, currHourScale);
    this.BASE.pvVol = _.random(180, 220, true);
    this.BASE.pvKw = _.multiply(_.multiply(this.BASE.pvAmp, this.BASE.pvVol), 0.001);
    this.BASE.gridLf = _.random(59.7, 60.5);
    this.BASE.gridRAmp = _.multiply(this.BASE.pvAmp, _.random(0.9, 1, true));
    this.BASE.gridRsVol = _.multiply(this.BASE.pvVol, _.random(0.9, 1, true));
    this.BASE.gridSAmp = _.multiply(this.BASE.pvAmp, _.random(0.9, 1, true));
    this.BASE.gridStVol = _.multiply(this.BASE.pvVol, _.random(0.9, 1, true));
    this.BASE.gridTAmp = _.multiply(this.BASE.pvAmp, _.random(0.9, 1, true));
    this.BASE.gridTrVol = _.multiply(this.BASE.pvVol, _.random(0.9, 1, true));
    this.BASE.operIsError = _.random(0, 1);
    this.BASE.operIsRun = _.random(0, 1);
    this.BASE.operTemperature = _.random(15.1, 36.2);
    this.BASE.operTroubleList = [];
    this.BASE.operWarningList = [];
    this.BASE.sysCapaKw = this.amount;
    this.BASE.sysIsSingle = this.isSingle;
    this.BASE.sysLineVoltage = this.isSingle ? 220 : 380;
    this.BASE.sysProductYear = moment().year();
    this.BASE.sysSn = _.random(1, 9);
    this.BASE.powerPvKw = this.BASE.pvKw;
    this.BASE.powerGridKw = _.divide(_.multiply(this.BASE.gridRAmp, this.BASE.gridRsVol), 1000);
    this.BASE.powerDailyKwh = _.sum([10, this.index]);
    this.BASE.powerCpKwh += _.multiply(this.cumulativeScale, this.BASE.powerGridKw);
    this.BASE.powerPf = _.multiply(_.divide(this.BASE.powerGridKw, this.BASE.powerPvKw), 100);

    this.index += 1;
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
module.exports = Model;
