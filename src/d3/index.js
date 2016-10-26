var kommuner = require('json!../../data/kommuner2.topojson');
var arbled = require('raw!../../data/arbled.csv');
var befolkning = require('raw!../../data/befolkning.csv');

import * as d3 from 'd3';
import 'd3-geo';
import * as topojson from 'topojson';
import * as _ from 'underscore';

function group(csv) {
    return _.reduce(csv.split('\r\n'), function (acc, line) {
        var data = line.split(',');
        var komm = parseInt(data[0], 10);
        if (komm < 1000) {
            komm = '0' + komm;
        }
        acc[komm + ''] = parseInt(data[1], 10);
        return acc;
    }, {});
}

var rateByKomm = group(arbled);
var befolkningByKomm = group(befolkning);

var percentRateByKomm = _.reduce(rateByKomm, function (acc, rate, komm) {
    acc[komm] = rate / befolkningByKomm[komm];
    return acc;
}, {});


var width = 900,
    height = 900;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'svg');

var color = d3.scaleThreshold()
    .domain([0.01, 0.02, 0.04, 0.06, 0.8])
    .range(['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f']);

var data = topojson.feature(kommuner, kommuner.objects.kommuner);


// create a unit projection
var projection = d3.geoTransverseMercator()
    .scale(1)
    .rotate([-15, 0])
    /*.parallels([50, 70])
    .center([10, 60])
    .rotate([-15, 0])*/
    .translate([0, 0]);

// create a path generator.
var path = d3.geoPath()
    .projection(projection);

// compute bounds of a point of interest, then derive scale and translate
var b = path.bounds(data),
    s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

// update the projection to use computed scale and translate....
projection
    .scale(s)
    .translate(t);

// draw the svg of both the geojson and bounding box
svg.selectAll('path').data(data.features).enter().append('path')
    .attr('d', path)
    .style('fill', function (d) {
        return color(percentRateByKomm[d.id]);
    })
    .style('stroke', 'black');;

