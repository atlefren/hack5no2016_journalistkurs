window.CESIUM_BASE_URL = './public/Cesium';
require('cesium/Build/Cesium/Cesium.js');
require('cesium/Build/Cesium/Widgets/widgets.css');
var _ = require('underscore');

var Cesium = window.Cesium;

var bounds = '7.203598,61.264621,7.690430,61.524659'.split(',');
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Rectangle(
    Cesium.Math.toRadians(bounds[0]),
    Cesium.Math.toRadians(bounds[1]),
    Cesium.Math.toRadians(bounds[2]),
    Cesium.Math.toRadians(bounds[3])
);


var options = {
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    enableLighting: true,
    infoBox: false,
    animation: false,
    orderIndependentTranslucency: false,
    navigationHelpButton: false,
    homeButton: false,
    sceneModePicker: false,
    fullscreenButton: false
};

var viewer = new Cesium.Viewer('map', options);
var scene = viewer.scene;
var camera = scene.camera;

function getTerrainProvider(url) {
    url = url || '//assets.agi.com/stk-terrain/world';
    return new Cesium.CesiumTerrainProvider({
        url: url,
        requestVertexNormals: true,
        requestWaterMask: false
    });
}

function getWmts(url, layer, params) {

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
}

viewer.terrainProvider = getTerrainProvider();

scene.imageryLayers.removeAll();

var wmtsProvider = getWmts('http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts', 'topo2');

viewer.imageryLayers.addImageryProvider(wmtsProvider);

/*
var bounds = '7.203598,61.264621,7.690430,61.524659'.split(',');
var ellipsoid = Cesium.Ellipsoid.WGS84;
var extent = new Cesium.Rectangle(
    Cesium.Math.toRadians(bounds[0]),
    Cesium.Math.toRadians(bounds[1]),
    Cesium.Math.toRadians(bounds[2]),
    Cesium.Math.toRadians(bounds[3])
);
camera.viewRectangle(extent, ellipsoid);
*/