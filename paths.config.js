module.exports = {
    src: {
        root: 'src',
        js: 'src/js/**/*.js',
        css: 'src/css/**/*.css',
        img: 'src/img/**/*',
        copy: 'src/{*,}.*',
        entry: {
            js: 'src/js/main.js',
            css: 'src/css/main.css'
        }
    },
    dist: {
        root: 'dist',
        js: 'dist/js',
        css: 'dist/css',
        img: 'dist/img'
    },
    webp: [
        'stephanmeier.jpg;600,800,1200',
        'swissplant.jpg;600,800,1200',
        'wimper.jpg;600,800,1200',
        'shaka-emoji.png'
    ]
};
