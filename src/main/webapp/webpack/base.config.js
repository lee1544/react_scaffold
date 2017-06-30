var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var postcssModulesValue = require('postcss-modules-values');
var autoprefixer = require('autoprefixer');
var postcssMixins = require('postcss-mixins');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseDirName = path.join(__dirname, '../')

module.exports = {
    entry: {
        app: [
            './src/index'
        ]
    },
    output: {
        path: path.join(baseDirName, 'dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
           compress: {
               warnings: false
           },
           output: {
               comments: false
           }
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => (
                resource &&
                resource.indexOf('node_modules') >= 0 &&
                resource.match(/\.js$/)
            )
        }),
        new BundleAnalyzerPlugin()
    ],
    resolve: {
        alias: {
            styles: path.resolve(baseDirName, 'styles'),
            img: path.resolve(baseDirName, 'img')
        },
        modulesDirectories: [
            'node_modules', 'common', 'img'
        ]
    },
    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint',
                include: path.join(baseDirName, 'src')
            }
        ],
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                include: path.join(baseDirName, 'src'),
                query: {
                    plugins: [
                        ['import', [{ libraryName: 'antd', style: 'css' }]]],
                    cacheDirectory: true
                }
            },
            {
                test: /\.css$/,
                exclude: [
                    path.resolve(baseDirName, 'node_modules')
                ],
                loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss'
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: /node_modules/,
            },
            {
                test: /\.json$/,
                include: [
                    path.resolve(baseDirName, 'src')
                ],
                loaders: ['json']
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif|cur)$/,
                loaders: ['file']
            }, {
                test: /\.eot/,
                loader : 'file?prefix=font/'
            }, {
                test: /\.woff/,
                loader : 'file?prefix=font/&limit=10000&mimetype=application/font-woff'
            }, {
                test: /\.ttf/,
                loader : 'file?prefix=font/'
            }, {
                test: /\.svg/,
                loader : 'file?prefix=font/'
            }
        ]
    },
    postcss: function () {
        return [
            postcssModulesValue,
            postcssMixins,
            autoprefixer({ browsers: ["> 5%", "ie 9"] })
        ]
    }
};
