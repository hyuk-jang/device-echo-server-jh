const net = require('net');
const eventToPromise = require('event-to-promise');
const _ = require('lodash');
const { BU } = require('base-util-jh');
// require('../../../src/inverter/das_1.3/EchoServer');
require('../../../../default-intelligence');

const mapList = require('../../../src/mapList');

const { MainConverter, BaseModel } = require('../../../../device-protocol-converter-jh');

const EchoServerFP = require('../../../src/FarmParallel/dmTech/EchoServer');
const EchoServerInverter = require('../../../src/Inverter/das_1.3/EchoServer');

const AbstController = require('../../../src/Default/AbstController');

const protocolFP = {
  mainCategory: 'FarmParallel',
  subCategory: 'dmTech',
  wrapperCategory: 'default',
  deviceId: 1,
};

const protocolInverter = {
  mainCategory: 'Inverter',
  subCategory: 'das_1.3',
  wrapperCategory: 'default',
  deviceId: '001',
};

/** Socket Server로 접속할 Passive Socket Client */
class SocketClient extends AbstController {
  /**
   *
   * @param {{host: string, port: number, uuid: string}} socketConnectInfo
   */
  constructor(socketConnectInfo) {
    super();
    this.configInfo = socketConnectInfo;

    /**
     * Socket Client 연결 객체
     * @type {net.Socket}
     */
    this.client = {};

    /** 기본 Encoding, Decondig 처리를 할 라이브러리 */
    this.defaultWrapper = BaseModel.defaultWrapper;
    this.protocolConverter = BaseModel.defaultModule.protocolConverter;
    // socket Client의 인증 여부
    this.hasCertification = false;

    this.setInit();
  }

  /**
   * FP 에코서버 설정
   * @param {protocol_info} protocolInfo
   * @param {mDeviceMap} deviceMap
   */
  setEchoServerFP(protocolInfo, deviceMap) {
    this.echoServerFP = new EchoServerFP(protocolInfo, deviceMap);
    // this.echoServerFP = new EchoServerFP(protocolInfo, mapList.FP.YeongSanPo);
  }

  /**
   * FP 에코서버 설정
   * @param {protocol_info} protocolInfo
   */
  setEchoServerInverter(protocolInfo) {
    this.echoServerInverter = new EchoServerInverter(protocolInfo);
  }

  /** AbstController 에서 접속 타이머 시작 요청 */
  tryConnect() {
    this.setInit();
  }

  /**
   *
   * @param {Buffer} bufData
   */
  dataParser(bufData) {
    BU.CLI(bufData.toString());
    // const fnCode = bufData.readIntBE(1, 1);
    const CMD = String.fromCharCode(bufData.readIntBE(1, 1));
    BU.CLI(CMD);

    let returnValue;
    switch (CMD) {
      case 'A':
        returnValue = Buffer.from(this.configInfo.uuid, 'ascii');
        returnValue = this.defaultWrapper.wrapFrameMsg(protocolFP, returnValue);
        break;
      case 'I':
        returnValue = this.echoServerInverter.onData(bufData);
        break;
      case 'S':
        returnValue = this.echoServerFP.onData(bufData);
        break;
      default:
        break;
    }

    return returnValue;
  }

  /** 장치 접속 시도 */
  async connect() {
    // BU.CLI('Try SocketClient Connect : ', this.configInfo);
    /** 접속 중인 상태라면 접속 시도하지 않음 */
    if (!_.isEmpty(this.client)) {
      throw new Error(`Already connected. ${this.configInfo.port}`);
    }

    const client = net.createConnection(this.configInfo.port, this.configInfo.host);

    client.on('data', data => {
      const returnBuffer = this.dataParser(data);
      BU.CLI(returnBuffer);

      client.write(returnBuffer);
    });

    client.on('close', err => {
      this.hasCertification = false;
      this.client = {};
      this.notifyDisconnect(err);
    });

    // 에러가 나면 일단 close 이벤트 발생 시킴
    client.on('error', error => {
      this.notifyError(error);
    });
    await eventToPromise.multi(client, ['connect', 'connection', 'open'], ['close', 'error']);
    this.client = client;

    return this.client;
  }
}

