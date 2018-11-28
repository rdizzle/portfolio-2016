'use strict';

const fs = require('fs');
const cp = require('child_process');
const gulp = require('gulp');
const del = require('del');
const open = require('open');
const stylish = require('jshint-stylish');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const merge = require('merge-stream');
const pngquant = require('imagemin-pngquant');
const guetzli = require('imagemin-guetzli');
const named = require('vinyl-named');
const connect = require('gulp-connect');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const using = require('gulp-using');
const paths = require('./config/paths');
const webpackConfig = require('./config/webpack');
const usingConfig = require('./config/using');
const autoprefixerConfig = require('./config/autoprefixer');
const connectConfig = require('./config/connect');
const jshintConfig = require('./config/jshint');
const imagesConfig = require('./config/images');
const dev = process.argv.includes('--dev');

gulp.task('clean', () => del(paths.dist.root));

gulp.task('server', done => {
    connect.server(connectConfig);
    done();
});

gulp.task('open:page', () => open('http://localhost:' + connectConfig.port));

gulp.task('sass', () => {
    return gulp.src(paths.src.files.sass)
        .pipe(plumber())
        .pipe(gulpIf(dev, sourcemaps.init()))
        .pipe(sass.sync())
        .pipe(gulpIf(!dev, autoprefixer(autoprefixerConfig)))
        .pipe(gulpIf(!dev, cleanCss()))
        .pipe(gulpIf(dev, sourcemaps.write('.')))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(connect.reload())
        .pipe(using(usingConfig))
});

gulp.task('js:lint', () => {
    return gulp.src(paths.src.files.js)
        .pipe(plumber())
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(stylish));
});

gulp.task('js:transpile', () => {
    return gulp.src(paths.src.files.jsEntry)
        .pipe(plumber())
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(connect.reload())
        .pipe(using(usingConfig));
});

gulp.task('img', () => {
    return gulp.src(paths.src.files.img)
        .pipe(changed(paths.dist.img))
        .pipe(plumber())
        .pipe(gulpIf(!dev, imagemin([
            imagemin.gifsicle({
                optimizationLevel: 3
            }),
            imagemin.svgo(),
            pngquant(),
            guetzli({
                quality: 84
            })
        ], {
            verbose: true
        })))
        .pipe(gulp.dest(paths.dist.img))
        .pipe(connect.reload())
        .pipe(using(usingConfig));
});

gulp.task('copy', () => {
    return gulp.src(paths.src.files.root, {
            base: paths.src.root
        })
        .pipe(changed(paths.dist.root))
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist.root))
        .pipe(connect.reload())
        .pipe(using(usingConfig));
});

gulp.task('watch:img', done => {
    gulp.watch(paths.src.files.img, gulp.parallel('img'));
    done();
});

gulp.task('watch:js', done => {
    gulp.watch(paths.src.files.js, gulp.parallel('js:lint', 'js:transpile'));
    done();
});

gulp.task('watch:css', done => {
    gulp.watch(paths.src.files.sass, gulp.parallel('sass'));
    done();
});

gulp.task('watch:root', done => {
    gulp.watch(paths.src.files.root, gulp.parallel('copy'));
    done();
});

gulp.task('watch', gulp.parallel('watch:img', 'watch:js', 'watch:css', 'watch:root'));
gulp.task('build', gulp.parallel('js:transpile', 'js:lint', 'sass', 'img', 'copy'));
gulp.task('default', gulp.series('clean', 'build', 'server', 'open:page', 'watch'));

gulp.task('webp', done => {
    convertWebp([ 'stephanmeier.orig.jpg', 'swissplant.orig.jpg', 'wimper.orig.jpg' ]);
    convertWebp([ 'shaka-emoji.png' ], false);

    done();
});

const convertWebp = (files = [], sizes = true) => {
    files.forEach(file => {
        let matched = file.split('.');
        matched.pop();

        let key = matched.length === 1 ? undefined : matched.pop();
        let name = matched.pop();
        let src = `src/img/${file}`;

        if (key in imagesConfig) {
            imagesConfig[key].sizes.forEach(size => {
                let dest = `dist/img/${name}-${size}.webp`;

                if (size.includes('w')) {
                    cp.execSync(`cwebp ${imagesConfig[key].lossless ? '-lossless' : ''} ${imagesConfig[key].quality} -preset ${imagesConfig[key].preset} -resize ${size} 0 -mt -quiet ${src} -o ${dest}`);
                }

                if (size.includes('h')) {
                    cp.execSync(`cwebp ${imagesConfig[key].lossless ? '-lossless' : ''} ${imagesConfig[key].quality} -preset ${imagesConfig[key].preset} -resize 0 ${size} -mt -quiet ${src} -o ${dest}`);
                }
            });
        } else {
            let dest = `dist/img/${name}.webp`;

            cp.execSync(`cwebp ${imagesConfig.lossless ? '-lossless' : ''} ${imagesConfig.quality} -preset ${imagesConfig.preset} -mt -quiet ${src} -o ${dest}`);
        }
    });
};
