'use strict'

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseConfig = require('./base.config.js');

const baseDirName = path.join(__dirname, '../')

export default {
    ...baseConfig,
    devtool: false,
    plugins: [
        ...baseConfig.plugins,
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new HtmlWebpackPlugin({
            title: 'React 前端脚手架',
            template: path.join(baseDirName, 'webpack/index-template.html'),
            inject: 'body',
            filename: '../index.html'
        })
    ]
}