/**
 * Passive Client를 수용할 Socket Server
 */
class SocketServer {
  /**
   * @param {protocol_info} protocolInfo
   * @param {number} port
   */
  constructor(protocolInfo, port) {
    this.protocolInfo = protocolInfo;
    this.port = port;

    /** 해당 Socket Serve를 감시하고 있는 객체 */
    this.observerList = [];

    this.defaultConverter = BaseModel.defaultModule;
    this.defaultWrapper = BaseModel.defaultWrapper;

    this.converterFP = new MainConverter(protocolFP);
    this.converterFP.setProtocolConverter();
    this.converterInverter = new MainConverter(protocolInverter);
    this.converterInverter.setProtocolConverter();

    /**
     * Socket Server에 접속하는 거점 Socket Client 목록
     * @type {Array.<net.Socket>}
     */
    this.clientList = [];

    // 현재 요청 중인 명령
    this.currentCMD = '';
    this.currentMsg;
    // 현재 Socket Server UUID를 '001' 이라고 임시 지정
    this.UUID = '001';

    this.inverterDcData;
    this.inverterIndexCMD = 0;
  }

  init() {
    const server = net
      .createServer(socket => {
        // socket.end('goodbye\n');
        console.log(`client is Connected ${this.port}\n addressInfo: ${socket.remoteAddress}`);

        // 인증 요청 코드 전송
        this.currentCMD = 'A';
        const authMsg = this.defaultConverter.encodingSimpleMsg(this.currentCMD);
        this.currentMsg = authMsg;
        socket.write(authMsg);

        // steram 연결 및 파서 등록
        // const stream = socket.pipe(split(this.defaultConverter.protocolConverter.ETX));
        // 데이터 수신
        socket.on('data', data => {
          try {
            // Parser 가 ETX 까지 삭제하므로 끝에 붙임
            // data += this.defaultConverter.protocolConverter.ETX;

            const decodingData = this.defaultWrapper.peelFrameMsg(this.protocolInfo, data);
            // BU.CLI(decodingData);

            if (this.currentCMD === 'A') {
              BU.CLI('인증 데이터 수신', data);
              if (!_.isEqual(decodingData.toString(), this.UUID)) {
                throw new Error('인증 실패');
              }

              BU.CLI('@@@@@@@@ 인증 성공 @@@@@@@@@@');
              // 인증 성공시 센서류 데이터 요청
              this.currentCMD = 'S';

              const requestSensorMsg = this.defaultWrapper.wrapFrameMsg(
                protocolFP,
                Buffer.from([0x01, 0x04, 0x00, 0x00, 0x00, 0x12]),
              );
              this.currentMsg = requestSensorMsg;
              BU.CLI('센서 데이터 요청 메시지 전송', requestSensorMsg);
              socket.write(requestSensorMsg);
            } else if (this.currentCMD === 'S') {
              // 센서류 데이터
              BU.CLI('센서 데이터 수신', data);
              const parsingData = this.converterFP.parsingUpdateData({
                data,
                commandSet: {
                  cmdList: [
                    {
                      data: this.currentMsg,
                    },
                  ],
                  currCmdIndex: 0,
                },
              });
              BU.CLI(parsingData);
              if (parsingData.eventCode !== 'DONE') {
                throw new Error('센서 데이터 파싱 실패');
              }
              const writeDate = _.head(parsingData.data.writeDate);
              // BU.CLI(writeDate);
              BU.CLI(BU.convertDateToText(writeDate));

              // 인버터 데이터 요청
              this.currentCMD = 'I';

              const baseModel = new BaseModel.Inverter(protocolInverter);

              const requestInverterMsg = this.converterInverter.generationCommand({
                key: baseModel.device.DEFAULT.KEY,
              });
              BU.CLI(requestInverterMsg);

              this.inverterDcData = requestInverterMsg;

              this.currentMsg = _.get(_.nth(this.inverterDcData, this.inverterIndexCMD), 'data');
              BU.CLI('인버터 데이터 요청 메시지 전송', this.currentMsg);
              socket.write(this.currentMsg);
            } else if (this.currentCMD === 'I') {
              // 센서류 데이터
              BU.CLI('인버터 데이터 수신', data);
              const parsingData = this.converterInverter.parsingUpdateData({
                data,
                commandSet: {
                  cmdList: this.inverterDcData,
                  currCmdIndex: this.inverterIndexCMD,
                },
              });

              this.inverterIndexCMD += 1;
              // BU.CLI(parsingData);
              if (parsingData.eventCode !== 'DONE') {
                throw new Error('센서 데이터 파싱 실패');
              }

              // BU.CLI(parsingData);

              if (this.inverterDcData.length !== this.inverterIndexCMD) {
                BU.CLIS(this.inverterDcData, this.inverterIndexCMD);
                this.currentMsg = _.get(_.nth(this.inverterDcData, this.inverterIndexCMD), 'data');
                BU.CLI('인버터 데이터 요청 메시지 전송', this.currentMsg);
                socket.write(this.currentMsg);
              } else {
                BU.CLI('인증, FP, Inverter 데이터 측정 테스트 완료. 수고했다.');
              }
            }
          } catch (error) {
            BU.logFile(error);
            throw error;
          }
        });

        socket.on('error', err => {
          // socket.emit('close')
          BU.logFile(err);
          socket.emit('close');
        });

        // client가 접속 해제 될 경우에는 clientList에서 제거
        // TODO: Socket 접속이 해제 되었을 경우 Node, Order 정보를 초기화 시키고 SocketIO로 전송 로직 필요
        socket.on('close', () => {
          // 저장소 목록을 돌면서 해당 client를 초기화
        });
      })
      .on('error', err => {
        // handle errors here
        console.error('@@@@', err, server.address());
        // throw err;
      });

    // grab an arbitrary unused port.
    server.listen(this.port, () => {
      console.log('opened server on', server.address());
    });

    server.on('close', () => {
      console.log('close');
    });

    server.on('error', err => {
      console.error(err);
    });
  }
}

