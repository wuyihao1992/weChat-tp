'use strict';

var fs = require('fs'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    pref = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    zip = require('gulp-zip'),
    del = require('del');

var runSequence = require('run-sequence').use(gulp);
var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();
var gulpif = require('gulp-if');

// var sprite = require('css-sprite').stream;
var sprite = require('sprity');
var spriter = require('gulp-css-spriter');
var spritesmith = require('gulp.spritesmith');

var option = {
    read : false,
    force : true
};

/**
 * 清除.bak文件
 */
gulp.task('clear', function (cb) {
    return gulp.src([
        '../Application/Home/View/**/*.bak'
    ])
        .pipe(clean(option));
});

/**
 * FIXME: 删除不了项目外的文件
 */
gulp.task('delete', function(cb) {
    return del([
        '../Application/Home/View/**/*.bak'
    ], cb);
});

/**
 * 清除打包文件
 */
gulp.task('clean', function(cb) {
    return del([
        'dist/**/*',
        'js/dist/*',
        'css/*'
    ], cb);
});

/**
 * 打包资源文件 js & css
 */
gulp.task('framework', function() {
    // TODO: lib js
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
        // 'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/nprogress/nprogress.js',
        'bower_components/zepto/zepto.js',
        'bower_components/highcharts/highcharts.js',
        'bower_components/highcharts/modules/no-data-to-display.js',
        'bower_components/highcharts/highcharts-more.js',
        'bower_components/highcharts/modules/solid-gauge.js',
        'bower_components/js-sha1/src/sha1.js',
        // 'js/jquery.plugin.js',
        // 'bower_components/distpicker/dist/distpicker.data.min.js',
        // 'bower_components/distpicker/dist/distpicker.min.js',
        // 'bower_components/jquery.dateFormat.min/index.js',
        'bower_components/touchslider/index.js',
        'js/public/common.js'
    ])
    .pipe(maps.init())
    .pipe(concat('framework.js'))
    //.pipe(uglify())
    .pipe(maps.write('.'))
    .pipe(gulp.dest('assets/js/'));

    // TODO: requireJS
    gulp.src([
        'bower_components/requirejs/require.js'
    ])
    .pipe(maps.init())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(maps.write('.'))
    .pipe(gulp.dest('assets/js/'));

    // TODO: lib css
    gulp.src([
       // 'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/font-awesome/css/font-awesome.css',
        'bower_components/nprogress/nprogress.css'
    ])
    .pipe(maps.init())
    .pipe(cleanCSS())
    .pipe(concat('framework.css'))
    .pipe(maps.write('.'))
    .pipe(gulp.dest('assets/css/'));

    // TODO: fonts
    gulp.src([
        'bower_components/bootstrap/dist/fonts/*',
        'bower_components/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('assets/fonts/'));

    // TODO: layer
    gulp.src(['bower_components/layer/src/**/*']).pipe(gulp.dest('assets/layer'));

    // TODO: layer skin
    gulp.src(['sass/layerskin*/*.css']).pipe(gulp.dest('assets/layer/skin'));
});

/**
 * 编译.scss
 */
gulp.task('sass', function() {
    // gulp.src(['sass/icons/*']).pipe(gulp.dest('css/icons'));

    return gulp.src('./sass/**/*.scss')
        .pipe(maps.init())
        .pipe(sass({
            //outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(pref(['last 10 versions']))
        //.pipe(rename({suffix: '.min'}))
        //.pipe(cleanCSS())
        .pipe(maps.write('.'))
        .pipe(gulp.dest('./css'));
});

/**
 * 用于压缩js
 */
gulp.task('js', function() {
    return gulp.src([])
    .pipe(maps.init())
    .pipe(concat('base-data.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(maps.write('.'))
    .pipe(gulp.dest('assets/js'));
});

/**
 * css-sprite(未安装) 生成雪碧图（CSS图像拼合技术，CSS贴图定位. 目前用了 gulp.spritesmith生成）
 */
// generate sprite.png and _sprite.scss
gulp.task('sprite', function () {
    return gulp.src('sass/icons/*.png')
        .pipe(sprite({
            name: 'sprite',
            style: '_sprite.scss',
            cssPath: './sass',
            processor: 'scss'
        }))
        .pipe(gulpif('*.png', gulp.dest('./css/icons/'), gulp.dest('./css')));
});
// generate scss with base64 encoded images
gulp.task('base64', function () {
    return gulp.src('./img/*.png')
        .pipe(sprite({
            base64: true,
            style: '_base64.scss',
            processor: 'scss'
        }))
        .pipe(gulp.dest('./dist/scss/'));
});

/**
 * FIXME: gulp-css-spriter 生成雪碧图
 */
gulp.task('cssSpriter', function() {
    return gulp.src('./css/cssSpriter.css')//比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': './css/icons/cssSpriter.png', //这是雪碧图自动合成的图。 很重要
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': './sass/icons/*.png' //这是在css引用的图片路径，很重要
        }))
        .pipe(gulp.dest('./css')); //最后生成出来
});

/**
 * gulp.spritesmith 生成雪碧图
 */
gulp.task('spriteSmith', function () {
    return gulp.src('./sass/icons/*.png')
        .pipe(spritesmith({
            imgName: 'icons/spriteSmith.png',
            cssName: 'spriteSmith.css',
            padding: 5,
            algorithm: 'binary-tree',
            cssTemplate: "./sass/icons/spriteTemplate.css"
        }))
        .pipe(gulp.dest('./css'));
});

/**
 * 监听任务
 */
gulp.task('watch', ['clean', 'sass'], function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);

/**
 * function(cb)回调，用于配置异步任务。避免边删除边编译的情况。
 */
gulp.task('build', ['clean'], function(cb) {
    return gulp.start(['framework', 'sass'], cb);
});
