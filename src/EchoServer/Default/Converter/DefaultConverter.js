const _ = require('lodash');
const EventEmitter = require('events');

const { BU } = require('base-util-jh');

const AbstModel = require('../AbstModel');

module.exports = class extends EventEmitter {
  /**
   *
   * @param {AbstModel} model
   */
  init(model) {
    const {
      isExistCrc = true,
      dataLoggerList,
      deviceMap,
      nodeList,
      protocolConverter,
      protocolInfo,
      emitReload,
      peelFrameMsg,
      findDataLogger,
      reload,
      wrapFrameMsg,
    } = model;

    this.deviceMap = deviceMap;
    this.isExistCrc = isExistCrc;
    /** @type {detailDataloggerInfo[]} */
    this.dataLoggerList = dataLoggerList;
    /** @type {detailNodeInfo[]} */
    this.nodeList = nodeList;
    this.protocolConverter = protocolConverter;
    this.protocolInfo = protocolInfo;
    // Method
    this.emitReload = emitReload;
    this.peelFrameMsg = peelFrameMsg;
    this.findDataLogger = findDataLogger;
    this.reload = reload;
    this.wrapFrameMsg = wrapFrameMsg;

    model.on('reload', () => {
      this.emit('reload');
    });
  }

  /**
   * DBS에서 요청한 명령
   * @param {Buffer} bufData
   */
  onData(bufData) {
    BU.log(bufData);
  }
};
