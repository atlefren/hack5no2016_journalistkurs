var Cesium = window.Cesium;

module.exports = function getTerrainProvider(url) {
    url = url || '//assets.agi.com/stk-terrain/world';
    return new Cesium.CesiumTerrainProvider({
        url: url,
        requestVertexNormals: true,
        requestWaterMask: false
    });
};
