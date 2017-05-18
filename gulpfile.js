'use strict';

let gulp = require('gulp'),
    del = require('del'),
    runSequence = require('run-sequence'),
    nodeOpen = require('open'),
    stylish = require('jshint-stylish'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpIf = require('gulp-if'),
    using = require('gulp-using'),
    rollup = require('gulp-better-rollup'),
    paths = require('./config/paths'),
    usingConfig = require('./config/using.config'),
    rollupConfig = require('./config/rollup.config'),
    babelConfig = require('./config/babel.config'),
    autoprefixerConfig = require('./config/autoprefixer.config'),
    connectConfig = require('./config/connect.config'),
    jshintConfig = require('./config/jshint.config'),
    devEnv = process.argv.indexOf('--dev') > -1;

gulp.task('clean', () => {
    return del(paths.dist.root);
});

gulp.task('server', () => {
    return connect.server(connectConfig);
});

gulp.task('open:page', () => {
    return nodeOpen('http://localhost:8080');
});

gulp.task('open:folder', () => {
    return nodeOpen(paths.dist.root);
});

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
        .pipe(using(usingConfig));
});

gulp.task('js', ['jshint'], () => {
    return gulp.src(paths.src.files.jsEntry)
        .pipe(plumber())
        .pipe(gulpIf(devEnv, sourcemaps.init()))
        .pipe(rollup(rollupConfig.input, rollupConfig.output))
        .pipe(gulpIf(!devEnv, babel(babelConfig)))
        .pipe(gulpIf(!devEnv, uglify()))
        .pipe(gulpIf(devEnv, sourcemaps.write('.')))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(connect.reload())
        .pipe(using(usingConfig));
});

gulp.task('jshint', () => {
    return gulp.src(paths.src.files.js)
        .pipe(plumber())
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(stylish));
});

gulp.task('img', () => {
    return gulp.src(paths.src.files.img)
        .pipe(changed(paths.dist.img))
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true,
                optimizationLevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 7
            }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest(paths.dist.img))
        .pipe(connect.reload())
        .pipe(using(usingConfig));
});

gulp.task('copy', () => {
    return gulp.src(paths.src.files.root, {
            base: 'src'
        })
        .pipe(changed(paths.dist.root))
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist.root))
        .pipe(connect.reload())
        .pipe(using(usingConfig));
});

gulp.task('watch', () => {
    gulp.watch(paths.src.files.img, ['img']);
    gulp.watch(paths.src.files.js, ['js']);
    gulp.watch(paths.src.files.sass, ['sass']);
    gulp.watch(paths.src.files.root, ['copy']);
});

gulp.task('default', cb => {
    runSequence('clean', 'build', 'server', 'watch', 'open:page', cb);
});

gulp.task('build', cb => {
    runSequence(['js', 'sass', 'img', 'copy'], cb);
});
