module.exports = {
    src: {
        root: 'src',
        js: 'src/**/*.{m,}js',
        css: 'src/**/*.scss',
        img: 'src/img/**/*',
        copy: 'src/{*,}.*',
        entry: {
            js: 'src/js/{main,head}.{m,}js',
            css: 'src/css/main.scss'
        }
    },
    dist: {
        root: 'dist',
        js: 'dist/js',
        css: 'dist/css',
        img: 'dist/img'
    }
};
