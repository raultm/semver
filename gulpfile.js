var gulp = require('gulp');
var execSync = require('exec-sync')
var prompt = require('prompt');

// http://regex101.com/r/fT7bX6
var versionRegexPattern = /^(.*(([\d]+)\.([\d]+)\.([\d]+)).*)-[\d]+-\S+/;


gulp.task('default', function(){
    lastVersionInfo = getLastVersionInfo();
    ask(
        'Current version ' + lastVersionInfo.version + '. What kind of version are you going to do? [(m)ajor | m(i)nor | (p)atch]',
        'p',
        function(versionType){ console.log(versionType); }
    );
});

function ask(question, defaultValue, callback){
    prompt.start();
    console.log(question);
    prompt.get(['version'], function (err, result) {
        callback(result.version);
    });
}

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
