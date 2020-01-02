/**
 * @typedef {Object} echoConfig
 * @property {string} siteId Site 고유 ID
 * @property {string=} siteName Site 이름 (나주, 강진, 보성 ...)
 * @property {number} serverPort Echo Server Listening Port
 * @property {echoServerConfig[]} echoServerList Site 이름 (나주, 강진, 보성 ...)
 */

/**
 * @typedef {Object} echoServerConfig
 * @property {protocol_info} protocolConfig
 * @property {mapConfig=} mapConfig
 */

/**
 * @typedef {Object} mapConfig
 * @property {string} projectId
 * @property {string} mapId
 */

module;
