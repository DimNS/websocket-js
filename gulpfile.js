var gulp   = require('gulp');        // Сам Gulp JS
var concat = require('gulp-concat'); // Склейка файлов
var rename = require('gulp-rename'); // Переименование файлов
var uglify = require('gulp-uglify'); // Минификация JS

// WATCHER

function watcher() {
    return gulp.watch('src/*.js', gulp.series(js, minjs));
}

// JS

function js() {
    return gulp.src('src/*.js')
        .pipe(concat('websocket.js'))
        .pipe(gulp.dest('dist'));
}

function minjs() {
    return gulp.src('dist/websocket.js')
        .pipe(uglify())
        .pipe(rename('websocket.min.js'))
        .pipe(gulp.dest('dist'));
}

// TASKS

gulp.task('build', gulp.series(js, minjs));
gulp.task('watcher', gulp.series('build', watcher));