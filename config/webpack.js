const webpack = require('webpack');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const dev = process.argv.includes('--dev');
const stats = process.argv.includes('--stats');
const babelConfig = require('./babel');

let config = {
    output: {
        filename: '[name].js'
    },
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: babelConfig
        }]
    },
};

if (!dev) {
    config = merge(config, {
        devtool: false,
        mode: 'production'
    });
}

if (stats) {
    config = merge(config, {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
            })
        ]
    })
}

module.exports = config;
