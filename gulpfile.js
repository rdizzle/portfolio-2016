var gulp = require('gulp'),
    del = require('del'),
    runSequence = require('run-sequence'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    jsmin = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed');

var src = 'src/',
    srcJs = src + 'js/*.js',
    srcLess = src + 'less/*.less',
    srcImg = src + 'img/*',
    srcHtml = src + '*.html',
    srcRoot = [src + 'sitemap.xml', src + 'robots.txt', src + '.htaccess'],
    dist = 'dist/',
    distJs = dist + 'js/',
    distCss = dist + 'css/',
    distImg = dist + 'img/';

gulp.task('clean', function () {
    return del(dist);
});

gulp.task('server', function () {
    return connect.server({
        port: 3000,
        livereload: true,
        root: dist
    });
});

gulp.task('less', function () {
    return gulp.src(srcLess)
        .pipe(changed(distCss, {
            extension: '.css'
        }))
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(distCss))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distCss))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    return gulp.src(srcJs)
        .pipe(changed(distJs))
        .pipe(plumber())
        .pipe(gulp.dest(distJs))
        .pipe(jsmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distJs))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    return gulp.src(srcHtml)
        .pipe(changed(dist))
        .pipe(plumber())
        .pipe(gulp.dest(dist))
        .pipe(connect.reload());
});

gulp.task('img', function () {
    return gulp.src(srcImg)
        .pipe(changed(distImg))
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 6,
            progressive: true,
            multipass: true
        }))
        .pipe(gulp.dest(distImg))
        .pipe(connect.reload());
});

gulp.task('root', function () {
    return gulp.src(srcRoot)
        .pipe(changed(dist))
        .pipe(plumber())
        .pipe(gulp.dest(dist))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(srcHtml, ['html']);
    gulp.watch(srcImg, ['img']);
    gulp.watch(srcJs, ['js']);
    gulp.watch(srcLess, ['less']);
    gulp.watch(srcRoot, ['root']);
});

gulp.task('default', function (callback) {
    runSequence('clean', 'build', 'server', 'watch', callback);
});

gulp.task('build', function (callback) {
    runSequence(['js', 'less', 'html', 'img', 'root'], callback);
});
