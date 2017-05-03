var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require("gulp-sourcemaps");


gulp.task('khoaijs-dom-plugin', function () {
    return gulp.src('dom-plugin.js')
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});


gulp.task('default', ['khoaijs-dom-plugin']);