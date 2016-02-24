var gulp = require('gulp')
var watch = require('gulp-watch')
var connect = require('gulp-connect')
var run = require('gulp-sequence')

var fn = {
  html: function () {
    return gulp.src('./*.html')
      .pipe(connect.reload())
  },
  js: function () {
    return gulp.src('./*.js')
      .pipe(connect.reload())
  },
  localserver: function () {
    connect.server({
      livereload: true,
      root: '.',
      port: 9001
    })
  },
  watch: function () {
    watch('./*.html', function () { gulp.start(['html']) })
    watch('./*.js', function () { gulp.start(['js']) })
  }
}

gulp.task('js',fn.js)
gulp.task('html',fn.html)
gulp.task('localserver',fn.localserver)
gulp.task('watch',fn.watch)

gulp.task('default', run('watch','localserver'))
