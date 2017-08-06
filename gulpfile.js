'use strict';

const gulp  = require('gulp'),
	sass      = require('gulp-sass'),
	rename    = require('gulp-rename'),
	concat    = require('gulp-concat'),
	concatCss = require('gulp-concat-css'),
	minifycss = require('gulp-minify-css'),
	uglify    = require('gulp-uglifyjs'),
	autoprefixer = require('gulp-autoprefixer'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	sourcemaps = require('gulp-sourcemaps'),
	source = require('vinyl-source-stream');


/*** CONFIG ***/

const srcDir  = './src/';
const buildDir = './public/';

/*** GULP TASKS ***/

gulp.task('vendorCss', function() {
	var files = [
		'./bower_components/lumx/dist/lumx.css'
	];
	return gulp.src(files)
	.pipe(concatCss("vendor.css"))
	.pipe(minifycss(''))
	.pipe(rename("vendor.min.css"))
	.pipe(gulp.dest(buildDir));
});

gulp.task('vendorFonts', function () {
	return browserify({entries: srcDir+'/app/app.js'})
	.transform('babelify', {
		presets: ['es2015']
	})
	.bundle()
	.pipe(source('app.min.js'))
	.pipe(gulp.dest(buildDir));
});

gulp.task('vendorFonts', function() {
	var files = [
		'./bower_components/lumx/dist/fonts/**'
	];
    return gulp.src(files)
	.pipe(gulp.dest(buildDir+'fonts/'));
});

gulp.task('vendorJs', function() {
	var files = [
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/velocity/velocity.js',
		'./bower_components/moment/min/moment-with-locales.js',
		'./bower_components/angular/angular.js',
		'./bower_components/lumx/dist/lumx.js'
	];
	return gulp.src(files)
	.pipe(concat('vendor.min.js'))
	.pipe(uglify(''))
	.pipe(gulp.dest(buildDir));
});

gulp.task('js', function () {
	return browserify({entries: srcDir+'/app/app.js'})
	.transform('babelify', {
		presets: ['es2015']
	})
	.bundle()
	.pipe(source('app.min.js'))
	.pipe(gulp.dest(buildDir));
});

gulp.task('css', function () {
	return gulp.src(srcDir+'scss/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(concatCss("style.css"))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
	}))
	.pipe(minifycss(''))
	.pipe(rename("style.min.css"))
	.pipe(gulp.dest(buildDir));
});

gulp.task('watch', function () {
	gulp.watch(srcDir+'scss/**/*.scss', ['css']);
	gulp.watch(srcDir+'app/**/**', ['js']);
});

gulp.task('default', ['vendorCss', 'vendorFonts', 'vendorJs', 'js', 'css']);
