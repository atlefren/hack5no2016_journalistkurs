var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var SOSI = require('sosijs');

var parser = new SOSI.Parser();
var filter = /\.sos$/i;
var directory = '../data/Grensedata_Norge_LokalUTM_Valgkretser_SOSI';

function fc(features) {
    return {
        'type': 'FeatureCollection',
        'features': features
    };
}

var data = _.chain(fs.readdirSync(directory))
    .filter(function (filename, i) {
        return filter.test(filename);
    })
    .map(function (filename) {
        return fs.readFileSync(path.join(directory, filename));
    })
    .map(function (sosidata, i) {
        //This breaks on some charset stuff..
        return parser.parse(sosidata).transform('EPSG:4326').dumps('geojson');
    })
    .reduce(function (acc, geojson) {
        return acc.concat(geojson.features);
    }, [])
    .value();

fs.writeFile('../data/valgkretser.geojson', JSON.stringify(fc(data)), function (err) {
    if (err) {
        return console.log(err);
    }
});

