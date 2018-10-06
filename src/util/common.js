module.exports = {
  /**
   * @param {mDeviceMap} deviceMap
   * @return {detailNodeInfo[]}
   */
  makeNodeList: deviceMap => {
    const returnList = [];
    deviceMap.setInfo.nodeStructureList.forEach(nodeClassInfo => {
      // 노드 개요 목록 순회
      nodeClassInfo.defList.forEach(nodeDefInfo => {
        // 노드 목록 순회
        nodeDefInfo.nodeList.forEach(nodeInfo => {
          // 노드 ID 정의
          let nodeId = nodeDefInfo.target_prefix;
          if (nodeInfo.target_code) {
            nodeId += `_${nodeInfo.target_code}`;
          }

          const detailNodeInfo = {
            classId: nodeClassInfo.target_id,
            className: nodeClassInfo.target_name,
            defId: nodeDefInfo.target_id,
            defName: nodeDefInfo.target_name,
            isSensor: nodeClassInfo.is_sensor,
            nodeId,
            data: null,
          };

          returnList.push(detailNodeInfo);
        });
      });
    });
    return returnList;
  },
  /**
   * @param {mDeviceMap} deviceMap
   * @return {detailDataloggerIInfo[]}
   */
  makeDataLoggerList: deviceMap => {
    const returnList = [];
    // 데이터 로거 대분류 구조 순회
    deviceMap.setInfo.dataLoggerStructureList.forEach(dataLoggerClassInfo => {
      // 데이터 로거 장치 목록 순회
      dataLoggerClassInfo.dataLoggerDeviceList.forEach(dataLoggerDeviceInfo => {
        let dataLoggerId = dataLoggerClassInfo.target_prefix;
        if (dataLoggerDeviceInfo.target_code.length) {
          dataLoggerId += `_${dataLoggerDeviceInfo.target_code}`;
        }

        const detailDataloggerIInfo = {
          className: dataLoggerClassInfo.target_name,
          prefix: dataLoggerClassInfo.target_prefix,
          dataLoggerId,
          serialNumber: dataLoggerDeviceInfo.serial_number,
          nodeList: dataLoggerDeviceInfo.nodeList,
        };
        returnList.push(detailDataloggerIInfo);
      });
    });
    return returnList;
  },
};

/**
 * @typedef {Object} detailNodeInfo
 * @property {string} classId
 * @property {string} className
 * @property {string} defId
 * @property {string} defName
 * @property {number} isSensor
 * @property {string} nodeId
 * @property {*} data
 */

/**
 * @typedef {Object} detailDataloggerIInfo
 * @property {string} className
 * @property {string} prefix
 * @property {string} dataLoggerId
 * @property {string} serialNumber
 * @property {string[]} nodeList
 */
