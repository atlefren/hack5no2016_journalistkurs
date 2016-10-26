import * as _ from 'underscore';
import reqwest from 'reqwest';


var BASE_URL = 'https://api.flickr.com/services/rest/';

function createFeatureCollection(features) {
    return {
        type: 'FeatureCollection',
        features: features
    };
}

function createGeoJSONFeature(latLng, properties) {
    properties = properties || {};
    return {
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [latLng.lng, latLng.lat]
        },
        'properties': properties
    };
};

function createQueryParameterString(params) {
    return _.map(params, function (value, key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }).join('&');
};

function dictWithout(dict) {
    var keys = _.without(_.keys(dict), Array.prototype.slice.call(arguments, 1));
    return _.reduce(keys, function (acc, key) {
        acc[key] = dict[key];
        return acc;
    }, {});
};

function sendRequest(url, callback, errorCallback) {

    var headers = {
        'Accept': 'application/json; charset=utf-8'
    };

    reqwest({
        url: url,
        crossOrigin: true,
        type: 'json',
        method: 'GET',
        //contentType: 'application/json; charset=utf-8',
        headers: headers,
        error: function (err) {
            try {
                errorCallback(JSON.parse(err.response));
            } catch (e) {
                errorCallback(err);
            }
        },
        success: callback
    });
};

var imageTemplate = _.template('https://farm<%= farm %>.staticflickr.com/<%= server %>/<%= id %>_<%= secret %>_<%= size %>.jpg');

function getImageUrl(photo, size) {
    return imageTemplate(_.extend({size: size}, photo));
}

function _parser(response) {
    if (response.stat && response.stat === 'fail') {
        console.error('error!');
        return;
    }
    var features = _.chain(response.photos.photo)
        .filter(function (item) {
            var lat = parseFloat(item.latitude);
            var lng = parseFloat(item.longitude);
            return (lat !== 0 || lng !== 0);
        })
        .map(function (item) {
            var properties = dictWithout(item, 'latitude', 'longitude');

            //see https://www.flickr.com/services/api/misc.urls.html for sizes
            properties.thumbnail = getImageUrl(item, 's');
            properties.image = getImageUrl(item, 'z');
            return createGeoJSONFeature(
                {
                    lat: parseFloat(item.latitude),
                    lng: parseFloat(item.longitude)
                },
                properties
            );
        })
        .value();
    return createFeatureCollection(features);
}


function _queryForAllPages(params, callback, errorCallback) {

    var result = [];

    function _gotResponse(response) {
        var fc = _parser(response);
        if (fc && fc.features) {
            result = result.concat(fc.features);
        }

        if (response.photos && response.photos.page < response.photos.pages) {
            params.page = response.photos.page + 1;
            _sendRequest(params);
        } else {
            var fc = createFeatureCollection(result);
            callback(fc);
        }
    }

    function _sendRequest(params) {
        var url = BASE_URL + '?' + createQueryParameterString(params);
        sendRequest(url, _gotResponse, errorCallback);
    }
    _sendRequest(params);
}

export default function getData(bbox, callback, errorCallback) {

    var params = {
        bbox: bbox,
        method: 'flickr.photos.search',
        user_id: 'trondheim_byarkiv',
        accuracy: 16, //street level
        api_key: '65a0d78867596f8ccfeb9718f4d915d0',
        has_geo: true,
        per_page: 500,
        extras: 'geo,tags',
        format: 'json',
        nojsoncallback: 1
    };
    _queryForAllPages(params, callback, errorCallback);
}
