var gulp = require('gulp');
var concat = require('gulp-concat');
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
    .pipe(concat('basket_api.js'))
    .pipe(gulp.dest('./prod/'));
});

gulp.task('default', ['watch']);

gulp.task('watch', ['templates', 'basketApi'], function() {
  gulp.watch(input.templates, ['basketApi', 'templates']);
  gulp.watch(input.basketApi, ['basketApi']);
});
