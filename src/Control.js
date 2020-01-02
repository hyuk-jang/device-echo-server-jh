const _ = require('lodash');
const split = require('split');
const { BU } = require('base-util-jh');
const net = require('net');
const deviceMapInfo = require('./deviceMap');

/** @type {Array.<{id: number, instance: Control}>} */
const instanceList = [];
class Control {
  /**
   * @param {number} port
   * @param {Object=} parserInfo
   * @param {string} parserOption.parser
   * @param {string|number} parserOption.option
   * @param {echoConfig} echoConfig
   */
  constructor(port, parserInfo = {}, echoConfig = {}) {
    this.msgLength = 0;
    this.parserInfo = parserInfo;

    const { siteId = '', siteName = '', serverPort } = echoConfig;

    this.port = _.isNumber(serverPort) ? serverPort : port;

    this.siteId = siteId;
    this.siteName = siteName;

    this.returnData;
    this.deviceMapInfo = deviceMapInfo;

    // 싱글톤 패턴으로 생성
    const foundInstance = _.find(instanceList, instanceInfo =>
      _.isEqual(instanceInfo.id, this.port),
    );

    if (_.isEmpty(foundInstance)) {
      instanceList.push({ id: this.port, instance: this });
      this.deviceModelList = [];
      this.setInit(parserInfo);
    } else {
      return foundInstance.instance;
    }
  }

  /**
   * 장치를 세팅
   * @param {protocol_info[]|protocol_info} protocolInfo
   * @param {mDeviceMap=} deviceMap SITE 단위를 사용할 경우 해당 프로토콜에서 사용될 MapImg ID
   */
  attachDevice(protocolInfo, deviceMap) {
    try {
      if (_.isArray(protocolInfo)) {
        let echoModel;
        protocolInfo.forEach(currentItem => {
          echoModel = this.attachDevice(currentItem, deviceMap);
        });
        return echoModel;
      }
      // BU.CLI(protocol_info);
      // protocol_info.forEach(protocol_info => {
      const path = `./${protocolInfo.mainCategory}/${protocolInfo.subCategory}/EchoServer`;
      const DeviceProtocolConverter = require(path);
      const protocolConverter = new DeviceProtocolConverter(protocolInfo, deviceMap);

      const foundIt = _.find(this.deviceModelList, deviceModel =>
        _.isEqual(protocolConverter, deviceModel),
      );
      _.isEmpty(foundIt) && this.deviceModelList.push(protocolConverter);
      return protocolConverter;
      // });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object=} parserInfo
   * @param {string} parserInfo.parser
   * @param {string|number} parserInfo.option
   */
  setInit(parserInfo = {}) {
    const server = net
      .createServer(socket => {
        BU.log(`${this.getServerName()}client is Connected ${this.port}`);
        // socket.end('goodbye\n');
        if (!_.isEmpty(parserInfo)) {
          let stream = null;
          switch (this.parserInfo.parser) {
            case 'delimiterParser':
              stream = socket.pipe(split(this.parserInfo.option));
              stream.on('data', data => {
                data += this.parserInfo.option;
                // BU.CLI(data);
                this.spreadMsg(socket, data);
              });
              break;
            case 'readLineParser':
              stream = socket.pipe(split(this.parserInfo.option));
              stream.on('data', data => {
                this.spreadMsg(socket, data);
              });
              break;
            default:
              break;
          }
        } else {
          socket.on('data', data => {
            // BU.CLI(data);
            // parseData.data = Buffer.from(parseData.data);
            // BU.CLI(`${this.getServerName()}P: ${this.port}\t onData: `, data.toString());

            this.spreadMsg(socket, data);
          });
        }
      })
      .on('error', err => {
        // handle errors here
        BU.error('@@@@', err, server.address());
        // throw err;
      });

    // grab an arbitrary unused port.
    server.listen(this.port, () => {
      BU.log(`${this.getServerName()} opened server on`, server.address());
    });

    server.on('close', () => {
      console.log('clonse');
    });

    server.on('error', err => {
      console.error(err);
    });
  }

  getServerName() {
    return `${this.siteId}${this.siteName.length ? `(${this.siteName}) ` : ''}`;
  }

  /**
   *
   * @param {Socket} socket
   * @param {Buffer} msg
   */
  spreadMsg(socket, msg) {
    // BU.CLI(data);
    // 응답 받을 데이터 배열
    const receiveDataList = [];
    this.deviceModelList.forEach(deviceModel => {
      // Observer 패턴으로 요청한 데이터 리스트를 모두 삽입
      receiveDataList.push(deviceModel.onData(msg));
    });
    // BU.CLI(data);
    // BU.CLI(receiveDataList);
    // 응답받지 않은 데이터는 undefined가 들어가므로 이를 제거하고 유효한 데이터 1개를 가져옴
    const data = _(receiveDataList)
      .reject(receiveData => _.isUndefined(receiveData))
      .head();

    const returnValue = Buffer.isBuffer(data) ? data : JSON.stringify(data);

    setTimeout(() => {
      // BU.CLI(this.returnData);
      // BU.CLI(_.get(returnValue, 'length'), returnValue);
      if (_.isEmpty(returnValue) || _.isBoolean(returnValue)) return;

      // BU.CLI(returnValue);
      socket.write(returnValue);
    }, 1);
  }
}
module.exports = Control;
