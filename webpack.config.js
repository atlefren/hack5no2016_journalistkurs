var path = require('path');

module.exports = {
    entry: {
        wxs: './src/wxs.js',
        cesium: './src/cesium',
        leaflet_flickr: './src/leaflet-flickr'
    },
    output: {
        path: path.join(__dirname, 'bundles'),
        filename: '[name].bundle.js',
        publicPath: '/bundles/',
        sourcePrefix: ''
    },
     resolve: {
        extensions: ['', '.js'],
        modulesDirectories: ['web_modules', 'node_modules', 'bower_components']
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
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                loader: 'file-loader'
            }
        ]
    }
};
