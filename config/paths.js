module.exports = {
    src: {
        root: 'src',
        js: 'src/js',
        sass: 'src/scss',
        img: 'src/img',
        files: {
            html: 'src/*.html',
            sass: 'src/scss/*.{scss,sass}',
            js: 'src/js/*.js',
            img: 'src/img/*.{png,jpg,jpeg,svg}',
            jsEntry: 'src/js/main.js',
            root: 'src/{*,}.{html,txt,xml,htaccess}'
        }
    },
    dist: {
        root: 'dist',
        js: 'dist/js',
        css: 'dist/css',
        img: 'dist/img'
    }
};