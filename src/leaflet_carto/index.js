//Cartodb.js ser ikke ut til å funke med leaflet 1.0
//var L = require('leaflet');
require('leaflet/dist/leaflet.css');
require('L.TileLayer.Kartverket');


var cartodb = window.cartodb;
var L = window.L;


var viz = 'http://atlefren.carto.com/api/v2/viz/e77f3ee2-9b80-11e6-907a-0e3ebc282e83/viz.json';    

var map = L.map('map').setView([65.5, 17.0], 5);

L.tileLayer.kartverket('norges_grunnkart_graatone').addTo(map);


cartodb.createLayer(map, viz)
  .addTo(map)
  .on('done', function (layer) {
    layer
      .on('featureOver', function (e, latlng, pos, data) {
        console.log(e, latlng, pos, data);
      })
      .on('error', function (err) {
        console.log('error: ' + err);
      });
  }).on('error', function (err) {
    console.log('some error occurred: ' + err);
  });
