'use strict';

const fs = require('fs');
const cp = require('child_process');

const gulp = require('gulp');
const del = require('del');
const open = require('open');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const pngquant = require('imagemin-pngquant');
const guetzli = require('imagemin-guetzli');
const named = require('vinyl-named');
const connect = require('gulp-connect');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');

const pathsConfig = require('./paths.config');
const webpackConfig = require('./webpack.config');
const imagesConfig = require('./images.config');

const prod = process.argv.includes('--prod');

gulp.task('clean', () => del(pathsConfig.dist.root));

gulp.task('serve', done => {
    connect.server({
        port: 8080,
        livereload: true,
        root: pathsConfig.dist.root
    });
    done();
});

gulp.task('browser', () => open('http://localhost:8080'));

gulp.task('css', () => {
    return gulp.src(pathsConfig.src.css)
        .pipe(plumber())
        .pipe(gulpIf(!prod, sourcemaps.init()))
        .pipe(sass.sync())
        .pipe(gulpIf(prod, autoprefixer()))
        .pipe(gulpIf(prod, cleanCss()))
        .pipe(gulpIf(!prod, sourcemaps.write('.')))
        .pipe(gulp.dest(pathsConfig.dist.css))
        .pipe(connect.reload());
});

gulp.task('js:transpile', () => {
    return gulp.src(pathsConfig.src.entry.js)
        .pipe(plumber())
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(pathsConfig.dist.js))
        .pipe(connect.reload());
});

gulp.task('img', () => {
    return gulp.src(pathsConfig.src.img)
        .pipe(plumber())
        .pipe(gulpIf(prod, imagemin([
            imagemin.svgo(),
            pngquant(),
            guetzli({
                quality: 84
            })
        ])))
        .pipe(gulp.dest(pathsConfig.dist.img))
        .pipe(connect.reload());
});

gulp.task('copy', () => {
    return gulp.src(pathsConfig.src.copy, {
            base: pathsConfig.src.root
        })
        .pipe(plumber())
        .pipe(gulp.dest(pathsConfig.dist.root))
        .pipe(connect.reload());
});

gulp.task('watch:img', done => {
    gulp.watch(pathsConfig.src.img, gulp.parallel('img'));
    done();
});

gulp.task('watch:js', done => {
    gulp.watch(pathsConfig.src.js, gulp.parallel('js:transpile'));
    done();
});

gulp.task('watch:css', done => {
    gulp.watch(pathsConfig.src.css, gulp.parallel('css'));
    done();
});

gulp.task('watch:root', done => {
    gulp.watch(pathsConfig.src.copy, gulp.parallel('copy'));
    done();
});

gulp.task('webp', done => {
    convertWebp([ 'stephanmeier.orig.jpg', 'swissplant.orig.jpg', 'wimper.orig.jpg' ]);
    convertWebp([ 'shaka-emoji.png' ], false);

    done();
});

gulp.task('watch', gulp.parallel('watch:img', 'watch:js', 'watch:css', 'watch:root'));
gulp.task('build', gulp.parallel('js:transpile', 'css', 'img', 'copy'));
gulp.task('default', gulp.series('clean', 'build', 'webp', 'serve', 'browser', 'watch'));

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
