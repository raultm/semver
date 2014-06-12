var exec = require('sync-exec');
var fs = require('fs');
var extend = require('util')._extend;

autosemver = {

    MINOR: 'm',
    MAJOR: 'M',
    // http://regex101.com/r/fT7bX6
    versionRegexPattern: /^(.*(([\d]+)\.([\d]+)\.([\d]+)).*)-[\d]+-\S+/,
    run: function(cwd){
        if(!cwd){ return false; }
        var tagObject = this.getLastTag(cwd);
        var newTagObject = this.calculateNextVersion(tagObject);
        this.applyNewTag(cwd, newTagObject);
        this.releaseNewTag(cwd);
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
        var newTagObject = extend({}, tagObject);
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
    },
    updateVersionFile: function(cwd, tagObject){
        if(!cwd || !tagObject){ return false; }
        if(!tagObject.tag){ return false; }
        fs.writeFileSync(cwd + "/" + "VERSION", tagObject.tag);
        return true;
    },
    applyNewTag: function(cwd, tagObject){
        if(!cwd || !tagObject){ return false; }
        this.updateVersionFile(cwd, tagObject);
        return true;
    },
    releaseNewTag: function(cwd, newTagObject){
        if(!cwd || !newTagObject){ return false; }
        var tagCommand = "git tag " + newTagObject.tag + " -m 'New Release " + newTagObject.tag + "'";
        this.exec('git add .', {cwd: cwd});
        this.exec('git commit -m "New Release"', {cwd: cwd});
        this.exec(tagCommand, {cwd: cwd});
        return true;
    },
    exec: function(cmd, cwd){
        return exec(cmd, {cwd: cwd});
    }
}

exports.autosemver = autosemver;