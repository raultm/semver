autosemver = {

    // http://regex101.com/r/fT7bX6
    versionRegexPattern: /^(.*(([\d]+)\.([\d]+)\.([\d]+)).*)-[\d]+-\S+/,
    matchTagFromGitDescribe: function(versionString){
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
	}
}

exports.autosemver = autosemver;