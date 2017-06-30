var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var baseConfig = require('./base.config.js');

var replaceThis = '<div id="root"></div>';
var withThis = '<div id="root"></div>' +
    //'<script src="bowser.bundle.js"></script>' +
    // '<script src="vendors.bundle.js"></script>' +
    '<script src="app.bundle.js"></script>';

var cnt = fs.readFileSync(path.join(__dirname, 'index-template.html'));
fs.writeFileSync('index.html', cnt.toString().replace(replaceThis, withThis).replace(/\<title.*title\>/, '<title>React 前端脚手架</title>'));

var host = 'http://localhost:3030'
var publicPath = '/'

module.exports = {
    ...baseConfig,
    devtool: 'inline-source-map',
    entry: {
        app: [
            './src/index',
            'webpack/hot/dev-server',
            'webpack-dev-server/client?' + host + publicPath
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: publicPath
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
        //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.bundle.js')
    ]
}
