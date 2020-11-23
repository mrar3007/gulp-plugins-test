let project_folder = "dist";
let source_folder = "#src";

let path = {
    build: {
        html: project_folder+"/",
        css: project_folder+"/css/",
        js: project_folder+"/js/",
        img: project_folder+"/img/",
        fonts: project_folder+"/fonts/",
    },
    src: {
        html: [source_folder+"/*.html", "!" + source_folder+"/_*.html"],
        css: source_folder+"/scss/style.scss",
        js: source_folder +"/js/script.js",
        img: source_folder +"/img/**/*.{png, jpg, svg, gif, ico, webp}",
        fonts: source_folder +"/fonts/*.ttf",
    },
    watch: {
        html: source_folder +"/**/*.html",
        css: source_folder +"/scss/**/*.scss",
        js: source_folder +"/js/**/*.js",
        img: source_folder +"/img/**/*.{png, jpg, svg, gif, ico, webp}",
    },
    clean: './' + project_folder + '/'
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create();
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries');

function watchFiles(cb) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
}

function browserSync(cb) {
    browsersync.init({
        server: {
            baseDir: './'+project_folder+'/',
        },
        port: 3000,
        notify: false
    })
    cb();
}

function html(cb) {
    return src(path.src.html)
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function clean(cb) {
    return del(path.clean);
}

function css(cb) {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(gcmq())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

let build = gulp.series(clean, gulp.parallel(html, css));
let watch = gulp.parallel( build, browserSync, watchFiles );

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

