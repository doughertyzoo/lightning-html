var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var bower = require('gulp-bower');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

var config = {
    sassPath: './resources/sass',
    jsPath: './resources/scripts',
    bowerDir: './bower_components',
    stylesDestDir: './public/styles',
    scriptsDestDir: './public/scripts',
    fontsDestDir: './public/fonts'
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir));
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/bootstrap-sass/assets/fonts/bootstrap/**.*')
        .pipe(gulp.dest(config.fontsDestDir));
});

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: [
        './resources/sass',
        config.bowerDir + '/bootstrap-sass/assets/stylesheets',
        config.bowerDir + '/font-awesome/scss'
    ]
};

gulp.task('css', function () {
    return gulp.src(config.sassPath + '/*.scss')
        .pipe(sass(sassOptions).on('error', notify.onError(function (error) {
            return "Error " + error.message;
        })))
        .pipe(autoprefixer())
        .pipe(gulp.dest(config.stylesDestDir));
});

gulp.task('js', function () {
    return gulp.src([
            config.bowerDir + '/jquery/dist/jquery.js',
            config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
            config.jsPath + '/*.js'
        ])
        .pipe(concat({
            path: 'scripts.js'
        }))
        .pipe(gulp.dest(config.scriptsDestDir));
});

gulp.task('watch', function() {
    return gulp.watch([config.sassPath + '/**/*.scss', config.jsPath + '/**/*.js'], ['css', 'js'])
        .on('change', notify.onError(function(event){
            return "File " + event.path + ' was ' + event.type + ', running tasks...'
        }));
});

gulp.task('default', ['bower', 'icons', 'css', 'js']);
