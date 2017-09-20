const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const webpack = require('webpack-stream');


gulp.task('webpack', function () {
  return gulp.src('frontend/index.js').pipe(webpack(require('./webpack.config.js')))
    .on('error', function () {
      this.emit('end');
    })
    .pipe(gulp.dest('public/'))
})

gulp.task('server', ['webpack'], function (cb) {
  gulp.watch(['frontend/**/*.js'], ['webpack']);

  let started = false;
  return nodemon({
    script: 'src/index',
    ext: 'js',
    ignore: [
      'frontend/',
      'public/'
    ]
  }).on('start', function () {
    if (!started) {
      started = true;
      cb();
    }
  }).on('error', function (err) {
    console.log(err)
  })
})