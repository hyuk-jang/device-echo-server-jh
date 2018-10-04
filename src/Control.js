const _ = require('lodash');
const {BU} = require('base-util-jh');
const net = require('net');
const mapListInfo = require('./mapList');

/** @type {Array.<{id: constructorSocket, instance: Control}>} */
const instanceList = [];
class Control {
  /**
   * @param {number} port
   */
  constructor(port) {
    this.port = port;

    this.returnData;
    this.mapListInfo = mapListInfo;

    // 싱글톤 패턴으로 생성
    const foundInstance = _.find(instanceList, instanceInfo =>
      _.isEqual(instanceInfo.id, this.port),
    );

    if (_.isEmpty(foundInstance)) {
      instanceList.push({id: this.port, instance: this});
      this.deviceModelList = [];
      this.setInit();
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
        protocolInfo.forEach(currentItem => {
          this.attachDevice(currentItem, deviceMap);
        });
        return;
      }
      // BU.CLI(protocol_info);
      // protocol_info.forEach(protocol_info => {
      const path = `./${protocolInfo.mainCategory}/${protocolInfo.subCategory}/EchoServer`;
      const DeviceProtocolConverter = require(path);
      // BU.CLIN(DeviceProtocolConverter, 4);
      const protocolConverter = new DeviceProtocolConverter(protocolInfo, deviceMap);

      const foundIt = _.find(this.deviceModelList, deviceModel =>
        _.isEqual(protocolConverter, deviceModel),
      );
      _.isEmpty(foundIt) && this.deviceModelList.push(protocolConverter);
      // });
    } catch (error) {
      throw error;
    }
  }

  setInit() {
    const server = net
      .createServer(socket => {
        // socket.end('goodbye\n');
        console.log(`client is Connected ${this.port}`);

        socket.on('data', data => {
          // parseData.data = Buffer.from(parseData.data);
          BU.CLI(`P: ${this.port}\tReceived Data: `, data.toString());

          // BU.CLI(data);
          // 응답 받을 데이터 배열
          const receiveDataList = [];
          this.deviceModelList.forEach(deviceModel => {
            // Observer 패턴으로 요청한 데이터 리스트를 모두 삽입
            receiveDataList.push(deviceModel.onData(data));
          });
          // BU.CLI(data);
          // BU.CLI(receiveDataList);
          // 응답받지 않은 데이터는 undefined가 들어가므로 이를 제거하고 유효한 데이터 1개를 가져옴
          this.returnData = _(receiveDataList)
            .reject(receiveData => _.isUndefined(receiveData))
            .head();

          // BU.CLI(data);
          // 약간의 지연 시간을 둠 (30ms)
          setTimeout(() => {
            // BU.CLI(this.returnData);
            const returnValue = Buffer.isBuffer(this.returnData)
              ? this.returnData
              : JSON.stringify(this.returnData);
            BU.CLI(returnValue.length, returnValue);
            if (returnValue === undefined) return;
            socket.write(returnValue);
          }, 100);
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
      console.log('clonse');
    });

    server.on('error', err => {
      console.error(err);
    });
  }
}
module.exports = Control;
