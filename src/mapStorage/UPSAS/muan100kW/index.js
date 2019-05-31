const map = require('./muan100kW');
const bgMap = require('./mapBase64');

map.drawInfo.frame.mapInfo.backgroundInfo.backgroundData = bgMap;

module.exports = map;
