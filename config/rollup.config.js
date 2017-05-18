const rollupNodeResolve = require('rollup-plugin-node-resolve'),
    rollupCommonJs = require('rollup-plugin-commonjs');

module.exports = {
    input: {
        plugins: [
            rollupNodeResolve({
                jsnext: true,
                main: true
            }),
            rollupCommonJs()
        ]
    },

    output: {
        dest: 'bundle.js',
        format: 'iife'
    }
};
