const webpack = require('webpack'),
    merge = require('webpack-merge'),
    babelConfig = require('./babel');

let config = {
    output: {
        filename: '[name].js'
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: babelConfig
        }]
    }
};

if (!process.argv.includes('--dev')) {
    config = merge(config, {
        devtool: false,
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                mangle: {
                    keep_fnames: true
                },
                output: {
                    comments: false
                }
            }),

            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            })
        ]
    });
}

module.exports = config;
