var gulp = require('gulp');
var execSync = require('exec-sync')
var prompt = require('prompt');

// http://regex101.com/r/fT7bX6
var versionRegexPattern = /^(.*(([\d]+)\.([\d]+)\.([\d]+)).*)-[\d]+-\S+/;

var patchOptions = ['p', 'patch'];
var minorOptions = ['i', 'minor'];
var majorOptions = ['m', 'major'];

var lastVersionInfo = getLastVersionInfo();
ask(
    'Current version ' + lastVersionInfo.version + '. What kind of version are you going to do? [(m)ajor | m(i)nor | (p)atch]',
    'p',
    function(versionType){ updateToNewVersion(lastVersionInfo, versionType); }
);

function updateToNewVersion(currentVersion, newVersionType){
    console.log(currentVersion, newVersionType);
    console.log(patchOptions.indexOf(newVersionType) > -1, patchOptions, newVersionType);
    if(patchOptions.indexOf(newVersionType) != -1){
        console.log("NEW PATCH");
    }else{
        console.log("NO NEW PATCH :(");
    }

}

function ask(question, defaultValue, callback){
    var schema = {
        properties: {
            version: {
                message: question,
                required: true
            }
        }
    };
    prompt.start();
    console.log(question);
    prompt.get(schema, function (err, result) {
        callback(result.version);
    });
}

function getLastVersionInfo(){
    var lastTagInfo = execSync('git describe', true);
    if(lastTagInfo.stderr){
        console.log(lastTagInfo.stderr);
        console.log("We can't find any tag version!");
        return getFirstVersion();
    }
    return matchVersionInTagInfo(lastTagInfo.stdout);
}

function matchVersionInTagInfo(tag){
    console.log(tag);
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

function getFirstVersion(tag){
    return {
        'tag'     : "0.0.0",
        'version' : "0.0.0",
        'major'   : 0,
        'minor'   : 0,
        'patch'   : 0
    };
}
