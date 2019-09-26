const { series, src, dest, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const pug = require('gulp-pug');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const dartSass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const uglify = require('gulp-uglify');

function HTML() {
  return src('src/**/*.html')
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function minifyHTML() {
  return src('src/**/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      }),
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function pugToHTML() {
  return src('src/**/*.pug')
    .pipe(
      pug({
        pretty: true,
      }),
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function pugToMinifyHTML() {
  return src('src/**/*.pug')
    .pipe(pug({}))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function ejsToHTML() {
  return src('src/**/*.ejs')
    .pipe(ejs({}))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function ejsToMinifyHTML() {
  return src('src/**/*.ejs')
    .pipe(ejs({}))
    .pipe(rename({ extname: '.html' }))
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      }),
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function sass() {
  return src('src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      dartSass({
        includePaths: ['./node_modules/bootstrap/scss'],
      }).on('error', dartSass.logError),
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function minifySass() {
  return src('src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      dartSass({
        outputStyle: 'compressed',
        includePaths: ['./node_modules/bootstrap/scss'],
      }).on('error', dartSass.logError),
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function javascript() {
  return src('src/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function minifyJS() {
  return src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function typescript() {
  return src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function minifyTS() {
  return src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function copyStatic() {
  return src('src/static/**/*')
    .pipe(dest('dist/static'))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  watch('src/**/*.html', series(HTML));
  watch('src/**/*.pug', series(pugToHTML));
  watch('src/**/*.ejs', series(ejsToHTML));
  watch('src/**/*.scss', series(sass));
  watch('src/**/*.js', series(javascript));
  watch('src/**/*.ts', series(typescript));
  watch('src/static/**/*', series(copyStatic));
}

exports.default = series(
  HTML,
  pugToHTML,
  ejsToHTML,
  sass,
  javascript,
  typescript,
  copyStatic,
  serve,
);

exports.build = series(
  minifyHTML,
  pugToMinifyHTML,
  ejsToMinifyHTML,
  minifySass,
  minifyJS,
  minifyTS,
  copyStatic,
);
