'use strict';

var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var pref = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var zip = require('gulp-zip');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);
var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();

gulp.task('clean', function(cb) {
    return del([
        'dist/**/*',
        'js/dist/*',
        'css/*'
    ], cb);
});

gulp.task('build', ['clean'], function(cb) {
    return gulp.start(['framework', 'sass'], cb);
});

gulp.task('sass', function() {
    gulp.src([
            'sass/icons/*'
        ])
        .pipe(gulp.dest('css/icons'));
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


gulp.task('framework', function() {
    gulp.src([
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/easyui/jquery.easyui.min.js',
            'bower_components/nprogress/nprogress.js',
            'bower_components/js-sha1/src/sha1.js',
            'js/jquery.plugin.js',
            'bower_components/distpicker/dist/distpicker.data.min.js',
            'bower_components/distpicker/dist/distpicker.min.js',
            'bower_components/jquery.dateFormat.min/index.js'
    ])
        .pipe(maps.init())
        .pipe(concat('framework.js'))
        //.pipe(uglify())
        .pipe(maps.write('.'))
        .pipe(gulp.dest('assets/js/'));

    gulp.src([
           'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/font-awesome/css/font-awesome.css',
            'bower_components/nprogress/nprogress.css',
            'bower_components/easyui/themes/metro-pms/easyui.css',
            'bower_components/easyui/themes/icon.css',
            'bower_components/easyui/themes/color.css'
    ])
        .pipe(maps.init())
        .pipe(cleanCSS())
        .pipe(concat('framework.css'))
        .pipe(maps.write('.'))
        .pipe(gulp.dest('assets/css/'));

    gulp.src([
            'bower_components/bootstrap/dist/fonts/*',
            'bower_components/font-awesome/fonts/*'
        ])
        .pipe(gulp.dest('assets/fonts/'));

    gulp.src([
            'bower_components/easyui/themes/icons/*'
        ])
        .pipe(gulp.dest('assets/css/icons'));

    gulp.src([
            'bower_components/easyui/themes/metro-pms/images/*'
        ])
        .pipe(gulp.dest('assets/css/images'));

    gulp.src([
        'bower_components/layer/src/**/*'
    ])
        .pipe(gulp.dest('assets/layer'));

    gulp.src([
        'sass/layerskin*/*.css'
    ])
        .pipe(gulp.dest('assets/layer/skin'));
});

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

gulp.task('watch', ['clean', 'sass'], function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);