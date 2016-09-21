var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();
var glob = require("glob");
var path = require("path");
var merge = require("gulp-merge-json");
var jsonAngularTranslate = require("gulp-json-angular-translate");
var fs = require("fs");

var paths = {
  sass: ['./scss/**/*.scss'],
  javascript: [
    './www/js/modules/**/*.js',
    './www/translations/*.js',
    '!./www/js/app.js',
    '!./www/lib/**'
  ],
  css: [
    '!./www/css/*.css',
    './www/lib/**/*min.css',
    '!./www/lib/**/demo/**/*min.css'

  ]
};

gulp.task('default', ['sass', "bower"]);


gulp.task('scss', function () {
  return gulp.src('./scss/mi_styles.scss')
    .pipe(inject(
      gulp.src(['./scss/**/*.scss', '!./scss/ionic.app.scss', '!./scss/mi_styles.scss'], {read: false}),
      {
        starttag: '/* inject:scss */',
        endtag: '/* endinject */',
        relative: true,
        transform: function (filepath) {
          return '@import ' + "'" + filepath + "'" + ";";
        }
      }
    ))
    .pipe(gulp.dest('./scss'));
});


gulp.task('sass', ['scss'], function (done) {
  gulp.src(['./scss/mi_styles.scss'])
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css'))
    .on('end', done);
});

gulp.task('index', function(){
  return gulp.src('./www/index.html')
    .pipe(inject(
      gulp.src(paths.javascript,
        {read: false}), {relative: true}))
    .pipe(gulp.dest('./www'))
    .pipe(inject(
      gulp.src("./www/css/*.css",
        {read: false}), {relative: true}))
    .pipe(gulp.dest('./www'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch("./www/**/*.js", ['bower']);
  gulp.watch([
    paths.javascript,
    "./www/css/*.css"
  ], ['index']);
  gulp.watch("./scss/!**!/!*.scss'", ['scss']);
});

gulp.task('bower', ["index"], function () {
  gulp.src('./www/index.html')
    .pipe(inject(gulp.src(bowerFiles({
      paths: {
        bowerDirectory: 'www/lib',
        bowerJson: './bower.json'
      }
    }), {read: false}), {name: 'bower', relative: true}))
    .pipe(gulp.dest('./www'));
  browserSync.reload();

});


gulp.task("translate", function () {
  glob.sync("www/translate/*/", ["nodir"]).forEach(function (filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      var src = "./www/translate/" + path.basename(filePath) + "/**/*.json";
      var dest = "locale-" + path.basename(filePath) + ".json";
      gulp.src(src)
        .pipe(merge(dest))
        .pipe(jsonAngularTranslate({
          moduleName: "miApp"
        }))
        .pipe(gulp.dest("www/translations"));
    }
  });
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
