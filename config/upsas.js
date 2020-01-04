require('./config.guide');

/** @type {protocol_info} */
const protocolHexInv = {
  mainCategory: 'Inverter',
  subCategory: 'hexTriple',
  deviceId: '',
  option: {
    amount: 33.3,
  },
};

/** @type {protocol_info} */
const protocolSensor = {
  mainCategory: 'UPSAS',
  subCategory: 'muan100kW',
  parserOption: {
    parser: 'delimiterParser',
    option: '}',
  },
};

/**
 *
 * @param {protocol_info} protocol
 * @param {*} deviceId 바꾸고자 하는 Device ID
 */
function convertProtocolConfig(protocol, deviceId) {
  const conProtocolInfo = Object.assign({}, protocol);
  conProtocolInfo.deviceId = deviceId;
  return conProtocolInfo;
}

/** @type {desConfig} */
module.exports = {
  dbcConnConfig: {},
  echoConfigList: [
    {
      siteId: 'bbbb',
      siteName: '무안 100kW 실증부지',
      serverPort: 9001,
      echoServerList: [
        {
          protocolConfig: protocolSensor,
          mapConfig: {
            projectId: 'UPSAS',
            mapId: 'muan100kW',
            simulatorPort: 10001,
          },
        },
        // {
        //   protocolConfig: convertProtocolConfig(protocolHexInv, Buffer.from('001')),
        // },
        // {
        //   protocolConfig: convertProtocolConfig(protocolHexInv, Buffer.from('002')),
        // },
        // {
        //   protocolConfig: convertProtocolConfig(protocolHexInv, Buffer.from('003')),
        // },
      ],
    },
  ],
};
