var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: ['./src/blocks/index.js'],
    output: {
        path: path.join( __dirname, 'assets/js' ),
        filename: 'charitable-blocks.js'
    },
<<<<<<< HEAD
    externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
=======
>>>>>>> Added Charitable_Assets class as a cleaner way to organize script & style registration & enqueuement. Added selectWoo script in prep of having multi-select fields in blocks. Minified blocks script via Webpack.
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