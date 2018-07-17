var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() {
  return gulp.src('./generator-starter/*')
    .pipe(ghPages({'remoteUrl':'https://github.com/WQRice/generatorDeplyment.git'}));
});
