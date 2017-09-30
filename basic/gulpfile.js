//load plugins
var gulp           = require('gulp'),
	compass          = require('gulp-compass'),
  pug              = require('gulp-pug'),
	autoprefixer     = require('gulp-autoprefixer'),
	cleancss         = require('gulp-clean-css'),
	uglify           = require('gulp-uglify'),
	rename           = require('gulp-rename'),
	concat           = require('gulp-concat'),
	livereload       = require('gulp-livereload'),

	svgSprite        = require("gulp-svg-sprite"),
	svg2png          = require('gulp-svg2png'),
	image            = require('gulp-image'),

  iconfont         = require('gulp-iconfont'),
  iconfontCss      = require('gulp-iconfont-css'),

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
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleancss({
      compatibility: 'ie8'
    }))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(livereload());
});

//scripts
gulp.task('scripts', function() {
  return gulp.src(['app/scripts/plugins/*.js', 'app/scripts/app.js'])
    .pipe(concat('pp.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(livereload());
});

//templates
gulp.task('templates', function() {
  return gulp.src('app/pages/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(livereload());
});


// iconfonts
gulp.task('iconfont', function(){
  gulp.src(['app/fonticons/*.svg'])
    .pipe(iconfontCss({
      fontName: 'ppIconsFont',
      fontPath: '',
      path: 'app/styles/templates/iconsTemplate.scss',
      targetPath: '../../../app/styles/utilities/icons.scss'
    }))
    .pipe(iconfont({
      fontName: 'ppIconsFont',
      normalize: true,
      prependUnicode: true,
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
     }))
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(livereload());
});



//svg and png sprites
gulp.task('svgSprite', function () {

  gulp.src('app/spritesrc/*.svg')
    .pipe(image())
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
    .pipe(gulp.dest('dist/assets/i'))
    .pipe(livereload());
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
gulp.task('watch', function() {
	// livereload.listen({ start: true });

	//watch .scss files
	gulp.watch('app/styles/**/*.scss', ['styles']);

	//watch .pug files
	gulp.watch('app/pages/**/*.pug', ['templates']);

  //watch .js files
  gulp.watch('app/scripts/**/*.js', ['scripts']);

  //watch font icon files
  gulp.watch('app/fonticons/*.svg', ['iconfont']);

	//svg and png sprites
  gulp.watch('app/spritesrc/*.svg', ['sprite']);

	//font generate if ttf changes
	gulp.watch('dist/assets/fonts/*.ttf', ['fonts']);
});


//default
gulp.task('default', ['styles', 'templates', 'scripts', 'iconfont', 'sprite', 'fonts', 'watch']);
