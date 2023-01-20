const { src, dest, series, watch } = require("gulp");
const clean = require("gulp-clean");
const woff2 = require("gulp-ttf2woff2");
const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");
const htmlBem = require("gulp-html-bem-validator");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const sass = require("gulp-sass")(require("sass"));
const cssMediaGroup = require("gulp-group-css-media-queries");
const cssComb = require("gulp-csscomb");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");

// Cleaning up the build folder
const cleanDistFolder = () => {
  return src("dist", { allowEmpty: true }).pipe(clean());
};

// Compiling fonts TTF -> WOFF2
const buildFonts = () => {
  return src("src/fonts/*.ttf").pipe(woff2()).pipe(dest("dist/fonts"));
};

const cleanFonts = () => {
  return src("dist/fonts/*.woff2").pipe(clean());
};

// Copying files
const buildFiles = () => {
  return src("src/files/**/*").pipe(dest("dist/files"));
};

const cleanFiles = () => {
  return src("dist/files/**/*").pipe(clean());
};

// Copying third-party libraries
const buildLibs = () => {
  return src("src/libs/**/*").pipe(dest("dist/libs"));
};

const cleanLibs = () => {
  return src("dist/libs/**/*").pipe(clean());
};

// Compiling PUG -> HTML
const buildHTML = () => {
  return src("src/pages/*.pug")
    .pipe(
      pug({
        basedir: "src/pages/",
        pretty: true,
      })
    )
    .pipe(dest("dist"))
    .pipe(htmlBem())
    .pipe(browserSync.stream());
};

const cleanHTML = () => {
  return src("dist/**/*.html").pipe(clean());
};

// Image optimization
const buildIMG = () => {
  return src("src/images/**/*.{jpg,jpeg,png,svg,ico,gif}")
    .pipe(cache(imagemin()))
    .pipe(dest("dist/images"))
    .pipe(browserSync.stream());
};

const cleanIMG = () => {
  return src("dist/images/**/*").pipe(clean());
};

// Build JS
const buildJS = () => {
  return src("src/*.js").pipe(dest("dist/js")).pipe(browserSync.stream());
};

const cleanJS = () => {
  return src("dist/*.js").pipe(clean());
};

// Compiling SCSS -> CSS
const buildCSS = () => {
  return src("src/style.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(cssMediaGroup())
    .pipe(cssComb())
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
};

const cleanStyles = () => {
  return src("dist/**/*.css").pipe(clean());
};

// Live server
const buildServer = () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
};

watch("src/fonts/*.ttf", series(cleanFonts, buildFonts));
watch("src/files/**/*", series(cleanFiles, buildFiles));
watch("src/libs/**/*", series(cleanLibs, buildLibs));
watch("src/**/*.pug", series(cleanHTML, buildHTML));
watch("src/images/**/*", series(cleanIMG, buildIMG));
watch("src/*.js", series(cleanJS, buildJS));
watch("src/**/*.scss", series(cleanStyles, buildCSS));

exports.dev = series(
  cleanDistFolder,
  buildFonts,
  buildFiles,
  buildLibs,
  buildHTML,
  buildIMG,
  buildJS,
  buildCSS,
  buildServer
);

exports.prod = series(
  cleanDistFolder,
  buildFonts,
  buildFiles,
  buildLibs,
  buildHTML,
  buildIMG,
  buildJS,
  buildCSS
);
