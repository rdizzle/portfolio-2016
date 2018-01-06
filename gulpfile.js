'use strict';

const gulp = require('gulp'),
    del = require('del'),
    nodeOpen = require('open'),
    stylish = require('jshint-stylish'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    merge = require('merge-stream'),
    pngquant = require('imagemin-pngquant'),
    guetzli = require('imagemin-guetzli'),
    named = require('vinyl-named'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpIf = require('gulp-if'),
    using = require('gulp-using'),
    paths = require('./config/paths'),
    webpackConfig = require('./config/webpack'),
    usingConfig = require('./config/using'),
    autoprefixerConfig = require('./config/autoprefixer'),
    connectConfig = require('./config/connect'),
    jshintConfig = require('./config/jshint'),
    devEnv = process.argv.includes('--dev');

gulp.task('clean', () => del(paths.dist.root));

gulp.task('server', () => connect.server(connectConfig));

gulp.task('open:page', () => nodeOpen(`http://localhost:${connectConfig.port}`));

gulp.task('open:folder', () => nodeOpen(paths.dist.root));

gulp.task('sass', () => {
    return gulp.src(paths.src.files.sass)
        .pipe(plumber())
        .pipe(gulpIf(devEnv, sourcemaps.init()))
        .pipe(sass.sync())
        .pipe(autoprefixer(autoprefixerConfig))
        .pipe(gulpIf(!devEnv, cleanCss()))
        .pipe(gulpIf(devEnv, sourcemaps.write('.')))
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
        .pipe(gulpIf(!devEnv, imagemin([
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
        .pipe(gulpIf(!devEnv, imagemin([
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

gulp.task('js', gulp.series('js:lint', 'js:transpile'));
gulp.task('build', gulp.parallel('js', 'sass', 'img', 'copy'));
gulp.task('default', gulp.series('clean', 'build', 'open:page', 'server'));
gulp.task('dist', gulp.series('clean', 'build', 'open:folder'));

gulp.watch(paths.src.files.img).on('all', gulp.parallel('img'));
gulp.watch(paths.src.files.js).on('all', gulp.parallel('js'));
gulp.watch(paths.src.files.sass).on('all', gulp.parallel('sass'));
gulp.watch(paths.src.files.root).on('all', gulp.parallel('copy'));
