const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

exports.default = function() {
  return gulp
    .src('polyfills/*/polyfill.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('polyfills'));
};
