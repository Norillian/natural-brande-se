var gulp = require('gulp');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
// var htmlmin = require('gulp-htmlmin');
var template = require('gulp-underscore-template-custom');

var input = {
      'templates': './js/templates/*.html',
      'basketApi': './js/basketApi.js'
    }

gulp.task('templates', function() {
  return gulp.src('./js/templates/*.html')
      // .pipe(htmlmin({
      //     collapseWhitespace: true,
      //     conservativeCollapse: true
      // }))
      .pipe(template({varName: 'templates'}))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest('./js/'))
});

gulp.task('basketApi', function() {
  return gulp.src(['./js/basketApi.js', './js/templates.js'])
 		.pipe(gutil.env.type !== 'production' ? sourcemaps.init() : gutil.noop())
    .pipe(concat('basket_api.js'))
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(gutil.env.type !== 'production' ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest('./prod/'));
});

gulp.task('default', ['watch']);

gulp.task('watch', ['templates', 'basketApi'], function() {
  gulp.watch(input.templates, ['basketApi', 'templates']);
  gulp.watch(input.basketApi, ['basketApi']);
});
