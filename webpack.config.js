const webpack = require('webpack');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const prod = process.argv.includes('--prod');
const stats = process.argv.includes('--stats');
const babelConfig = require('./babel.config');

let config = {
    output: {
        filename: '[name].js'
    },
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [{
            test: /\.m?js$/,
            use: {
                loader: 'babel-loader',
                options: babelConfig
            },
            exclude: /node_modules/
        }]
    },
};

if (prod) {
    config = merge(config, {
        devtool: false,
        mode: 'production',
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    }
                })
            ]
        }
    });
}

if (stats) {
    config = merge(config, {
        plugins: [
            new BundleAnalyzerPlugin()
        ]
    })
}

module.exports = config;
