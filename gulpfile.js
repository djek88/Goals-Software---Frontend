var path = require('path');
var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var useref = require('gulp-useref');
var minifyHTML = require('gulp-minify-html');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');

var scripts = require('./app.scripts.json');

var source = {
	js: {
		main: './app/main.js',
		src: [
			// application config
			'./app.config.js',

			// application bootstrap file
			'./app/main.js',

			// main module
			'./app/app.js',

			// module files
			'./app/**/module.js',

			// other js files [controllers, services, etc.]
			'./app/**/!(module)*.js',
		],
		tpl: './app/**/*.tpl.html'
	},
	html: './app/**/*.html'
};

var destinations = {
	js: './dist'
};

gulp.task('build', function(){
	return es.merge(gulp.src(source.js.src), getTemplateStream())
		.pipe(wrap('(function(){\n<%= contents %>\n})();'))
		.pipe(concat('app.js'))
		.pipe(gulp.dest(destinations.js))
		.pipe(connect.reload());
});

gulp.task('app-minify', ['build'], function() {
	gulp.src(path.join(destinations.js, 'app.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(destinations.js));
});

gulp.task('vendor', function(){
	var paths = [];
	scripts.prebuild.forEach(function(script) {
		paths.push(scripts.paths[script]);
	});
	gulp.src(paths)
		.pipe(concat('vendor.js'))
		//.on('error', swallowError)
		.pipe(gulp.dest(destinations.js));
});

gulp.task('watch', ['build', 'html-minify', 'html-index'], function(){
	gulp.watch(source.js.src, ['build']);
	gulp.watch(source.js.tpl, ['build']);
	gulp.watch(source.html, ['html-minify']);
	gulp.watch('./index.html', ['html-index']);
});

gulp.task('connect', function() {
	connect.server({
		port: 1337,
		root: './dist',
		fallback: './dist/index.html',
		livereload: true
	});
});

gulp.task('html-minify', function(){
	gulp.src(source.html)
		.pipe(minifyHTML({
			conditionals: true,
			spare: true
		}))
		.pipe(gulp.dest(path.join(destinations.js, 'app')))
		.pipe(connect.reload());
});

gulp.task('resource', function() {
	return gulp.src(['./plugin/**/*', './smartadmin-plugin/**/*', './sound/*', './langs/*', './styles/**/*', '!./styles/css/**/*', './app.scripts.json'], {
		base: './'
	}).pipe(gulp.dest(path.join(destinations.js)));
});

gulp.task('html-index', function(){
	gulp.src(['./index.html'])
		.pipe(useref())
		//.pipe(gulpif('*.css', cssnano({discardComments: {removeAll: true}})))
		.pipe(gulpif('*.html', minifyHTML()))
		.pipe(gulp.dest(destinations.js))
		.pipe(connect.reload());
});

gulp.task('default', ['vendor', 'build', 'app-minify', 'html-index', 'html-minify', 'resource', 'watch', 'connect']);

gulp.task('prod', ['vendor', 'build', 'app-minify', 'html-index', 'html-minify', 'resource']);

var swallowError = function(error){
	console.log(error.toString());
	this.emit('end');
};

var getTemplateStream = function(){
	return gulp.src(source.js.tpl)
		.pipe(templateCache({
			root: 'app/',
			module: 'app'
		}));
};