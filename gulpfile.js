var gulp               = require('gulp'),
    gulpFilter         = require('gulp-filter'),
    gutil              = require('gulp-util'),
    debug              = require('gulp-debug'),
    ejs                = require('gulp-ejs'),
    autoprefixer       = require('gulp-autoprefixer'),
    express            = require('express'),
    app                = express(),
    deploy             = require('gulp-gh-pages');

var es                 = require('event-stream');

var MetalSmith         = require('metalsmith'),
    autoprefixer       = require('metalsmith-autoprefixer'),
    collection         = require('metalsmith-collections'),
    handlebars         = require('handlebars'),
    ignore             = require('metalsmith-ignore'),
    sass               = require('metalsmith-sass'),
    templates          = require('metalsmith-templates'),
    q                  = require('q'),
    _                  = require('lodash');

var tmp                = './.tmp';
var prod               = './build';
var base = {
  production: '//redhatbrand.github.io/RedHatForumTemplates',
  development: ''
};

handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

function url(){
  return function addUrl(files, metalsmith, done){
    for (var file in files) {
      files[file].url = file;
    }
    done();
  };
}

function addSiblings (file, files) {
  var path = file.split('/');
  var siblings = [];
  path.pop();

  for (var possibleSibling in files) {
    var possibleSiblingPath = possibleSibling.split('/');
    var name = possibleSiblingPath.pop();

    if ((file !== possibleSibling) &&
        _.isEqual(path, possibleSiblingPath)) {

          siblings.push(files[possibleSibling]);
        }
  }

  files[file].siblings = siblings;
} 

function tree() {
  return function tree(files, metalsmith, done){
    for (var file in files) {
      addSiblings(file, files);
    }
    done();
  };
}

function dataToPreviewIndex (file, files) {
  if ((file.split('/').pop() === 'data.json')) {
    var data = _.extend({}, files[file], JSON.parse(files[file].contents));
    data.template = data.template || 'preview.hbt';
    files[file.replace('data.json', 'index.html')] = data;
    delete files[file];
  }
}

function previewIndexes () {
  return function previewIndexes(files, metalsmith, done){
    for (var file in files) {
      dataToPreviewIndex(file, files);
    }
    done();
  };
}


gulp.task('smith', function () {
  var defered = q.defer();

  MetalSmith(__dirname)
    .use(ignore(['**/_*.scss', '**/.**.**.swp', '**/.DS*']))
    .use(previewIndexes())
    .use(url())
    .use(tree())
    .use(collection({
      templates: 'templates/**/index.html'
    }))
    .use(sass({
      outputStyle: "expanded"
    }))
    .use(autoprefixer())
    .use(templates({
      engine: 'handlebars',
      directory: 'layouts'
    }))
    .destination(tmp)
    .build(function () {
      return defered.resolve.apply(defered, arguments);
    });

  return defered.promise;
});

gulp.task('build-tmp', ['smith'], function () {
  var xmlFilter = gulpFilter(['**/*.html', '**/*.svg']);

  return gulp.src(tmp + '/**/*', { base: tmp })
    .pipe(xmlFilter)
    .pipe(ejs({ 
        baseUrl: base.development, 
        version: Date.now()
      })
      .on('error', gutil.log))
    .pipe(xmlFilter.restore())
    .pipe(gulp.dest(tmp));
});

gulp.task('watch', ['build-tmp'], function() {
  gulp.watch('./src/**/*.*', ['build-tmp']);
});

gulp.task('serve', ['watch'], function () {
  return app
    .use(express.static(tmp))
    .listen(4000, function () {
      console.log('Express Server listening on 4000');
    });
});

gulp.task('ejs', ['smith'], function () {
  var xmlFilter = gulpFilter(['**/*.html', '**/*.svg']);

  return gulp.src(tmp + '/**/*', { base: './.tmp' })
    .pipe(xmlFilter)
    .pipe(ejs({ 
        baseUrl: base.production, 
        version: Date.now(),
        color: 'hsl(0, 100%, 30%)'
      })
      .on('error', gutil.log))
    .pipe(xmlFilter.restore())
    .pipe(gulp.dest(tmp));
});

gulp.task('build', ['ejs'], function () {
  return gulp.src(tmp + '/**/*', { base: tmp })
    .pipe(gulp.dest(prod));
});

gulp.task('deploy', function () {
  return gulp.src(prod + '/**/*.*')
    .pipe(deploy());
});

gulp.task('default', function () {
    return gulp.src('src/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['serve']);
