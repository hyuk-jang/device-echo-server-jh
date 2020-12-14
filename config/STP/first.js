require('../config.guide');

const protocolStp = {
  mainCategory: 'STP',
  subCategory: 'JungHan',
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
            projectId: 'STP',
            mapId: 'first',
            simulatorPort: process.env.SIMUL_PORT || 10001,
          },
        },
      ],
    },
  ],
};
