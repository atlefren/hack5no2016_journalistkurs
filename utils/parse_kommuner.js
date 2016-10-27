var fs = require('fs');
var SOSI = require('sosijs');
var _ = require('underscore');
var topojson = require('topojson');

var sosidata = fs.readFileSync('../data/ADM_enheter_Norge.sos');

var parser = new SOSI.Parser();

var filter = function (feature) {
    return feature.attributes.objekttypenavn === 'Kommune';
};

var mapAttributes = function (prevAttributes) {
    return {
        komm: prevAttributes.KOMMUNENUMMER,
        navn: prevAttributes.ADMENHETNAVN.navn
    };
};

var data = parser
    .parse(sosidata)
    .transform('EPSG:4326')
    .filter(filter)
    .mapAttributes(mapAttributes);

var geojson = data.dumps('geojson');

var topology = topojson.topology({
    kommuner: geojson,
    id: function id(feature) {
        return feature.id.properties.komm;
    },
    'property-transform': function propertyTransform(feature) {
      return {
        navn: feature.properties.navn
      };
    }
});

fs.writeFile('../data/kommuner.topojson', JSON.stringify(topology), function (err) {
    if (err) {
        return console.log(err);
    }
});
