'use strict';

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
    const pngSvgGif = gulp.src(`${paths.src.img}/*.{png,svg,gif}`)
        .pipe(changed(paths.dist.img))
        .pipe(plumber())
        .pipe(gulpIf(!dev, imagemin([
            imagemin.gifsicle({
                optimizationLevel: 3
            }),
            imagemin.svgo(),
            pngquant()
        ], {
            verbose: true
        })))
        .pipe(gulp.dest(paths.dist.img))
        .pipe(connect.reload())
        .pipe(using(usingConfig));

    const jpg = gulp.src(`${paths.src.img}/*.{jpg,jpeg}`)
        .pipe(changed(paths.dist.img))
        .pipe(plumber())
        .pipe(gulpIf(!dev, imagemin([
            guetzli({
                quality: 85
            })
        ], {
            verbose: true
        })))
        .pipe(gulp.dest(paths.dist.img))
        .pipe(connect.reload())
        .pipe(using(usingConfig));

    const webp = gulp.src(`${paths.src.img}/*.webp`)
        .pipe(changed(paths.dist.img))
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist.img))
        .pipe(connect.reload())
        .pipe(using(usingConfig));

    return merge(pngSvgGif, jpg, webp);
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

gulp.task('watch:img', () => gulp.watch(paths.src.files.img, gulp.parallel('img')));
gulp.task('watch:js', () => gulp.watch(paths.src.files.js, gulp.parallel('js:lint', 'js:transpile')));
gulp.task('watch:css', () => gulp.watch(paths.src.files.sass, gulp.parallel('sass')));
gulp.task('watch:root', () => gulp.watch(paths.src.files.root, gulp.parallel('copy')));

gulp.task('watch', gulp.parallel('watch:img', 'watch:js', 'watch:css', 'watch:root'));
gulp.task('build', gulp.parallel('js:transpile', 'js:lint', 'sass', 'img', 'copy'));
gulp.task('default', gulp.series('clean', 'build', 'server', 'open:page', 'watch'));
