L.Photo = L.FeatureGroup.extend({
    options: {
        icon: {
            iconSize: [40, 40]
        }
    },

    initialize: function (photos, options) {
        L.setOptions(this, options);
        L.FeatureGroup.prototype.initialize.call(this, photos);
    },

    addLayers: function (features) {
        if (features) {
            for (var i = 0, len = features.length; i < len; i++) {
                this.addLayer(features[i]);
            }
        }
        return this;
    },

    addLayer: function (feature) {
        L.FeatureGroup.prototype.addLayer.call(this, this.createMarker(feature));
    },

    createMarker: function (feature) {
        var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            icon: L.divIcon(L.extend({
                html: '<div style="background-image: url(' + feature.properties.thumbnail + ');"></div>​',
                className: 'leaflet-marker-photo'
            }, feature, this.options.icon)),
            title: feature.properties.title || ''
        });
        marker.feature = feature;
        return marker;
    }
});

L.photo = function (photos, options) {
    return new L.Photo(photos, options);
};
