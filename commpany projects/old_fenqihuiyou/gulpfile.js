//for pro
var gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    md5 = require('gulp-md5-plus'),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver'),
    url = require('url'),
    fs = require('fs'),
    autoprefixer = require('gulp-autoprefixer'),
    tinypng = require('gulp-tinypng'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    babel = require("gulp-babel");

var gulp = require('gulp');
var rev = require('gulp-rev');


gulp.task('cssrev', function () {
    return gulp.src('src/static/css/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('fenqihui/static/css'));
});

var filePath = {
    imgs_path: ['src/static/bitmap/**/*.{png,jpg,gif,ico,webp}'],
    css_path: ['src/static/css/**/*.scss', 'src/static/css/**/*.css'],
    clear_path: 'fenqihui',
    html_path: ['src/**/*.html'],
    js_path: ['src/static/js/**/*.js'],
};

var browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));

gulp.task('fileinclude', function (done) {
    gulp.src(filePath.html_path)
        .pipe(changed(filePath.clear_path))
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('fenqihui'))
        .on('end', done);
});

gulp.task('copy:images', function (cb) {
    // the function provide a  callBack tell you finish the task in terminal
    gulp.src(filePath.imgs_path)
        .pipe(changed(filePath.clear_path))
        .pipe(plumber())
        .pipe(gulp.dest('fenqihui/static/bitmap')).on('end', cb);
});

var API_KEY = 'OtXQFrh8IpgTIf01Hv272PSNxH7t4UhD';
gulp.task('tinypng', function () {
    gulp.src(filePath.imgs_path)
        .pipe(changed(filePath.clear_path))
        .pipe(plumber())
        .pipe(tinypng({
            key: API_KEY,
            sigFile: 'images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('images'));
});

gulp.task('sassmin', function (cb) {
    gulp.src(filePath.css_path)
        .pipe(changed(filePath.clear_path))
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('fenqihui/static/css/'))
        .on('end', cb);
});

gulp.task('minify-js', function () {
    return gulp.src(filePath.js_path)
        .pipe(changed(filePath.clear_path))
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        //.pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('./fenqihui/static/js'));  //输出
});

gulp.task('md5:js', ['minify-js'], function (done) {
    gulp.src('fenqihui/static/js/**/*.js')
        .pipe(plumber())
        .pipe(md5(10, 'fenqihui/**/*.html'))
        .pipe(gulp.dest('fenqihui/static/js'))
        .on('end', done);
});

gulp.task('md5:css', ['sassmin'], function (done) {
    gulp.src('fenqihui/static/css/**/*.css')
        .pipe(plumber())
        .pipe(md5(10, 'fenqihui/**/*.html'))
        .pipe(gulp.dest('fenqihui/static/css'))
        .on('end', done);
});

gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(plumber())
        .pipe(webserver({
            port: 5000,
            livereload: false,
            directoryListing: {
                enable: true,
                path: './'
            },
            middleware: function (req, res, next) {
                var urlObj = url.parse(req.url, true);
                switch (urlObj.pathname) {
                    case '/api/getLivelist.php':
                        res.setHeader('Content-type', 'application/json');
                        fs.readFile('./mock/livelist.json', '', function (err, data) {
                            res.end(data);
                        });
                        return;
                    case '/api/ppp':
                        res.setHeader('Content-type', 'application/json');
                        // console.log(88);
                        return;
                    case '/api/main.php':
                        res.setHeader('Content-type', 'application/json');
                        fs.readFile('./mock/main.json', '', function (err, data) {
                            res.end(data);
                        });
                        return;
                }
                next();
            }
        }));
});

gulp.task('clear', function (done) {
    gulp.src(filePath.clear_path)
        .pipe(clean())
        .on('end', done);
});

gulp.task('open', ['copy:images'], function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:5000/fenqihui/index.html'
        }))
        .on('end', done);
});

gulp.task('watch', function (done) {
    // gulp.watch('src/**/*', ['sassmin', 'minify-js', 'fileinclude']).on('end', done);
    gulp.watch(filePath.js_path, ['minify-js']).on('end', done);
    gulp.watch(filePath.css_path, ['sassmin']).on('end', done);
    gulp.watch(filePath.html_path, ['fileinclude']).on('end', done);
    gulp.watch(filePath.imgs_path, ['copy:images']).on('end', done);
});

//publish
gulp.task('default', ['webserver', 'fileinclude', 'copy:images', 'md5:css', 'md5:js', 'cssrev','watch', 'open']);

//develop  finish copy imgs .. work
gulp.task('dev', ['webserver', 'copy:images', 'sassmin', 'minify-js', 'fileinclude', 'watch', 'open']);

