const browserslistConfig = require('./browserslist.config');

module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: browserslistConfig,
            useBuiltIns: 'usage',
            modules: false
        }]
    ],
    ignore: [ 'node_modules' ]
};
