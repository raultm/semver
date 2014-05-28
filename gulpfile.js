var gulp = require('gulp');
var execSync = require('exec-sync')

// http://regex101.com/r/fT7bX6
var versionRegexPattern = /^(.*(([\d]+)\.([\d]+)\.([\d]+)).*)-[\d]+-\S+/;


gulp.task('default', function(){
    lastVersionInfo = getLastVersionInfo();
    console.log(lastVersionInfo);
    matchVersionInTagInfo('v1.4.26-draft-2-message');
});

function getLastVersionInfo(){
    var lastTagInfo = execSync('git describe');
    return matchVersionInTagInfo(lastTagInfo);
}

function matchVersionInTagInfo(tag){
    var result = tag.match(versionRegexPattern);
    if(!result){ return false; }
    return {
        'tag'     : result[1],
        'version' : result[2],
        'major'   : result[3],
        'minor'   : result[4],
        'patch'   : result[5]
    };
}
