var gulp = require('gulp');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var uglify = require('gulp-uglify');

var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');

var concat = require('gulp-concat');
var path = require('path');
var rename = require('gulp-rename');
var gulpSequence = require('gulp-sequence')

gulp.task('scripts', function() {
	browserify('src/js/app.js')
	.transform('babelify', {
		presets: ['env']
	})
	.bundle()
	.pipe(source('index.min.js'))
	.pipe(buffer())
	// Comment .pipe(uglify()) below for development
	// .pipe(uglify())
	.pipe(gulp.dest('dist/js'))
});

gulp.task('less', function (callback) {
	return gulp.src('src/less/*.less')
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(concat('index.css'))
	.pipe(gulp.dest('dist/css'))
});
gulp.task('minify-css', function (callback) {
	return gulp.src('dist/css/index.css')
	.pipe(cleanCSS({
		compatibility: 'ie8'
	}))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('dist/css'))
});
gulp.task('less-sequence', gulpSequence('less', 'minify-css'))

gulp.task('default', () =>{
	gulp.watch('src/js/**/*.js', ['scripts'])
	gulp.watch('src/less/**/*.less', function (event) {
		gulpSequence('less', 'minify-css')(function (err) {
		  if (err) console.log(err)
		})
	  })
});