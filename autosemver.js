var exec = require('sync-exec');

autosemver = {

    MINOR: 'm',
    MAJOR: 'M',
    // http://regex101.com/r/fT7bX6
    versionRegexPattern: /^(.*(([\d]+)\.([\d]+)\.([\d]+)).*)-[\d]+-\S+/,
    run: function(){
    },
    getEmptyTagObject: function(){
        return {
            tag    : '0.1.0',
            version: '0.1.0',
            major  : '0',
            minor  : '1',
            patch  : '0'
        }
    },
    calculateNextVersion: function(tagObject, typeOfNewVersion){
        var newTagObject = tagObject;
        if(!typeOfNewVersion){
            newTagObject.patch = parseInt(newTagObject.patch) + 1;
        }
        if(typeOfNewVersion == this.MINOR){
            newTagObject.minor = parseInt(newTagObject.minor) + 1;
            newTagObject.patch = 0;
        }

        if(typeOfNewVersion == this.MAJOR){
            newTagObject.major = parseInt(newTagObject.major) + 1;
            newTagObject.minor = 0;
            newTagObject.patch = 0;
        }
        newTagObject.version = newTagObject.major + "." + newTagObject.minor + "." + newTagObject.patch;
        newTagObject.tag = newTagObject.version;
        return newTagObject;
    },
    matchVersionTagFromGitDescribe: function(versionString){
		if(!versionString) { return false; }
        var result = versionString.match(this.versionRegexPattern);
        var tag = {
            tag    : result[1],
            version: result[2],
            major  : result[3],
            minor  : result[4],
            patch  : result[5]
        }
		return tag;
	},
    getLastTag: function(cwd){
        // Set --long . Problems if sometimes long and sometimes short
        var execReturn = exec('git describe --long', {cwd: cwd});
        if(execReturn.status == 128){ return false;}
        return this.matchVersionTagFromGitDescribe(execReturn.stdout.replace("\n", ""));
    }
}

exports.autosemver = autosemver;