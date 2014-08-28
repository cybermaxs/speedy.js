var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');


gulp.task('min', function () {
    gulp.src('src/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify('speedy.min.js'))
      .pipe(gulp.dest('dist/'))
});


gulp.task('default', ['min']);