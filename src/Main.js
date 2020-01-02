const _ = require('lodash');

const Control = require('./Control');

const deviceMap = require('./deviceMap');

module.exports = class {
  constructor() {
    /** @type {Control[]} */
    this.controlList = [];
  }

  /**
   * Echo Server 반환
   * @param {string} echoServerId
   */
  getEchoServer(echoServerId) {
    return _.find(this.controlList, { siteId: echoServerId });
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

        control.attachDevice(protocolConfig, dMap);
      });

      return control;
    });

    this.controlList = _.union(this.controlList.push(echoServerList));

    return this.controlList;
  }
};
