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
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpIf = require('gulp-if'),
    gutil = require('gulp-util'),
    using = require('gulp-using'),
    rollup = require('gulp-better-rollup'),
    rollupNodeResolve = require('rollup-plugin-node-resolve'),
    rollupCommonJs = require('rollup-plugin-commonjs'),
    ip = require('ip'),
    paths = require('./paths.json'),
    devEnv = process.argv.indexOf('--dev') > -1,
    usingTemplate = {
        prefix: 'new file was created:',
        filesize: true,
        color: 'yellow',
        path: 'relative'
    };

gulp.task('clean', () => {
    return del(paths.dist);
});

gulp.task('server', () => {
    gutil.log(gutil.colors.yellow(`lan access via ${ip.address()}:8080`));

    return connect.server({
        port: 8080,
        livereload: true,
        root: paths.dist
    });
});

gulp.task('open:page', () => {
    return nodeOpen('http://localhost:8080');
});

gulp.task('open:folder', () => {
    return nodeOpen('dist');
});

gulp.task('sass', () => {
    return gulp.src(paths.srcScss)
        .pipe(plumber())
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }))
        .pipe(gulpIf(devEnv, sourcemaps.init()))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpIf(!devEnv, cleanCss()))
        .pipe(gulpIf(devEnv, sourcemaps.write('.')))
        .pipe(gulp.dest(paths.distCss))
        .pipe(connect.reload())
        .pipe(using(usingTemplate));
});

gulp.task('js', () => {
    return gulp.src(paths.srcJsEntry)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(gulpIf(devEnv, sourcemaps.init()))
        .pipe(rollup({
            plugins: [
                rollupNodeResolve({
                    jsnext: true,
                    main: true,
                    browser: true
                }),
                rollupCommonJs()
            ]
        }, {
            dest: 'bundle.js',
            format: 'iife'
        }))
        .pipe(gulpIf(!devEnv, babel()))
        .pipe(gulpIf(!devEnv, uglify()))
        .pipe(gulpIf(devEnv, sourcemaps.write('.')))
        .pipe(gulp.dest(paths.distJs))
        .pipe(connect.reload())
        .pipe(using(usingTemplate));
});

gulp.task('html', () => {
    return gulp.src(paths.srcHtml)
        .pipe(changed(paths.dist))
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload())
        .pipe(using(usingTemplate));
});

gulp.task('img', () => {
    return gulp.src(paths.srcImg)
        .pipe(changed(paths.distImg))
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 7,
            progressive: true,
            multipass: true
        }))
        .pipe(gulp.dest(paths.distImg))
        .pipe(connect.reload())
        .pipe(using(usingTemplate));
});

gulp.task('font', () => {
    return gulp.src(paths.srcFont)
        .pipe(changed(paths.distFont))
        .pipe(plumber())
        .pipe(gulp.dest(paths.distFont))
        .pipe(connect.reload())
        .pipe(using(usingTemplate));
});

gulp.task('copy', () => {
    return gulp.src(paths.srcRoot)
        .pipe(changed(paths.dist))
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload())
        .pipe(using(usingTemplate));
});

gulp.task('watch', () => {
    gulp.watch(paths.srcHtml, ['html']);
    gulp.watch(paths.srcImg, ['img']);
    gulp.watch(paths.srcJs, ['js']);
    gulp.watch(paths.srcScss, ['sass']);
    gulp.watch(paths.srcFont, ['font']);
    gulp.watch(paths.srcRoot, ['copy']);
});

gulp.task('default', (callback) => {
    runSequence('clean', 'build', 'server', 'watch', 'open:page', callback);
});

gulp.task('build', (callback) => {
    runSequence(['js', 'sass', 'html', 'img', 'font', 'copy'], callback);
});
