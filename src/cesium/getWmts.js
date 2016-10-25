var _ = require('underscore');
var Cesium = window.Cesium;

module.exports = function getWmts(url, layer, params) {

    return new Cesium.WebMapTileServiceImageryProvider({
        url: url,
        layer: layer,
        style: 'default',
        format: 'image/png',
        tileMatrixSetID: 'EPSG:3857',
        tileMatrixLabels: _.map(_.range(0, 20), function (level) {
            return 'EPSG:3857:' + level;
        }),
        maximumLevel: 20
    });
};