var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var SOSI = require('sosijs');
var iconv = require('iconv-lite');
var proj4 = require('proj4');

var parser = new SOSI.Parser();
var filter = /\.sos$/i;
var directory = '../data/Grensedata_Norge_LokalUTM_Valgkretser_SOSI';

var coordsys = {
    'EPSG:32632': '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
    'EPSG:32633': '+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs',
    'EPSG:32635': '+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs'
};

function transformPoint(point, from) {
    return proj4(from, 'EPSG:4326', point);
}

function fc(features) {
    return {
        'type': 'FeatureCollection',
        'features': features
    };
}

function transformGeoJSON(geoJson, from) {
    var features = _.map(geoJson.features, function (feature) {

        if (feature.geometry.type === 'Point') {
            feature.geometry.coordinates = transformPoint(feature.geometry.coordinates, from);
        }
        if (feature.geometry.type === 'LineString') {
            feature.geometry.coordinates = _.map(feature.geometry.coordinates, function (point) {
                return transformPoint(point, from);
            });
        }
        if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates = _.map(feature.geometry.coordinates, function (shell) {
                return _.map(shell, function (point) {
                    return transformPoint(point, from);
                });
            });
        }
        return feature;
    });

    return fc(features);
}

function getCharset(dataBuffer) {
    var ascii = dataBuffer.toString('ascii');
    var charsetLine = _.find(ascii.split('\n'), function (line) {
        return line.indexOf('..TEGNSETT') === 0;
    });
    var charset;
    if (charsetLine) {
        charset = charsetLine.replace('..TEGNSETT ', '').trim();
    } else {
        charset = 'DOSN8';
    }

    if (charset === 'DOSN8') {
        charset = 'cp865';
    }
    if (charset === 'ANSI') {
        charset = 'ISO8859-1';
    }
    return charset;
}

var data = _.chain(fs.readdirSync(directory))
    .filter(function (filename, i) {
        return filter.test(filename);
    })
    .map(function (filename) {
        var data = fs.readFileSync(path.join(directory, filename), {encoding: 'binary'});
        var charset = getCharset(data);
        return iconv.decode(data, charset);
    })
    .map(function (sosidata, i) {
        var parsed = parser.parse(sosidata);
        var geoJson = parsed.dumps('geojson');

        var features = _.filter(geoJson.features, function (feature) {
            return feature.geometry.type === 'Polygon';
        });

        return transformGeoJSON(fc(features), coordsys[parsed.hode.srid]);
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


//parser.parse(fs.readFileSync(path.join(directory, '0101VALGKRETSER.SOS'), 'utf8'));