const _ = require('lodash');

const { BU } = require('base-util-jh');

module.exports = {
  /**
   * @param {mDeviceMap} deviceMap
   * @return {mDeviceMap}
   */
  setRepeatNode(deviceMap = {}) {
    // BU.CLIN(deviceMap)
    const { setInfo = {}, relationInfo: { placeRelationList = [] } = {} } = deviceMap;

    const { dataLoggerStructureList = [], nodeStructureList = [], repeatNodeList = [] } = setInfo;

    // 노드 목록 repeatNodeList 반영
    nodeStructureList.forEach(nodeClassInfo => {
      nodeClassInfo.defList.forEach(nodeDefInfo => {
        const { repeatId = '' } = nodeDefInfo;
        // repeatId가 있을 경우
        if (repeatId.length) {
          const fountDefInfo = _.find(repeatNodeList, {
            repeatId,
            repeatCategory: 'node',
          });
          if (fountDefInfo !== undefined) {
            nodeDefInfo.nodeList = fountDefInfo.nodeList;
          }

          // delete nodeDefInfo.repeatId;
        }
      });
    });

    // BU.CLIN(dataLoggerStructureList, 1)
    
    // 데이터 로거 재구성
    dataLoggerStructureList.forEach(dataLoggerDefInfo => {
      dataLoggerDefInfo.dataLoggerDeviceList.forEach(dataLoggerInfo => {
        const { repeatId = '', target_code: uniqNumber = '' } = dataLoggerInfo;
        // repeatId가 있을 경우
        if (repeatId.length) {
          const prefixNodeList = _.find(repeatNodeList, {
            repeatId,
            repeatCategory: 'prefix',
          }).nodeList;

          dataLoggerInfo.nodeList = prefixNodeList.map(prefix => `${prefix}_${uniqNumber}`);

          // delete dataLoggerInfo.repeatId;
        }
      });
    });

    // 장소 재구성
    placeRelationList.forEach(placeClassInfo => {
      placeClassInfo.defList.forEach(placeDefInfo => {
        placeDefInfo.placeList.forEach(placeInfo => {
          const { repeatId = '', target_code: uniqNumber = '', nodeList = [] } = placeInfo;
          // repeatId가 있을 경우
          if (repeatId.length) {
            const prefixNodeList = _.find(repeatNodeList, {
              repeatId,
              repeatCategory: 'prefix',
            }).nodeList;

            // 반복해서 추가할 node 구성
            const addNodeList = prefixNodeList.map(prefix => `${prefix}_${uniqNumber}`);

            // 설정한 nodeList 에 동적으로 생성된 nodeList를 붙임
            placeInfo.nodeList = _.concat(nodeList, addNodeList);

            // delete placeInfo.repeatId;
          }
        });
      });
    });

    return deviceMap;
  },

  /**
   * @param {mDeviceMap} deviceMap
   * @return {detailNodeInfo[]}
   */
  makeNodeList: (deviceMap = {}) => {
    const returnList = [];

    const { setInfo = {}, relationInfo: { placeRelationList = [] } = {} } = deviceMap;

    const { dataLoggerStructureList = [], nodeStructureList = [], repeatNodeList = [] } = setInfo;

    nodeStructureList.forEach(nodeClassInfo => {
      // 단순 표기를 위한 node는 제외
      if (nodeClassInfo.is_sensor < 0) return false;
      // 노드 개요 목록 순회
      nodeClassInfo.defList.forEach(nodeDefInfo => {
        // repeatId가 있을 경우에는 무시
        if (nodeDefInfo.repeatId) return false;
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
            targetCode: nodeInfo.target_code,
            dlIdx: nodeInfo.data_logger_index || 0,
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
   * @return {detailDataloggerInfo[]}
   */
  makeDataLoggerList: (deviceMap = {}) => {
    const { setInfo = {}, relationInfo: { placeRelationList = [] } = {} } = deviceMap;

    const { dataLoggerStructureList = [], nodeStructureList = [], repeatNodeList = [] } = setInfo;

    /** @type {detailDataloggerInfo[]} */
    const returnList = [];
    // 데이터 로거 대분류 구조 순회
    dataLoggerStructureList.forEach(dataLoggerClassInfo => {
      // 데이터 로거 장치 목록 순회
      dataLoggerClassInfo.dataLoggerDeviceList.forEach(dataLoggerDeviceInfo => {
        // repeatId가 있을 경우에는 무시
        if (dataLoggerDeviceInfo.repeatId) return false;

        let dataLoggerId = dataLoggerClassInfo.target_prefix;
        if (dataLoggerDeviceInfo.target_code.length) {
          dataLoggerId += `_${dataLoggerDeviceInfo.target_code}`;
        }

        const detailDataloggerInfo = {
          className: dataLoggerClassInfo.target_name,
          prefix: dataLoggerClassInfo.target_prefix,
          dataLoggerId,
          serialNumber: dataLoggerDeviceInfo.serial_number,
          nodeList: dataLoggerDeviceInfo.nodeList,
        };
        returnList.push(detailDataloggerInfo);
      });
    });
    return returnList;
  },
};
