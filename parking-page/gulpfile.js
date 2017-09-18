//load plugins
var gulp             = require('gulp'),
	compass          = require('gulp-compass'),
	autoprefixer     = require('gulp-autoprefixer'),
	minifycss        = require('gulp-minify-css'),
	uglify           = require('gulp-uglify'),
	rename           = require('gulp-rename'),
	concat           = require('gulp-concat'),
	jade             = require('gulp-jade'),
	livereload       = require('gulp-livereload'),
	svgSprite        = require("gulp-svg-sprite"),
	svg2png          = require('gulp-svg2png'),
	svgo             = require('imagemin-svgo'),
	ttf2eot          = require('gulp-ttf2eot'),
	ttf2woff         = require('gulp-ttf2woff');

//styles
gulp.task('styles', function() {
	return gulp.src(['app/styles/*.scss'])
		.pipe(compass({
			css: 'dist/assets/css',
			sass: 'app/styles/',
			image: 'dist/assets/i',
			font: 'dist/assets/fonts'
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('dist/assets/css'))
    .pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss({
      compatibility: 'ie8',
      aggressiveMerging: false
    }))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(livereload());
});

//scripts
gulp.task('scripts', function() {
  return gulp.src(['app/scripts/plugins/*.js', 'app/scripts/app.js'])
    .pipe(concat('pp_parking.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(livereload());
});

//templates
gulp.task('templates', function() {
  return gulp.src('app/pages/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
});

//svg and png sprites
gulp.task('svgSprite', function () {

  gulp.src('app/spritesrc/*.svg')
    .pipe(svgo()())
    .pipe(svgSprite({
        "mode": {
            "css": {
                "spacing": {
                    "padding": 2
                },
                "dest": "./",
                "layout": "vertical",
                "sprite": "sprite.svg",
                "bust": false,
                "render": {
                    "scss": {
                        "dest": "../../../app/styles/utilities/sprite.scss",
                        "template": "app/styles/templates/sprite-template.scss"
                    }
                }
            }
        }
    }))
    .pipe(gulp.dest('dist/assets/i'));

});


gulp.task('pngSprite', ['svgSprite'], function() {
  gulp.src('dist/assets/i/sprite.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('dist/assets/i'));
});

gulp.task('sprite', ['pngSprite']);



//fonts generate
gulp.task('fonts', function(){
  gulp.src(['dist/assets/fonts/*.ttf'])
    .pipe(ttf2eot())
    .pipe(gulp.dest('dist/assets/fonts/'));

  gulp.src(['dist/assets/fonts/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('dist/assets/fonts/'));

});


//watch
gulp.task('live', function() {
	livereload.listen();

	//watch .scss files
	gulp.watch('app/styles/**/*.scss', ['styles']);

	//watch .jade files
	gulp.watch('app/pages/**/*.jade', ['templates']);

  //watch .js files
  gulp.watch('app/scripts/**/*.js', ['scripts']);

	//svg and png sprites
  gulp.watch('app/spritesrc/*.svg', ['sprite']);

	//font generate if ttf changes
	gulp.watch('dist/assets/fonts/*.ttf', ['fonts']);
});


//default
gulp.task('default', ['styles', 'templates', 'scripts', 'sprite', 'fonts', 'live']);
