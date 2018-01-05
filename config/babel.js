module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                browsers: ['last 2 versions', 'not ie < 11', 'not ie_mob < 11']
            },
            modules: false,
            useBuiltIns: 'usage',
            debug: true
        }]
    ],
    ignore: [
        'node_modules'
    ]
};
