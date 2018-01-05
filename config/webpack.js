const webpack = require('webpack'),
    merge = require('webpack-merge'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    babelConfig = require('./babel');

let config = {
    output: {
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: babelConfig
            }]
        }]
    },
};

if (!process.argv.includes('--dev')) {
    config = merge(config, {
        devtool: false,
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ]
    });
}

if (process.argv.includes('--stats')) {
    config = merge(config, {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                defaultSizes: 'gzip'
            })
        ]
    })
}

module.exports = config;
