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



gulp.task('scripts', function() {
	return browserify('src/js/app.js')
	.transform('babelify', {
		presets: ['@babel/preset-env']
	})
	.bundle()
	.pipe(source('index.min.js'))
	.pipe(buffer())
	// Comment .pipe(uglify()) below for development
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
});

gulp.task('less', function () {
	return gulp.src('src/less/*.less')
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(concat('index.css'))
	.pipe(gulp.dest('dist/css'))
});
gulp.task('minify-css', function () {
	return gulp.src('dist/css/index.css')
	.pipe(cleanCSS({
		compatibility: 'ie8'
	}))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('dist/css'))
});

gulp.task('default', () =>{
	gulp.watch('src/js/**/*.js', gulp.series('scripts'))
	gulp.watch('src/less/**/*.less', gulp.series(gulp.parallel('less', 'minify-css')))
});