var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var bump = require('gulp-bump');


gulp.task('min', function () {
    gulp.src('src/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify('speedy.min.js'))
      .pipe(gulp.dest('dist/'))
});

gulp.task('bump', function () {
    gulp.src('./*.json')
    .pipe(bump({ type: 'patch' }))
    .pipe(gulp.dest('./'));
});


gulp.task('default', ['min']);
gulp.task('dist', ['min', 'bump']);