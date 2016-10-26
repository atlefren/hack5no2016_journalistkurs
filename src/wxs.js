import Wxs3Map from 'Wxs3Map';
import extent from 'turf-extent';
import envelope from 'turf-envelope';
import square from 'turf-square';
import buffer from 'turf-buffer';
import simplify from 'turf-simplify';

var line = require('json!../data/innerdalen-20110521.geojson');

var bbox = square(extent(buffer(envelope(line), 10, 'kilometers'))).join(', ');

var threeDMap = Wxs3Map({
    div: 'threedmap',
    bbox: bbox,
    wireframe: false,
    zMult: 1.5,
    texture: {
        wmsUrl: 'http://openwms.statkart.no/skwms1/wms.topo2',
        wmsLayers: 'topo2_WMS'
    },
    terrain: {
        wcsUrl: 'http://wms.geonorge.no/skwms1/wcs.dtm',
        coverage: 'land_utm33_10m'
    }
});

threeDMap.addLine(simplify(line, 0.0001, true).geometry);

window.camera = threeDMap._camera;
window.scene = threeDMap._scene;
