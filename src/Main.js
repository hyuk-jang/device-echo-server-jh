const _ = require('lodash');
const net = require('net');

const { BU } = require('base-util-jh');

const {
  BaseModel: { defaultModule },
} = require('../../device-protocol-converter-jh');

const Control = require('./Control');

const deviceMap = require('./deviceMap');

module.exports = class {
  constructor() {
    /** @type {Control[]} */
    this.serverList = [];
  }

  /**
   * Echo Server 반환
   * @param {string} echoServerId
   */
  getEchoServer(echoServerId) {
    return _.find(this.serverList, { siteId: echoServerId });
  }

  /**
   * 에코서버 구동
   * @param {echoConfig[]} echoConfigList
   */
  createServer(echoConfigList) {
    const echoServerList = echoConfigList.map(echoOption => {
      const control = new Control(echoOption.serverPort, {}, echoOption);

      echoOption.echoServerList.forEach(echoServerConfing => {
        const { protocolConfig, mapConfig: { mapId, projectId } = {} } = echoServerConfing;

        let dMap;

        if (_.isString(mapId) && _.isString(projectId)) {
          dMap = _.get(deviceMap, `${projectId}.${mapId}`);
        }

        control.attachEchoServer(protocolConfig, dMap);
      });

      return control;
    });

    this.serverList = _.union(this.serverList.push(echoServerList));

    return this.serverList;
  }

  /**
   *
   * @param {{host: string=, port: number}} connectInfo
   * @param {*} echoConfigList
   */
  createDefaultPassiveServer(connectInfo, echoConfigList) {
    // 서버 구동
    this.createServer(echoConfigList);

    this.serverList.forEach(server => {
      const client = net.createConnection(connectInfo);

      _.set(server, 'client', client);

      const logPath = `./log/echo/${server.siteId}/${BU.convertDateToText(new Date(), '', 2)}.txt`;

      client.on('data', data => {
        BU.appendFile(logPath, `onData : ${data}`);

        const returnValue = this.dataParser(data, server);
        if (!_.isEmpty(returnValue)) {
          BU.appendFile(logPath, `writeData : ${returnValue}`);
          // 1 초후 반환
          setTimeout(() => {
            client.write(returnValue);
          }, 1000);
        }
      });

      client.on('connect', () => {
        this.client = client;
      });

      client.on('close', err => {
        this.hasCertification = false;
        this.client = {};
        this.notifyDisconnect(err);
      });

      client.on('end', () => {
        // console.log('Client disconnected');
      });

      client.on('error', error => {
        this.notifyError(error);
      });
    });
  }

  /**
   *
   * @param {Control} server
   * @param {Buffer} bufData
   */
  dataParser(server, bufData) {
    // BU.CLI(bufData.toString());
    // const fnCode = bufData.readIntBE(1, 1);
    const CMD = String.fromCharCode(bufData.readIntBE(1, 1));
    // BU.CLI(CMD);
    let returnValue;
    switch (CMD) {
      case 'A':
        returnValue = defaultModule.encodingSimpleMsg(
          Buffer.concat([Buffer.from(`${CMD}${server.siteId}`)]),
        );
        break;
      default:
        break;
    }

    if (returnValue === undefined) {
      return server.spreadMsg(bufData);
    }
    return returnValue;
  }
};
