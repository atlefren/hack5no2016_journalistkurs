
var L = require('leaflet');
require('leaflet/dist/leaflet.css');
require('L.TileLayer.Kartverket');

var map = L.map('map').setView([65.5, 17.0], 4);

L.tileLayer.kartverket('norges_grunnkart').addTo(map);

