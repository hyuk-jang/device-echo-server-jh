const _ = require('lodash');
const express = require('express');
const path = require('path');

// http server를 socket.io server로 upgrade한다
const ejs = require('ejs');

const app = express();
const server = require('http').createServer(app);
// const io = require('socket.io')(server);
const SocketIO = require('socket.io');

const { BU } = require('base-util-jh');

const AbstModel = require('../Default/AbstModel');

app.use(express.static(path.join(__dirname, '/public')));

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

class SimulatorApp {
  /**
   *
   * @param {number} appPort 포트
   * @param {AbstModel} echoServer 에코서버
   */
  constructor(appPort, echoServer) {
    this.appPort = appPort;
    // BU.CLIN(echoServer);
    /** @type {mDeviceMap} */
    this.deviceMap = echoServer.deviceMap;

    // this.backgroudMap = backgroudMap;

    this.nodeList = echoServer.nodeList;

    this.ioSocketList = [];

    echoServer.on('reload', () => this.emitNodeList());
  }

  /**
   * Map 배경 이미지
   * @param {string} backgroudMap base64
   */
  setBackgroundMap(backgroudMap) {
    _.set(this, 'deviceMap.drawInfo.frame.mapInfo.backgroundInfo.backgroundData', backgroudMap);
  }

  init() {
    BU.CLI('Simulator Init');

    this.setSocketIO(server);

    app.get('/', (req, res) => {
      // BU.CLIN(this.deviceMap);
      res.render('./index', {
        map: this.deviceMap,
        backgroudMap: this.backgroudMap,
      });
    });

    server.listen(this.appPort, () => {
      console.log(`Socket IO server listening on port ${this.appPort}`);
    });
  }

  /**
   * Web Socket 설정
   * @param {Object} httpServer
   */
  setSocketIO(httpServer) {
    this.io = new SocketIO(server);

    this.io.on('connection', socket => {
      this.ioSocketList.push(socket);

      // NodeList 에서 선택한 key 만을 정제해서 전송
      socket.emit('updateNodeList', this.pickNodeList());

      // 사용자 브라우저에서 데이터 갱신 요청이 들어올 경우 처리
      socket.on('changeNodeData', (nodeId, nodeData) => {
        const foundNode = _.find(this.nodeList, { nodeId });
        if (foundNode) {
          foundNode.data = nodeData;
          this.emitNodeList();
        }
      });

      // io 접속 해제시 ioSocketList 목록에서 제거
      socket.on('disconnect', () => {
        _.remove(this.ioSocketList, ioSocket => _.isEqual(ioSocket, socket));
      });
    });
  }

  /**
   * 노드 정보에서 UI에 보여줄 내용만을 반환
   */
  pickNodeList() {
    const pickList = ['nodeId', 'defName', 'data'];

    return _(this.nodeList)
      .map(nodeInfo => {
        _.isNumber(nodeInfo.data) && _.set(nodeInfo, 'data', _.round(nodeInfo.data, 2));
        return _.pick(nodeInfo, pickList);
      })
      .sortBy('nodeId')
      .value();
  }

  /** 브라우저로 노트 목록 전송 */
  emitNodeList() {
    this.ioSocketList.forEach(socket => {
      socket.emit('updateNodeList', this.pickNodeList());
    });
  }

  /**
   * Site에서 보내온 NodeList 데이터와 현재 가지고 있는 데이터와 비교하여 변화가 있을 경우 해당 노드를 선별하여 부모 호출
   * @param {nodeInfo[]} updatedNodeList
   */
  compareNodeList(updatedNodeList) {
    try {
      /** @type {nodeInfo[]} */
      const renewalList = [];
      // 수신 받은 노드 리스트를 순회
      _.forEach(updatedNodeList, updatedNodeInfo => {
        const currNodeInfo = _.find(this.nodeList, {
          node_real_id: updatedNodeInfo.node_real_id,
        });

        // 데이터가 서로 다르다면 갱신된 데이터
        if (!_.isEqual(updatedNodeInfo.data, currNodeInfo.data)) {
          currNodeInfo.data = updatedNodeInfo.data;
          renewalList.push(currNodeInfo);
        }
      });

      // 업데이트 내역이 있다면 전송
      if (renewalList.length) {
        this.emitNodeList();
      }
      // BU.CLI(renewalList);
      return renewalList;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = SimulatorApp;
