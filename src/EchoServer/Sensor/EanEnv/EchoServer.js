const _ = require('lodash');

const { BU } = require('base-util-jh');

const Model = require('../Model');

const { dpc } = require('../../../module');

const { MainConverter } = dpc;

class EchoServer {
  /**
   * protocol_info.option --> true: 3.3kW, any: 600W
   * @param {protocol_info} protocolInfo
   * @param {mDeviceMap} deviceMap
   */
  constructor(protocolInfo, deviceMap) {
    // super(protocolInfo, deviceMap);
    // this.init();

    this.rtd0 = 1;
    this.rtd1 = 10;
    this.rtd2 = 100;

    this.counting = 0;
  }

  /**
   *
   * @param {Buffer} bufData
   */
  onData(bufData) {
    const strData = bufData.toString();

    let returnBuffer;
    if (strData === '21 get rtd\r') {
      this.counting += 1;
      if (this.counting > 3) {
        this.rtd0 = 100;
        this.rtd1 = 200;
        this.rtd2 = 300;
      }
      // this.rtd0 += 0.1;
      // this.rtd1 += 1;
      // this.rtd2 += 10;
      returnBuffer = Buffer.from(
        `: 21 rtd0 ${this.rtd0} rtd1 ${this.rtd1} rtd2 ${this.rtd2} rtd3 1000.0 \r`,
      );
    }

    // Wrapping 처리
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
