var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');   // node package
var wiredep = require('wiredep').stream;   // inject dependencies from bower

function log(msg) {
  var item;

  if (typeof msg === 'object') {
    for (item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

function errorLogger(error) {
  log('*** Start of Error ***');
  log(error);
  log('*** End of Error ***');
  this.emit('end');  // end up the stream workflow
}

function clean(path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path).then(done());
}

/* JS Compilation */
/*******************/
gulp.task('vet', function vet() {
  log('Analyzing source with JSHint and JSCS');

  return gulp.src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', { verbose: true }));
  // .pipe($.eslint())
  // .pipe($.eslint.format())
  // .pipe($.eslint.failOnError());
});

/* CSS Compilation */
/*******************/
// clean-styles does not return a stream, so when used as a dependency task,
// it won't necessarily run before styles
// To make sure it runs before => add a callback to clean-styles
// The function in styles acts as the callback for clean-styles
gulp.task('styles', ['clean-styles'], function() {
  log('Compiling Sass --> CSS');

  return gulp.src(config.sass)
    // .pipe($.sass())
    .pipe($.plumber())   // Log errors
    .pipe($.less())
    // .on('error', errorLogger)
    .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
    .pipe(gulp.dest(config.temp));
});

// done is the cb from styles task
gulp.task('clean-styles', function(done) {
  var files = config.temp + '**/*.css';
  clean(files, done);   // done is a callback
});

gulp.task('sass-watcher', function() {
  gulp.watch(config.sass, ['styles']);
});

/* HTML Injection */
/******************/
gulp.task('wiredep', function() {
  var options = config.getWiredepDefaultOptions();
  log('Wire up bower js/css and our app js into the html');

  return gulp.src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.js)))
    .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
  log('Call wiredep and wire up the app css into the html');

  return gulp.src(config.index)
    .pipe($.inject(gulp.src(config.css)))
    .pipe(gulp.dest(config.client));
});

