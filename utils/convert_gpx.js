var tj = require('togeojson'),
    fs = require('fs'),
    DOMParser = require('xmldom').DOMParser,
    _ = require('underscore');

var gpx = new DOMParser().parseFromString(
    fs.readFileSync('../data/innerdalen-20110521.gpx', 'utf8')
);

var converted = tj.gpx(gpx);

var lineCoords = _.chain(converted.features)
    .filter(function (feature) {
        return feature.geometry.type === 'LineString';
    })
    .reduce(function (coords, feature) {
        return coords.concat(feature.geometry.coordinates);
    }, [])
    .value();

var geometry = {
    'type': 'LineString',
    'coordinates': lineCoords
};

var feature = {
    'type': 'Feature',
    'geometry': geometry
};
fs.writeFile('../data/innerdalen-20110521.geojson', JSON.stringify(feature), function (err) {
    if (err) {
        return console.log(err);
    }
});