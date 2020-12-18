const map = require('./first.map');
const bgMap = require('./mapBase64');

map.drawInfo.frame.mapInfo.backgroundInfo.backgroundData = bgMap;

module.exports = map;
