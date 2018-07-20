var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() {
  return gulp.src('./**/*')
    .pipe(ghPages({'remoteUrl':'https://github.com/WQRice/generatorDeplyment.git','branch':'starter1.0.0'}));
});
