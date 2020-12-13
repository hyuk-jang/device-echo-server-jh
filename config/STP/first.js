require('../config.guide');

const protocolStp = {
  mainCategory: 'STP',
  subCategory: 'first',
  cmdExecTimeoutMs: 1000 * 2,
};

/** @type {desConfig} */
module.exports = {
  echoConfigList: [
    {
      siteId: 'jechun',
      siteName: '집광형 태양열 통합관리시스템',
      serverPort: 15300,
      echoServerList: [
        {
          protocolConfig: [protocolStp],
          mapConfig: {
            projectId: 'ETC',
            mapId: 'solarIot',
            simulatorPort: process.env.SIMUL_PORT || 10001,
          },
        },
      ],
    },
  ],
};
