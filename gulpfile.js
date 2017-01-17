var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
//    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer');
    
//gulp.task('pug', function() {
//    return gulp.src('app/pug/**/*.pug')
//        .pipe(pug({
//            pretty: true
//        })) 
//        .pipe(gulp.dest('app/'));
//});
gulp.task('sass', function() {
    return gulp.src('src/sass/main.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions','>1%','ie 8','ie 7'],{cascade:true}))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream:true}))
});
gulp.task('scripts',function(){
    return gulp.src([
        'src/js/libs/jquery-1.12.4n.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});
gulp.task('clean',function(){
    return del.sync('dist');
});
gulp.task('clear',function(){
    return cache.clearAll();
});
gulp.task('browser-sync',function(){
    browserSync({
        server:{
            baseDir:'src'
        },
        notify:false
    });
});
gulp.task('img',function(){
   return gulp.src('src/images/**/*')
   .pipe(cache(imagemin({
       interlaced:true,
       progressive:true,
       svgoPlugins:[{removeViewBox:false}],
        use:[pngquant()]
         
   })))
    .pipe(gulp.dest('build/img'));
});
gulp.task('watch',['browser-sync','sass','scripts'],function(){
    gulp.watch('src/sass/**/*.scss',['sass']);
    // gulp.watch('src/pug/*.pug',['pug']);
    gulp.watch('src/**/*.html',browserSync.reload);
    gulp.watch('src/js/**/*.js',browserSync.reload);
});

gulp.task('build',['clean','images','sass','scripts'],function(){
    var buildCss=gulp.src([
        'src/css/main.css'
    ])
    .pipe(gulp.dest('build/css'));
    
    var buildFonts=gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'));
    
    var buildsJs=gulp.src('src/js/**/*')
    // .pipe(concat('build/js/main.js'))
    .pipe(gulp.dest('build/js'));
    
    var buildHtml=gulp.src('/*.html')
    .pipe(gulp.dest('build'));
})