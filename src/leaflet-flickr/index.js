import getData from './getData';

var L = require('leaflet');
require('leaflet/dist/leaflet.css');
require('leaflet_marker');
require('leaflet_marker_2x');
require('leaflet_marker_shadow');
require('./l.photo.js');
require('./l.photo.css');

require('L.TileLayer.Kartverket');

L.Icon.Default.imagePath = '/bundles/images/';

function splitBbox(bbox) {
    return bbox.split(',').map(parseFloat);
};

L.latLngBounds.fromBBoxArray = function (bbox) {
    return new L.LatLngBounds(
        new L.LatLng(bbox[1], bbox[0]),
        new L.LatLng(bbox[3], bbox[2])
    );
};

L.latLngBounds.fromBBoxString = function (bbox) {
    return L.latLngBounds.fromBBoxArray(splitBbox(bbox));
};

var bbox = '10.371974,63.421472,10.412850,63.431945';

var map = L.map('map').fitBounds(L.latLngBounds.fromBBoxString(bbox));//setView([65.5, 17.0], 4);

L.tileLayer.kartverket('norges_grunnkart').addTo(map);


var photoLayer = L.photo().on('click', function (evt) {
    evt.layer.bindPopup(L.Util.template('<img src="{image}"/></a><p>{title}</p>', evt.layer.feature.properties), {
        className: 'leaflet-popup-photo',
        minWidth: 400
    }).openPopup();
});

getData(bbox, function (data) {
    photoLayer.addLayers(data.features).addTo(map);
});
