'use strict';

//=================
//   DEPENDENCIAS
//=================	
const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const eventStream = require('event-stream');
const condition = require('gulp-if');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const runSequence = require('gulp4-run-sequence');
const exec = require('child_process').exec;
const open = require('gulp-open');
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var mysqldump = require("mysqldump");
var sitemap = require("gulp-sitemap");
 
//=================
//  VARS
//=================
var version = "1.0.1"
let build = false;
runSequence.options.ignoreUndefinedTasks = true;

/** CONFIGURAÇÃO FTP **/
var user = "r3solucoesrp";
var password = "R3sol951";
var host = "ftp.web22f25.kinghost.net";
var port = 21;  
var localFilesGlob = ['./www/**/**/*'];
var remoteFolder = '/';

//=================
//  TASKS
//=================

//=== REMOVE web
//--- Apaga a pasta ./www
gulp.task('clean', function() {
    return gulp.src('./www/*')
    .pipe(clean());
});

/* =========================================================================
--- STYLES [.scss] ---------------------------------------------------------
========================================================================= */
//--- Compila os arquivos .SCSS e CSS de terceiros para um único arquivo .CSS
gulp.task('css-vendors', function() {
    return gulp.src([
        './node_modules/animate.css/animate.css',
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/flickity/dist/flickity.css',
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: true }))
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('./www/css'))
    .pipe(browserSync.stream());
});
//--- Compila os arquivos .SCSS personalizados para um único arquivo .CSS
gulp.task('css-ricks', function() {
    return gulp.src([
        './src/scss/ricks.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('ricks.css'))
    .pipe(gulp.dest('./www/css'))
    .pipe(browserSync.stream());
});
gulp.task('css-fonts', function() {
    return gulp.src([
        './src/fonts/**/*.css'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('fonts.css'))
    .pipe(gulp.dest('./www/fonts'))
    .pipe(browserSync.stream());
});

/* =========================================================================
--- SCRIPTS [.js] ----------------------------------------------------------
========================================================================= */
//--- Compila os arquivos de Scripts para um único arquivo .js
//** obs: favor não mudar a ordem dos itens abaixo
gulp.task('js-vendors', function() {
    return eventStream.merge([
        gulp.src([
            './node_modules/jquery/dist/jquery.js',
            './node_modules/jquery.cookie/jquery.cookie.js',
            // './node_modules/popper.js/dist/popper.js',
            // './node_modules/bootstrap/dist/js/bootstrap.js',
            './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
            './node_modules/flickity/dist/flickity.pkgd.js',
            './node_modules/vanilla-tilt/dist/vanilla-tilt.js'
        ])
    ])
    .pipe(concat('vendors.js'))
    .pipe(condition(build, uglify()))
    .pipe(gulp.dest('./www/js'));
});
//--- Compila os arquivos de Scripts dos componentes .js
gulp.task('js-componente', function() {
    return eventStream.merge([
        gulp.src([
            './src/components/**/*.js'
        ])
    ])
    .pipe(concat('components.js'))
    .pipe(condition(build, uglify()))
    .pipe(gulp.dest('./www/js'));
});
//--- Compila os arquivos de funções .js
gulp.task('js-ricks', function() {
    return eventStream.merge([
        gulp.src([
            './src/js/scripts.js',
            // './src/js/functions.js',
        ])
    ])
    .pipe(concat('ricks.js'))
    .pipe(condition(build, uglify()))
    .pipe(gulp.dest('./www/js'));
});

/* =========================================================================
--- FONTs [.css, .ttf, .eot, .svg, .woff] ----------------------------------
========================================================================= */
// //--- Copia todos os arquivos de fonts para a pasta ./www/fonts
gulp.task('copy-fonts', function() {
    return gulp.src([
        // './src/fonts/fontawesome/*',
        './src/fonts/flaticon/*',
        './src/fonts/Montserrat/*',
        './src/fonts/CaviarDreams/*',
        './src/fonts/Voor/*',
    ])
    .pipe(plumber())
    .pipe(gulp.dest('./www/fonts/'));
});
/* =========================================================================
--- Anexos -----------------------------------------------------------------
========================================================================= */
// //--- Copia as pastas de anexos para o site
gulp.task('copy-anexos', function() {
    return gulp.src([
        './src/anexos/**/*',
    ])
    .pipe(plumber())
    .pipe(gulp.dest('./www/anexos/'));
});

/* =========================================================================
--- IMAGENS [.jpg, .png, .gif, .svg, .ico] ---------------------------------
========================================================================= */
//--- Copia todas as imagens para a pasta ./www/img
gulp.task('copy-images', function() {
    return gulp.src([
        './src/img/**/**/*.png',
        './src/img/**/**/*.jpg',
        './src/img/**/**/*.gif',
        './src/img/**/**/*.jpeg',
        './src/img/**/**/*.svg',
        './src/img/**/**/*.ico'
    ])
    .pipe(gulp.dest('./www/img/'));
});

/* =========================================================================
--- ARQUIVOS [.html, .htm, .asp, .txt] -------------------------------------
========================================================================= */
//--- Copia todos os arquivos de erros para a pasta ./www/error
gulp.task('copy-error-files', function() {
    return gulp.src(['./src/error/**/*'])
    .pipe(plumber())
    .pipe(gulp.dest('./www/error/'));
});
//--- Copia os arquivo .html e .asp para a pasta ./www
gulp.task('copy-html', function() {
    return gulp.src([
        './src/**/**/*.htm',
        './src/**/**/*.html',
        './src/**/**/*.asp',
        './src/**/**/*.txt',
    ])
    .pipe(gulp.dest('./www'));
});

/* =========================================================================
--- MINIFICAR ARQUIVOS [.css, .js, .jpg, .png, .gif, .] --------------------
========================================================================= */
//--- Minifica o arquivo vendors.css para vendors.min.css
gulp.task('minify-vendors', function() {
    return gulp.src([
        './www/css/vendors.css'
    ])
    .pipe(concat('vendors.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./www/css'));
});
//--- Minifica o arquivo ricks.css para ricks.min.css
gulp.task('minify-ricks', function() {
    return gulp.src([
        './www/css/ricks.css'
    ])
    .pipe(concat('ricks.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./www/css'));    
});
//--- Minifica o arquivo fonts.css para fonts.min.css
gulp.task('minify-fonts', function() {
    return gulp.src([
        './www/fonts/fonts.css'
    ])
    .pipe(concat('fonts.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./www/fonts'));
});
//--- Minifica o arquivo vendors.js para vendors.min.js
gulp.task('minify-js-vendors', function() {
    return gulp.src([
        './www/js/vendors.js'
    ])
    .pipe(concat('vendors.min.js'))
    .pipe(gulp.dest('./www/js'));
});
//--- Minifica o arquivo components.js para components.min.js
gulp.task('minify-js-components', function() {
    return gulp.src([
        './www/js/components.js'
    ])
    .pipe(concat('components.min.js'))
    .pipe(gulp.dest('./www/js'));
});
//--- Minifica o arquivo ricks.js para ricks.min.js
gulp.task('minify-js-ricks', function() {
    return gulp.src([
        './www/js/ricks.js'
    ])
    .pipe(concat('ricks.min.js'))
    .pipe(gulp.dest('./www/js'));
});
//--- Minifica os arquivos de imagens
gulp.task('minify-img', function() {
    return gulp.src('./www/img/**/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest('./www/img'));
});

/* =========================================================================
--- TAREFAS DE BUILD [dev / prod] ------------------------------------------
========================================================================= */
//--- Processamento de imagens
gulp.task('imgs', function(callback) {
    runSequence(
        ['copy-images'],
        ['minify-img'],
        callback
    );
});
//--- Processamento de arquivos
gulp.task('files', function(callback) {
    runSequence(
        ['copy-fonts', 'copy-anexos', 'copy-error-files', 'copy-images', 'copy-html'],
        ['minify-img'],
        callback
    );
});
//--- Processamento de scripts
gulp.task('js', function(callback) {
    runSequence(
        ['js-vendors', 'js-componente', 'js-ricks'],
        ['minify-js-vendors', 'minify-js-components', 'minify-js-ricks'],
        callback
    );
});
//--- Processamento de styles
gulp.task('css', function(callback) {
    runSequence(
        ['css-vendors', 'css-ricks', 'css-fonts'],
        ['minify-vendors', 'minify-ricks', 'minify-fonts'],
        callback
    );
});

/* =========================================================================
--- COMPILAÇÃO [dev / prod] ------------------------------------------------
========================================================================= */
//--- Executa todas as funções para subida do ambiente de desenvolvimento
gulp.task('default', function(callback) {
    runSequence(
        'clean', 
        ['css', 'js', 'files'],
        ['sitemap'],
        ['open'],
        callback
    );
});
//--- Executa todas as funções para subida do ambiente de desenvolvimento
gulp.task('prod', function(callback) {
    build = true;
    runSequence(
        'clean', 
        ['css', 'js','files'],
        ['sitemap'],
        'ftp-deploy',
        callback
    );
});

/* =========================================================================
--- EXECUÇÃO DO PROJETO NAVEGADOR ------------------------------------------
========================================================================= */
gulp.task('open', function(){
    gulp.src('./www/')
    .pipe(open({
        uri: 'http://localhost:4008/index.asp',
        app: 'chrome',
        // para subir um servidor em localhost use: "$ npx serve 80 ."
    }));
    return gulp.watch([
        './src/js/**/*.js', 
        './src/components/**/*.js'
    ], gulp.series('js')),
    // gulp.watch([
    //     './src/**/**/**/*.jpg', 
    //     './src/**/**/**/*.png', 
    //     './src/**/**/**/*.ico', 
    //     './src/**/**/**/*.jpeg', 
    //     './src/**/**/**/*.gif' 
    // ], gulp.series('imgs')),
    gulp.watch([
        './src/scss/*.scss', 
        './src/fonts/**/*.css', 
        './src/fonts/**/*.scss', 
        './src/components/**/*.scss'
    ], gulp.series('css')),
    gulp.watch([
        './src/**/**/**/*.html', 
        './src/**/**/**/*.htm', 
        './src/**/**/**/*.asp',
        './src/**/**/**/*.txt'
    ], gulp.series('copy-html'));
});

/* =========================================================================
--- GERADOR DO ARQUIVO SITEMAP.xml -----------------------------------------
========================================================================= */
gulp.task('sitemap', function () {
    return gulp.src([
        'www/*.html',
        'www/*.asp',
    ], {
        read: false
    })
        .pipe(sitemap({
            siteUrl: 'https://www.riospartners.com.br', 
            fileName: 'sitemap.xml', 
            changefreq: 'always', 
            priority: 0.6, 
            lastmod: Date.now(),
        }))
        .pipe(gulp.dest('./www'));
});

/* =========================================================================
--- FTP PRODUÇÃO -----------------------------------------------------------
========================================================================= */
// helper function to build an FTP connection based on our configuration
function getFtpConnection() {  
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 10,
        log: gutil.log
    });
}
gulp.task('ftp-deploy', function() {
    var conn = getFtpConnection();
    return gulp.src(localFilesGlob, { base: '.', buffer: false })
        .pipe( conn.newer( remoteFolder ) ) // only upload newer files 
        .pipe( conn.dest( remoteFolder ) ) ;
});
