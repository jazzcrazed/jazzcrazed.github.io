var gulp        = require('gulp');
var gutil       = require('gulp-util');
var cssmin      = require('gulp-cssmin');
var extend      = require('gulp-extend');
var coffee      = require('gulp-coffee');
var compass     = require('gulp-compass');
var wintersmith = require('run-wintersmith');
var clean       = require('gulp-clean');
var uglify      = require('gulp-uglify');
var path        = require('path');
var fs          = require('fs');
var awspublish  = require('gulp-awspublish');

var BUILD_DIR = 'build';
var CONTENT_DIR = 'contents';
var TEMPLATES_DIR = 'templates';

gulp.task('clean', function() {
  return gulp.src(BUILD_DIR, { read: false }).pipe(clean());
});

gulp.task('coffee', function() {
  gulp.src(CONTENT_DIR + '/coffee/*.coffee')
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .pipe(gulp.dest(CONTENT_DIR + '/js/script.js'));
});

gulp.task('uglify', function() {
  var dir = CONTENT_DIR + '/*.js';
  gulp.src(dir)
      .pipe(uglify())
      .pipe(gulp.dest(dir))
});

gulp.task('compass', function() {
  gulp.src(CONTENT_DIR + '/sass/*.scss')
      .pipe(compass({
        project: path.join(__dirname, '/' + CONTENT_DIR),
        css: 'css',
        sass: 'sass'
      }))
      .pipe(gulp.dest(CONTENT_DIR + '/css'));
});

gulp.task('cssmin', function() {
  var dir = CONTENT_DIR + '/css';
  gulp.src(dir + '/**/*.css')
      .pipe(cssmin())
      .pipe(gulp.dest(dir));
});

gulp.task('set-preview-config', function() {
  console.log('Creating preview config');
  gulp.src(['./config.json', './config-preview-base.json'])
      .pipe(extend('config-preview.json', true))
      .pipe(gulp.dest('./'));

  console.log('Setting preview config for Wintersmith\'s use');
  wintersmith.settings.configFile = 'config-preview.json';
});

gulp.task('set-production-config', function() {
  console.log('Creating production config');
  gulp.src(['./config.json', './config-production-base.json'])
      .pipe(extend('config-production.json', true))
      .pipe(gulp.dest('./'));

  console.log('Setting production config for Wintersmith\'s use');
  wintersmith.settings.configFile = 'config-production.json';
});

gulp.task('preview', ['coffee', 'compass'], function() {
  console.log('Starting preview');
  wintersmith.settings.configFile = 'config-preview.json';
  console.log('Config file set to: ' + wintersmith.settings.configFile);
  wintersmith.preview();
});

gulp.task('build-and-deploy', ['clean', 'coffee', 'uglify', 'compass', 'cssmin', 'set-production-config'], function() {
  console.log('Running Wintersmith build');
  wintersmith.build(function(){
    // Log on successful build
    console.log('Wintersmith has finished building!');

    console.log('Reading AWS config');
    // create a new publisher
    var publisher = awspublish.create(JSON.parse(fs.readFileSync('./env.json')));

    return gulp.src('./' + BUILD_DIR + '/**')
      .pipe(publisher.publish())

      // create a cache file to speed up consecutive uploads
      .pipe(publisher.cache())

       // print upload updates to console
      .pipe(awspublish.reporter());
  });
});
