/** @type {protocol_info} */
const protocolCompressor = {
  mainCategory: 'NI',
  subCategory: 'cDaq',
};

const protocol9482 = {
  mainCategory: 'NI',
  subCategory: '9482',
};

/**
 *
 * @param {protocol_info} protocol
 * @param {*} deviceId 바꾸고자 하는 Device ID
 */
function convertProtocolConfig(protocol, deviceId) {
  const conProtocolInfo = { ...protocol };
  conProtocolInfo.deviceId = deviceId;
  return conProtocolInfo;
}

/** @type {desConfig} */
module.exports = {
  echoConfigList: [
    {
      siteId: 'sector_001',
      siteName: '컴프레셔',
      serverPort: 9999,
      echoServerList: [
        {
          protocolConfig: [protocolCompressor],
          mapConfig: {
            projectId: 'NI',
            mapId: 'compressor',
            simulatorPort: 10001,
          },
        },
      ],
    },
  ],
};
