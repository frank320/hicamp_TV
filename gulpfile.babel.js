//项目发布时使用

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import del from 'del'
// 自动载入所有gulp开头的模块
const plugins = gulpLoadPlugins()

gulp.task('clean', del.bind(null, ['dist', 'public']))

gulp.task('compile', [], () => {
  return gulp.src('./src/**/*.js')
    .pipe(plugins.babel())
    .pipe(gulp.dest('./dist'))
})

gulp.task('views', [], () => {
  // base 指定输出时文件的基础路径（排除掉的路径） 即输出的文件在views文件夹下
  return gulp.src('./src/views/**/*', {base: './src'})
    .pipe(gulp.dest('./dist'))
})

//压缩静态资源文件
gulp.task('uglifyJs', [], ()=> {
  return gulp.src('./www/assets/js/**/*.js', {base: './www'})
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./public'))
})
gulp.task('compressImg', () => {
  return gulp.src('./www/assets/img/**/*', {base: './www'})
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('./public'))
})
gulp.task('compressCss', [], ()=> {
  return gulp.src('./www/assets/css/**/*.css', {base: './www'})
    .pipe(plugins.cssnano())
    .pipe(gulp.dest('./public'))
})
gulp.task('swf', [], () => {
  // base 指定输出时文件的基础路径（排除掉的路径）
  return gulp.src('./www/assets/swf/**/*', {base: './www'})
    .pipe(gulp.dest('./public'))
})

gulp.task('build', ['clean'], () => {
  const taskArray = ['compile', 'views', 'uglifyJs', 'compressCss', 'compressImg', 'swf']
  return gulp.start(taskArray)
})
