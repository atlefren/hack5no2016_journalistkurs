var path = require('path');

module.exports = {
    entry: {
        wxs: './src/wxs.js',
        cesium: './src/cesium',
        leaflet_flickr: './src/leaflet-flickr',
        d3: './src/d3'
    },
    output: {
        path: path.join(__dirname, 'bundles'),
        publicPath: 'http://0.0.0.0:8080/',
        filename: '[name].bundle.js',
        publicPath: '/bundles/',
        sourcePrefix: ''
    },
     resolve: {
        extensions: ['', '.js'],
        modulesDirectories: ['web_modules', 'node_modules', 'bower_components'],
        alias: {
            leaflet_marker: __dirname + '/node_modules/leaflet/dist/images/marker-icon.png',
            leaflet_marker_2x: __dirname + '/node_modules/leaflet/dist/images/marker-icon-2x.png',
            leaflet_marker_shadow: __dirname + '/node_modules/leaflet/dist/images/marker-shadow.png'
        }
    },
    module: {
        loaders: [
            {test: /Cesium\.js$/, loader: 'script'},
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.(png|gif|jpg|jpeg)$/, loader: 'file-loader?name=images/[name].[ext]'}
        ]
    }
};
