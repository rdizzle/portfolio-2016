const fs = require('fs');
const cp = require('child_process');

const del = require('del');
const open = require('open');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const autoprefixer = require('autoprefixer');
const stylelint = require('stylelint');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const postcssCalc = require('postcss-calc');
const postcssImport = require('postcss-import');
const postcssColorMod = require('postcss-color-mod-function');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');

const pathsConfig = require('./paths.config');
const webpackConfig = require('./webpack.config');

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
    return gulp.src(pathsConfig.src.entry.css, {
            sourcemaps: prod ? false : true
        })
        .pipe(plumber())
        .pipe(postcss([
            stylelint(),
            postcssImport(),
            postcssColorMod(),
            postcssPresetEnv({
                stage: 0
            }),
            postcssCalc(),
            ...(prod ? [autoprefixer()] : []),
            ...(prod ? [cssnano()] : [])
        ]))
        .pipe(gulp.dest(pathsConfig.dist.css, {
            sourcemaps: prod ? false : true
        }))
        .pipe(connect.reload());
});

gulp.task('js', () => {
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
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest(pathsConfig.dist.img))
        .pipe(connect.reload());
});

gulp.task('webp', done => {
    pathsConfig.webp.forEach(file => {
        const pair = file.split(';');
        const src = 'src/img/';
        const dist = 'dist/img/';
        const name = pair[0].match(/^[^.]+/)[0];
        const ext = pair[0].match(/\w+$/)[0];
        const widths = pair[1] ? pair[1].split(',') : null;

        if (widths) {
            widths.forEach(width => {
                cp.execSync(`bin/cwebp -quiet -q 70 -z 9 -m 6 -mt -resize ${width} 0 ${src + name}.${ext} -o ${dist + name}-${width}w.webp`);
            });
        } else {
            cp.execSync(`bin/cwebp -quiet -q 70 -z 9 -m 6 -mt ${src + name}.${ext} -o ${dist + name}.webp`);
        }
    });

    done();
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
    gulp.watch(pathsConfig.src.js, gulp.parallel('js'));
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

gulp.task('watch', gulp.parallel('watch:img', 'watch:js', 'watch:css', 'watch:root'));
gulp.task('build', gulp.parallel('js', 'css', 'img', 'copy'));
gulp.task('default', gulp.series('clean', 'build', 'webp', 'serve', 'browser', 'watch'));
