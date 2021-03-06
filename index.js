var exec = require('sync-exec');
var fs = require('fs');
var extend = require('util')._extend;

autosemver = {

    PATCH: 'p',
    MINOR: 'm',
    MAJOR: 'M',
    HELP: 'h',
    LABEL: 'l',
    VERBOSE: 3,
    WARNING: 2,
    INFO: 1,
    // http://regex101.com/r/fT7bX6
    versionRegexPattern: /^(.*(([\d]+)\.([\d]+)\.([\d]+)).*)-[\d]+-\S+/,
    defaultCLIValues: {
        cwd: './',
        typeOfNewVersion: 'p',
        help: false,
    },
    lastTagMessage: 'The last tag used is ',
    nextTagMessage: 'The next tag to release is ',
    commitMessage: 'New Release',
    versionFileUpdated: 'The VERSION file was updated with the new version',
    commitCreatedMessage: 'A new commit has been created: ',
    logFunction: console.log,
    debug: 2,
    log: function(message, level){
        if(!message){ return false; }
        if(!level){ level = this.WARNING; }
        if(level > this.debug){ return false; }
        this.logFunction(message);
        return {message: message, level: level};
    },
    run: function(cwd, typeOfNewVersion){
        if(!cwd){ return false; }
        cwd = cwd.replace("\n", "");
        if(!typeOfNewVersion) { typeOfNewVersion = this.PATCH; }
        var tagObject = this.getLastTag(cwd);
        this.log(this. lastTagMessage + tagObject.tag, this.INFO);
        var newTagObject = this.calculateNextVersion(tagObject, typeOfNewVersion);
        this.log(this. nextTagMessage + newTagObject.tag, this.INFO);
        this.applyNewTag(cwd, newTagObject);
        this.log(this.versionFileUpdated, this.INFO);
        this.releaseNewTag(cwd, newTagObject);
        this.log(this.commitCreatedMessage + this.commitMessage, this.INFO);
    },
    clirun: function(){
        var params = this.parseArgvParams(process.argv, process.cwd());
        if(params.help === true){
            return this.help();
        }
        this.run(params.cwd, params.typeOfNewVersion);
    },
    help: function(){
        this.log("-----------------------------");
        this.log("  HELP MESSAGE");
        this.log("-----------------------------");
        this.log("");
        this.log("  -h This Help Message");
        this.log("  -p Apply Patch Version");
        this.log("  -m Apply Minor Version");
        this.log("  -M Apply Major Version");
        this.log('  -l Set Commit message(eg. gitsv -l "Behaviour Feature")');
    },
    parseArgvParams: function(options, cwd){
        if(!options || !cwd || options.length < 2){ return false; }
        var customValues = {};
        if(options.indexOf("-" + this.HELP) != -1){ customValues.help = true; }
        if(options.indexOf("-" + this.MAJOR) != -1){ customValues.typeOfNewVersion = this.MAJOR; }
        if(options.indexOf("-" + this.MINOR) != -1){ customValues.typeOfNewVersion = this.MINOR; }
        if(options.indexOf("-" + this.PATCH) != -1){ customValues.typeOfNewVersion = this.PATCH; }
        var labelOptionIndex = options.indexOf("-" + this.LABEL);
        if(labelOptionIndex != -1 && options[labelOptionIndex + 1]){
            this.commitMessage = options[labelOptionIndex + 1];
        }
        var getGitRoot = this.exec('git rev-parse --show-toplevel', cwd);
        customValues.cwd = getGitRoot.stdout;
        var cliValues = extend(this.defaultCLIValues, customValues);
        return cliValues;
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
        if(!tagObject) {
            tagObject = this.getEmptyTagObject();
            if (typeOfNewVersion !== this.MAJOR) {
                return tagObject;
            }
        }
        var newTagObject = extend({}, tagObject);
        if(!typeOfNewVersion){ typeOfNewVersion = this.PATCH; }
        if(typeOfNewVersion == this.PATCH){
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
        newTagObject.tag = newTagObject.tag.replace(tagObject.version, newTagObject.version);
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
        var execReturn = this.exec('git describe --long', cwd);
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
        this.exec('git add VERSION', cwd);
        this.exec('git commit -m "' + this.commitMessage + '"', cwd);
        this.exec(tagCommand, cwd);
        return true;
    },
    exec: function(cmd, cwd){
        return exec(cmd, {cwd: cwd});
    }
}

module.exports = (function(){
    return autosemver;
})();