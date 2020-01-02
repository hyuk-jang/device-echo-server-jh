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

    /** @type {net.Socket} */
    this.socketServer;

    // 싱글톤 패턴으로 생성
    const foundInstance = _.find(instanceList, instanceInfo =>
      _.isEqual(instanceInfo.id, this.port),
    );

    if (_.isEmpty(foundInstance)) {
      instanceList.push({ id: this.port, instance: this });
      this.echoServerList = [];
      this.createServer(parserInfo);
    } else {
      return foundInstance.instance;
    }
  }

  /**
   *
   * @param {Object=} parserInfo
   * @param {string} parserInfo.parser
   * @param {string|number} parserInfo.option
   */
  createServer(parserInfo = {}) {
    this.socketServer = net
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
                this.writeMsg(socket, this.spreadMsg(data));
              });
              break;
            case 'readLineParser':
              stream = socket.pipe(split(this.parserInfo.option));
              stream.on('data', data => {
                this.writeMsg(socket, this.spreadMsg(data));
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

            this.writeMsg(socket, this.spreadMsg(data));
          });
        }
      })
      .on('error', err => {
        // handle errors here
        BU.error('@@@@', err, this.socketServer.address());
        // throw err;
      });

    // grab an arbitrary unused port.
    this.socketServer.listen(this.port, () => {
      BU.log(`${this.getServerName()} opened this.socketServer on`, this.socketServer.address());
    });

    this.socketServer.on('close', () => {
      console.log('clonse');
    });

    this.socketServer.on('error', err => {
      console.error(err);
    });
  }

  /**
   * 장치를 세팅
   * @param {protocol_info[]|protocol_info} protocolInfo
   * @param {mDeviceMap=} deviceMap SITE 단위를 사용할 경우 해당 프로토콜에서 사용될 MapImg ID
   */
  attachEchoServer(protocolInfo, deviceMap) {
    try {
      if (_.isArray(protocolInfo)) {
        return protocolInfo.map(currentItem => {
          return this.attachEchoServer(currentItem, deviceMap);
        });
      }

      const path = `./${protocolInfo.mainCategory}/${protocolInfo.subCategory}/EchoServer`;
      const EchoServer = require(path);
      const echoServer = new EchoServer(protocolInfo, deviceMap);

      const foundIt = _.find(this.echoServerList, eServer => _.isEqual(echoServer, eServer));
      _.isEmpty(foundIt) && this.echoServerList.push(echoServer);
      return echoServer;
      // });
    } catch (error) {
      throw error;
    }
  }

  getServerName() {
    return `${this.siteId}${this.siteName.length ? `(${this.siteName}) ` : ''}`;
  }

  /**
   *
   * @param {Buffer} msg
   */
  spreadMsg(msg) {
    // BU.CLI(data);
    // 응답 받을 데이터 배열
    const receiveDataList = [];
    this.echoServerList.forEach(deviceModel => {
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

    return returnValue;
  }

  /**
   * @param {Socket} socket
   * @param {Buffer} data
   */
  writeMsg(socket, data) {
    setTimeout(() => {
      // BU.CLI(this.returnData);
      // BU.CLI(_.get(returnValue, 'length'), returnValue);
      if (_.isEmpty(data) || _.isBoolean(data)) return;

      // BU.CLI(data);
      socket.write(data);
    }, 1);
  }
}
module.exports = Control;
