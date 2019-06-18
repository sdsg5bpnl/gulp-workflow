const { series, src, dest, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
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
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function sass() {
  return src('src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(dartSass().on('error', dartSass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function minifySass() {
  return src('src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(dartSass({ outputStyle: 'compressed' }).on('error', dartSass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function javascript() {
  return src('src/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function minifyJS() {
  return src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
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
};

function minifyTS() {
  return src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
};

function copyStatic() {
  return str('src/static/**/*')
    .pipe(dest('dist/static'))
    .pipe(browserSync.stream());
};

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  watch('src/**/*.html', series(HTML));
  watch('src/**/*.scss', series(sass));
  watch('src/**/*.js', series(javascript));
  watch('src/**/*.ts', series(typescript));
  watch('src/static/**/*', series(copyStatic));
}

exports.default = series(HTML, sass, javascript, typescript, copyStatic, serve);
exports.build = series(minifyHTML, minifySass, minifyJS, minifyTS, copyStatic);
