module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                browsers: 'last 2 versions',
                ie: 11
            },
            modules: false,
            useBuiltIns: 'usage'
        }]
    ],
    ignore: ['node_modules']
};
