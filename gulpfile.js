var gulp = require('gulp');
var execSync = require('exec-sync')

gulp.task('default', function(){
    var lastTag = execSync('git describe');
    console.log(lastTag);
});
