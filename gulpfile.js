var gulp = require('gulp'),
    del = require('del'),
    runsequence = require('run-sequence'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    jsmin = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed');

var src = 'src/',
    dist = 'dist/',
    srcJs = src + 'js/',
    srcJsFiles = srcJs + '*.js',
    srcLess = src + 'less/',
    srcLessFiles = srcLess + '*.less',
    srcImg = src + 'img/',
    srcImgFiles = srcImg + '*',
    srcHtmlFiles = src + '*.html',
    distJs = dist + 'js/',
    distCss = dist + 'css/',
    distImg = dist + 'img/',
    srcRootFiles = [src + 'sitemap.xml', src + 'robots.txt', src + '.htaccess'];

gulp.task('clean', function(){
    return del(dist);
});

gulp.task('server', function(){
    return connect.server({
        port: 3000,
        livereload: true,
        root: dist
    });
});

gulp.task('less', function(){
    return gulp.src(srcLessFiles)
        .pipe(changed(distCss, {extension: '.css'}))
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(gulp.dest(distCss))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(distCss))
        .pipe(connect.reload());
});

gulp.task('js', function(){
    return gulp.src(srcJsFiles)
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

gulp.task('html', function(){
    return gulp.src(srcHtmlFiles)
        .pipe(changed(dist))
        .pipe(plumber())
        .pipe(gulp.dest(dist))
        .pipe(connect.reload());
});

gulp.task('img', function(){
    return gulp.src(srcImgFiles)
        .pipe(changed(distImg))
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            multipass: true
        }))
        .pipe(gulp.dest(distImg))
        .pipe(connect.reload());
});

gulp.task('rootFiles', function(){
    return gulp.src(srcRootFiles)
        .pipe(changed(dist))
        .pipe(plumber())
        .pipe(gulp.dest(dist))
        .pipe(connect.reload());
});

gulp.task('watch', function(){
    gulp.watch(srcHtmlFiles, ['html']);
    gulp.watch(srcImgFiles, ['img']);
    gulp.watch(srcJsFiles, ['js']);
    gulp.watch(srcLessFiles, ['less']);
    gulp.watch(srcRootFiles, ['rootFiles']);
});

gulp.task('default', function(){
    runsequence('clean', ['build', 'server'], 'watch');
});

gulp.task('build', ['js', 'less', 'html', 'img', 'rootFiles']);
