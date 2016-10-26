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
        komm: prevAttributes.KOMMUNENUMMER
    };
};

var data = parser
    .parse(sosidata)
    .transform('EPSG:4326')
    .filter(filter);
    //.mapAttributes(mapAttributes)

console.log('done filter')

var topojson = data.dumps('topojson');

fs.writeFile('../data/kommuner.topojson', JSON.stringify(data), function (err) {
    if (err) {
        return console.log(err);
    }
});
