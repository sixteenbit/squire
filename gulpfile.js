'use strict';

const $ = require('gulp-load-plugins')();
const browser = require('browser-sync');
const gulp = require('gulp');
const yaml = require('js-yaml');
const fs = require('fs');
const yargs = require('yargs');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const zip = require('gulp-zip');

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from config.yml
const {URL, PATHS, POT, THEME} = loadConfig();

function loadConfig() {
	let ymlFile = fs.readFileSync('config.yml', 'utf8');
	return yaml.load(ymlFile);
}

// Delete the "release" folder
// This happens every time a build starts
function clean(done) {
	rimraf('release', done);
}

gulp.task('sass:style', function () {
	return gulp.src('src/scss/style.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATHS.sass.foundation,
			outputStyle: 'expanded'
		}))
		.pipe($.autoprefixer())
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest('./'))
		.pipe($.rtlcss())
		.pipe(rename({suffix: '-rtl'}))
		.pipe(gulp.dest('./'));
});

gulp.task('sass:editor', function () {
	return gulp.src('src/scss/style-editor.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATHS.sass.foundation,
			outputStyle: 'expanded'
		})
			.on('error', $.sass.logError))
		.pipe($.autoprefixer({}))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest('assets/css'))
		.pipe($.rtlcss())
		.pipe(rename({suffix: '-rtl'}))
		.pipe(gulp.dest('assets/css'));
});

gulp.task('sass:foundation', function () {
	return gulp.src('src/scss/vendors/foundation/foundation.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATHS.sass.foundation,
			outputStyle: 'expanded'
		})
			.on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.if(PRODUCTION, $.cssnano()))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest('assets/css'))
		.pipe($.rtlcss())
		.pipe(rename({suffix: '-rtl'}))
		.pipe(gulp.dest('assets/css'));
});

gulp.task('sass:motionui', function () {
	return gulp.src('src/scss/vendors/motion-ui/motion-ui.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATHS.sass.motionui,
			outputStyle: 'expanded'
		})
			.on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.if(PRODUCTION, $.cssnano()))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest('assets/css'))
		.pipe($.rtlcss())
		.pipe(rename({suffix: '-rtl'}))
		.pipe(gulp.dest('assets/css'));
});

gulp.task('sass:fontawesome', function () {
	return gulp.src('src/scss/vendors/fontawesome/fontawesome.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATHS.sass.fontawesome,
			outputStyle: 'expanded'
		})
			.on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.if(PRODUCTION, $.cssnano()))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest('assets/css'))
		.pipe($.rtlcss())
		.pipe(rename({suffix: '-rtl'}))
		.pipe(gulp.dest('assets/css'));
});

// Copy Font Awesome fonts
gulp.task('copy:fonts', function () {
	return gulp.src(PATHS.fonts.fontawesome)
		.pipe(gulp.dest('assets/webfonts'));
});

// Compiles Sass files into CSS
gulp.task('styles', gulp.series('sass:style', 'sass:foundation', 'sass:editor', 'sass:motionui', 'sass:fontawesome', 'copy:fonts'));

gulp.task('javascript:vendors', function () {
	return gulp.src(PATHS.javascript.vendors)
		.pipe($.sourcemaps.init())
		.pipe($.if(PRODUCTION, $.uglify({'mangle': false})))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest('assets/js'))
});

gulp.task('javascript:custom', function () {
	return gulp.src(PATHS.javascript.custom)
		.pipe($.sourcemaps.init())
		.pipe($.concat('scripts.js'))
		.pipe(gulp.dest('assets/js'))
		.pipe($.if(PRODUCTION, $.uglify({'mangle': false})))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest('assets/js'))
});

// Compiles JavaScript into a single file
gulp.task('javascript', gulp.series('javascript:vendors', 'javascript:custom'));

// Scan the theme and create a POT file.
function translate() {
	return gulp.src(PATHS.php)
		.pipe($.sort())
		.pipe($.wpPot({
			domain: POT.domain,
			package: POT.package
		}))
		.pipe(gulp.dest('languages/' + POT.domain + '.pot'));
}

// Optimize images, move into assets directory
gulp.task('images:optimize', function () {
	return gulp.src(PATHS.images)
		.pipe($.imagemin())
		.pipe(gulp.dest('assets/img'))
});

gulp.task('release:zip', function () {
	return gulp.src('release/**')
		.pipe(zip(THEME.CURRENT.slug + '.zip'))
		.pipe(gulp.dest('release'))
});

gulp.task('copy:dist', function () {
	return gulp.src(
		[
			'**/*',
			'!.*',
			'!config.yml',
			'!gulpfile.js',
			'!package.json',
			'!yarn.lock',
			'!release',
			'!release/**/*',
			'!node_modules',
			'!node_modules/**/*'
		]
	)
		.pipe(gulp.dest('release/' + THEME.CURRENT.slug))
});

// Replaces all theme specific names with new ones
gulp.task('rename:theme', function () {
	return gulp.src(['**/*', '!node_modules/**'])
		.pipe($.replace(THEME.CURRENT.name, THEME.NEW.name))
		.pipe($.replace(THEME.CURRENT.slug, THEME.NEW.slug))
		.pipe($.replace(THEME.CURRENT.prefix, THEME.NEW.prefix))
		.pipe($.replace(THEME.CURRENT.class, THEME.NEW.class))
		.pipe(gulp.dest('./'));
});

// Start a server with BrowserSync to preview the site in.
function server(done) {
	browser.init({
		proxy: URL,
		injectChanges: true
	});
	done();
}

// Watch for changes to assets and php files.
function watch() {
	gulp.watch('src/scss/**/*.scss').on('all', gulp.series(gulp.parallel('styles'), browser.reload));
	gulp.watch('src/js/**/*.js').on('all', gulp.series('javascript', browser.reload));
	gulp.watch('**/*.php').on('all', gulp.series(browser.reload));
}

// Build the assets by running all of the below tasks
gulp.task('build', gulp.series('styles', 'javascript', 'images:optimize', translate));

// Clean the directory, build the assets, and watch for file changes
gulp.task('watch', gulp.series(clean, 'build', watch));

// Build the assets, run the server, and watch for file changes
gulp.task('server', gulp.series('build', server, watch));

// Build project and copy to clean directory
gulp.task('release', gulp.series(clean, 'build', 'copy:dist', 'release:zip'));

// Clean directory and build the assets
gulp.task('default', gulp.series(clean, 'build'));

// Initial build of the project
gulp.task('init', gulp.parallel('build'));
