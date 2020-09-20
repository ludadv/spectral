const gulp = require('gulp');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cssImport = require('gulp-cssimport');
const browserSync = require('browser-sync').create();
const minifyCSS = require('gulp-minify-css');

sass.compiler = require('node-sass');

const isDevelopment = !process.argv.includes('-p');

gulp.task('sass', function () {
    return gulp.src('./sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssImport({
            includePaths: ['./node_modules/']
        }))
        .pipe(gulpIf(!isDevelopment, minifyCSS()))
        .pipe(autoprefixer('last 2 version', '> 1%', 'ie 8', 'ie 7'))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('serve', function () {
    browserSync.init({
        server: './',
        port: 8080
    });

    browserSync.watch('./*.html').on('change', browserSync.reload);
    browserSync.watch('./style.css').on('change', browserSync.reload);
});

gulp.task('build', [
    'sass'
]);

gulp.task('default', [
    'build',
    'watch',
    'serve'
]);
