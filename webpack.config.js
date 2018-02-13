var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: ['./src/blocks/index.js'],
    output: {
        path: path.join( __dirname, 'assets/js' ),
        filename: 'charitable-blocks.js'
    },
    stats: {
        colors: false,
        modules: true,
        reasons: true
    },
    storeStatsTo: 'webpackStats',
    progress: true,
    failOnError: true,
    watch: true,
    keepalive: true,
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ]
};