async function startTestSocketClientCommunication() {
  const socketServer = new SocketServer(protocolFP, 9000);
  socketServer.init();

  const socketClient = new SocketClient({
    port: 9000,
    uuid: '001',
  });
  socketClient.setEchoServerFP(protocolFP, mapList.FP.YeongSanPo);
  socketClient.setEchoServerInverter(protocolInverter);
  socketClient.connect();
}


// SocketClient 구동 하고자 할 경우

// new SocketClient({
//   port: 9000,
//   uuid: '001',
// });

// if __main process
if (require !== undefined && require.main === module) {
  console.log('__main__');
  // const config = require('./src/config');
  // 데이터 통신 테스트
  startTestSocketClientCommunication();

  // controller.selectMap();

  // process.on('uncaughtException', err => {
  //   // BU.debugConsole();
  //   BU.CLI(err);
  //   console.log('Node NOT Exiting...');
  // });

  // process.on('unhandledRejection', err => {
  //   // BU.debugConsole();
  //   BU.CLI(err);
  //   console.log('Node NOT Exiting...');
  // });
}



process.on('uncaughtException', err => {
  // BU.debugConsole();
  console.error(err.stack);
  console.log(err.message);
  console.log('Node NOT Exiting...');
});

process.on('unhandledRejection', err => {
  // BU.debugConsole();
  console.error(err.stack);
  console.log(err.message);
  console.log('Node NOT Exiting...');
});

module.exports = SocketClient;
