var fs = require('fs');
var SOSI = require('sosijs');
var _ = require('underscore');

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

fs.writeFile('../data/kommuner.geojson', JSON.stringify(geojson), function (err) {
    if (err) {
        return console.log(err);
    }
});

//then run topojson --id-property komm -p navn -o kommuner2.topojson kommuner.geojson
